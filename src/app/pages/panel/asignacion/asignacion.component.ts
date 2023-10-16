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
  formuserAsignaciones: Formuser[] = [];
  filtro: string = '';
  formusuarios: Formuser[] = [];

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
        this.formuser = data;
      });

      this.formularioService.getFormularios().subscribe(data => {
        console.log(data);
        this.formulario = data;
      });
    }


  onFormularioSelect(event: any[]) {
    this.selectedFormularios = event
      .map((item: any) => parseInt(item.formularioId))
      .filter(id => !isNaN(id));

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
    formularioUsuarioId: [null],
    formularioId: [''],
    usuarioId: [''],
  });
}

agregarUsuario() {
  const valoresFormulario = this.userForm.value;

  console.log('Valores del formulario a enviar:', valoresFormulario);

  if (valoresFormulario.formularioId && valoresFormulario.usuarioId) {
    const formularioUsuario = {
      formularioUsuarioId: 0,
      formularioId: valoresFormulario.formularioId,
      usuarioIds: valoresFormulario.usuarioId
    };

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
    this.mensajeService.mensajeError("Por favor, complete los campos requeridos");
  }
}

actualizarUsuario() {
  this.formularioUserService.putUsuario(this.formusers).subscribe({
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

obtenerNombreFormulario(formularioId: number): string {
  const formulario = this.formulario.find(f => f.formularioId === formularioId);
  return formulario ? formulario.formName : 'Sin nombre';
}

obtenerNombreUsuario(usuarioIds: number | number[]): string {
  const userIdsArray = Array.isArray(usuarioIds) ? usuarioIds : [usuarioIds];
  const nombres = userIdsArray.map(usuarioId => {
    const usuario = this.usuario.find(u => u.usuarioId === usuarioId);
    return usuario ? usuario.nombre : 'Sin nombre';
  });
  return nombres.join(', '); // Para mostrar múltiples nombres si corresponde
}

borrarFormulario(formularioId: number, usuarioId: number) {
  this.mensajeService.mensajeAdvertencia(
    `¿Estás seguro de eliminar el formulario?`,
    () => {
      this.formularioUserService.deleteFormulario(formularioId, usuarioId).subscribe({
        next: () => {
          this.mensajeService.mensajeExito('Formulario eliminado correctamente');
          // Realiza cualquier otra acción que necesites después de eliminar el formulario.
        },
        error: (error) => this.mensajeService.mensajeError(error)
      });
    }
  );
}

filtrarResultados() {
  return this.usuario.filter(usuario =>
    usuario.nombre.toLowerCase().includes(this.filtro.toLowerCase())
  );
}
}
