import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CandidatoService } from 'src/app/core/services/candidato.service';
import { Observable } from 'rxjs';
import { Candidato } from 'src/app/models/candidato';
import { FormularioService } from 'src/app/core/services/formulario.service';
import { ConfigGoogleForm } from 'src/app/models/googleForm';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent implements OnInit {
  variableDeControl: number = 1;
  people$: Observable<any[]> = new Observable<any[]>();
  selectedPeople: any[] = [];
  candidato: Candidato[] = [];
  selectedCandidatos: any[] = [];
  formulario: ConfigGoogleForm[] = [];
  // Declarar un FormGroup para tu formulario
  myForm: FormGroup;
  selectedFormularios: (number | null)[] = [];
  selectedFormulario: number = 0;// O el tipo de dato correcto para el ID del formulario

  constructor(
    private candidatoService: CandidatoService,
    private formularioService: FormularioService,
    ) {
    this.myForm = new FormGroup({
      usuarios: new FormControl([]),
    });
  }

  ngOnInit() {
    this.candidatoService.getCandidatos().subscribe((data: Candidato[]) => {
      console.log(data);
      this.candidato = data;
    });

    this.formularioService.getFormularios().subscribe(data => {
      console.log(data);
      this.formulario = data;
    });
  }


  onFormularioSelect(event: any[]) {
    // Realiza la conversión y filtrado de elementos no numéricos
    this.selectedFormularios = event
      .map((item: any) => parseInt(item.formularioId))
      .filter(id => !isNaN(id));

    // Muestra los IDs seleccionados en la consola
    console.log('Formularios seleccionados (IDs):', this.selectedFormularios);
  }



onSubmit() {
  const valoresFormulario = this.myForm.value;
  console.log('Valores del formulario:', valoresFormulario);
  console.log('Formularios seleccionados:', this.selectedFormularios);
}
}
