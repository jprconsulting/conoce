import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CandidatoService } from 'src/app/core/services/candidato.service';
import { Observable } from 'rxjs';
import { CandidatosMaqu } from 'src/app/models/candidatosmaq';


@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent implements OnInit {
  variableDeControl: number = 1;
  people$: Observable<any[]> = new Observable<any[]>();
  selectedPeople: any[] = [];
  candidato: CandidatosMaqu[] = [];
  selectedCandidatos: any[] = [];
  // Declarar un FormGroup para tu formulario
  myForm: FormGroup;

  constructor(private candidatoService: CandidatoService) {
    // Inicializa el FormGroup en el constructor
    this.myForm = new FormGroup({
      usuarios: new FormControl([]), // Define tus campos de formulario aquí, usando un FormControl para la selección múltiple
      // Otros campos del formulario si los tienes
    });
  }

  ngOnInit() {
    this.candidatoService.getCandidatos().subscribe(data => {
      console.log(data); // Verifica si los datos se imprimen correctamente en la consola
      this.candidato = data;
    });
  }

}
