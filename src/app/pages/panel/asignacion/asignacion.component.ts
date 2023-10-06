import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder  } from '@angular/forms';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';
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
  usuario: Usuario[] = [];
  selectedCandidatos: any[] = [];
  formulario: ConfigGoogleForm[] = [];
  myForm: FormGroup;
  selectedFormularios: (number | null)[] = [];
  selectedFormulario: number = 0;
  isModalAdd = false;
  userForm!: FormGroup;

  constructor(
    private usuarioService : UsuarioService,
    private formularioService: FormularioService,
    private fb: FormBuilder,
    ) {
      this.userForm = this.fb.group({
        // Define los campos y las validaciones necesarias
      });

    this.myForm = new FormGroup({
      usuarios: new FormControl([]),
    });
    this.userForm = this.fb.group({
      selectFormulario: [''],
    });
  }

  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe((data: Usuario[]) => {
      console.log(data);
      // Filtrar solo los usuarios (no administradores)
      this.usuario = data.filter(usuario => usuario.rol === 'Candidato');
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

handleChangeAdd() {
  this.userForm.reset();
  this.isModalAdd = true;
}

submitUsuario() {
  // this.usuario = this.userForm.value as Usuario;
  // this.isModalAdd ? this.agregarUsuario() : this.actualizarUsuario();
}

}
