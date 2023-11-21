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
import { LoadingStates } from 'src/app/global/globals';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent implements OnInit {

  @ViewChild('closebutton') closebutton!: ElementRef;
  isLoadingUsers = LoadingStates.neutro;
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
  formuser: Formuser[]=[];
  formusers!: Formuser;
  filtro: string = '';
  usuariosAsociadosAlFormulario: Formuser[] = [];
  formulariosUnicos: { formulario: ConfigGoogleForm, usuarios: Usuario[] }[] = [];
  itemsPerPage: number = 5;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 15];

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
      this.obtenerFormularios();
      this.usuarioService.getUsuarios().subscribe((data: Usuario[]) => {
        console.log(data);
        this.usuario = data.filter(usuario => usuario.rol === 'Candidato' || usuario.rol === 'Gestor');
      });

      this.formularioService.getFormularios().subscribe(data => {
        console.log(data);
        this.formulario = data;
      });

      this.formulariosUnicos = this.procesarDatos(this.formuser, this.formulario, this.usuario);
    }

    obtenerFormularios() {
      this.isLoadingUsers = LoadingStates.trueLoading;
      this.formularioUserService.getFormularios().subscribe({
        next: (formularios) => {
          console.log('Respuesta de la API:', formularios);
          this.formuser = formularios;
          this.formulariosUnicos = this.procesarDatos(this.formuser, this.formulario, this.usuario);
          this.isLoadingUsers = LoadingStates.falseLoading;
        },
        error: (error) => {
          console.error('Error al obtener los formularios', error);
          this.isLoadingUsers = LoadingStates.errorLoading;
        }
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
  this.isModalAdd ? this.agregarUsuario() : this.editarUsuarios();
}

crearFormularioUsuario() {
  this.userForm = this.formBuilder.group({
    formularioId: [''],
    usuarioIds: [''],
  });
}

agregarUsuario() {
  const valoresFormulario = this.userForm.value;

  console.log('Valores del formulario a enviar:', valoresFormulario);

  if (valoresFormulario.formularioId && valoresFormulario.usuarioIds) {
    const formularioUsuario = {
      formularioId: valoresFormulario.formularioId,
      usuarioIds: valoresFormulario.usuarioIds
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

editarUsuarios() {
    this.formularioUserService.putFormulario(this.formusers).subscribe({
      next: () => {
        this.mensajeService.mensajeExito('Edición exitosa');
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError('Error durante la edición');
        console.error(error);
      }
    });
  }

resetForm() {
  this.closebutton.nativeElement.click();
  this.userForm.reset();
}

obtenerNombreFormulario(formularioId: number): string {
  const formulario = this.formulario.find(f => f.formularioId === formularioId);
  return formulario ? formulario.formName : 'Sin nombre';
}

filtrarAsignaciones() {
  this.formuser = this.filtrarResultados();
}

borrarFormulario(formularioId: number, usuarioId: number) {
  this.mensajeService.mensajeAdvertencia(
    `¿Estás seguro de eliminar el formulario?`,
    () => {
      this.formularioUserService.deleteFormulario(formularioId, usuarioId).subscribe({
        next: () => {
          this.mensajeService.mensajeExito('Formulario eliminado correctamente');
        },
        error: (error) => this.mensajeService.mensajeError(error)
      });
    }
  );
}

filtrarResultados() {
  const usuariosFiltrados = this.usuario.filter(usuario =>
    usuario.nombre.toLowerCase().includes(this.filtro.toLowerCase())
  );

  const asignacionesFiltradas = this.formuser.filter(asignacion =>
    asignacion.usuarioIds.some(id => usuariosFiltrados.some(usuario => usuario.usuarioId === id))
  );

  return asignacionesFiltradas;
}

obtenerNombreUsuario(usuarioIds: number | number[]): string {
  const userIdsArray = Array.isArray(usuarioIds) ? usuarioIds : [usuarioIds];
  const nombres = userIdsArray.map(usuarioId => {
    const usuario = this.usuario.find(u => u.usuarioId === usuarioId);
    return usuario ? usuario.nombre : 'Sin nombre';
  });
  return nombres.join(', ');
}


setDataModalUpdate(user: Formuser) {
  this.isModalAdd = false;
  this.userForm.patchValue({
    formularioId: user.formularioId,
    usuarioIds: user.usuarioIds
  });
  console.log(this.userForm.value);
}

procesarDatos(formuser: Formuser[], formularios: ConfigGoogleForm[], usuarios: Usuario[]): { formulario: ConfigGoogleForm, usuarios: Usuario[] }[] {
  const formulariosUnicos: { formulario: ConfigGoogleForm, usuarios: Usuario[] }[] = [];

  formularios.forEach((formulario) => {
    const asignacionesParaFormulario = formuser.filter((asignacion) => asignacion.formularioId === formulario.formularioId);
    const usuarioIdsUnicos = Array.from(new Set(asignacionesParaFormulario.map((asignacion) => asignacion.usuarioIds).flat()));

    const usuariosAsociados = usuarios.filter((usuario) => usuarioIdsUnicos.includes(usuario.usuarioId));

    formulariosUnicos.push({ formulario, usuarios: usuariosAsociados });
  });

  return formulariosUnicos;
}

}
