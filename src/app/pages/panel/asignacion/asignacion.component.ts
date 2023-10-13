import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators  } from '@angular/forms';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';
import { FormularioService } from 'src/app/core/services/formulario.service';
import { ConfigGoogleForm } from 'src/app/models/googleForm';
import {FormularioUserService} from 'src/app/core/services/formulariouser.service';
import {Formuser} from 'src/app/models/formuser';
import { MensajeService } from 'src/app/core/services/mensaje.service';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent implements OnInit {

  @ViewChild('closebutton') closebutton!: ElementRef;

  variableDeControl: number = 1;
  people$: Observable<any[]> = new Observable<any[]>();
  selectedPeople: any[] = [];
  usuario: Usuario[] = [];
  selectedCandidatos: any[] = [];
  formulario: ConfigGoogleForm[] = [];
  userForm!: FormGroup;
  selectedFormularios: (number | null)[] = [];
  selectedFormulario: number = 0;
  isModalAdd = false;
  userFormul!: FormGroup;
  formuser: Formuser[]=[];
  formusers!: Formuser;

  constructor(
    private usuarioService : UsuarioService,
    private formularioService: FormularioService,
    private formBuilder: FormBuilder,
    private formularioUserService : FormularioUserService,
    private mensajeService: MensajeService,

    ) {
      this.crearFormularioUsuario();
    }

  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe((data: Usuario[]) => {
      console.log(data);
      this.usuario = data.filter(usuario => usuario.rol === 'Candidato');
    });

    this.formularioUserService.getFormularios().subscribe((data: Formuser[]) => {
      console.log(data);
    })

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
  const valoresFormulario = this.userForm.value;
  console.log('Valores del formulario:', valoresFormulario);
  console.log('Formularios seleccionados:', this.selectedFormularios);
}

handleChangeAdd() {
  this.userForm.reset();
  this.isModalAdd = true;
}

submitUsuario() {
  this.formusers = this.userForm.value as Formuser;
  this.isModalAdd ? this.agregarUsuario() : this.actualizarUsuario();
}

crearFormularioUsuario() {
  this.userForm = this.formBuilder.group({
    formularioId: [''],
    usuarioId: [''],
  });
}

agregarUsuario() {
  const valoresFormulario = this.userForm.value;

  console.log('Valores del formulario a enviar:', valoresFormulario); // Agrega esta línea

  // Asegúrate de que los campos necesarios existen en el formulario
  if (valoresFormulario.formularioId && valoresFormulario.selectedCandidatos) {
    const formularioUsuario = {
      formularioId: valoresFormulario.formularioId,
      usuarioId: valoresFormulario.selectedCandidatos
    };

    // Envía el objeto a través de tu servicio o API
    this.formularioUserService.postFormulario(formularioUsuario).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Asignación agregada con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar la asignación");
        console.error(error);
      }
    });
  } else {
    // Manejo de error si los campos requeridos no están completos
    this.mensajeService.mensajeError("Por favor, complete los campos requeridos");
  }
}

actualizarUsuario() {
  this.formularioUserService.putFormulario(this.formusers).subscribe({
    next: () => {
      this.mensajeService.mensajeExito("Usuario actualizado con éxito");
      this.resetForm();
    },
    error: (error) => {
      this.mensajeService.mensajeError("Error al actualizar usuario");
      console.error(error);
    }
  }
  );
}
resetForm() {
  this.closebutton.nativeElement.click();
  this.userForm.reset();
}

}
