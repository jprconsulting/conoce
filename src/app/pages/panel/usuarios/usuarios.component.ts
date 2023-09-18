import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { LoadingStates } from 'src/app/global/globals';
import { Usuario } from 'src/app/models/usuario';
import { Rol } from 'src/app/models/Rol';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  @ViewChild('closebutton') closebutton!: ElementRef;

  // Usuarios
  usuario!: Usuario;
  usuarios: Usuario[] = [];
  isLoadingUsers = LoadingStates.neutro;
  usuariosFilter: Usuario[] = [];
  userForm!: FormGroup;
  roles: Rol[] = [];
  isModalAdd = false;

  constructor(
    private usuarioService: UsuarioService,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) {
    this.crearFormularioUsuario();
  }

  ngOnInit(): void {
    this.usuarioService.refreshLisUsers.subscribe(() => this.getListadoUsuarios());
    this.getListadoUsuarios();
    this.getRoles();
  }

  crearFormularioUsuario() {
    this.userForm = this.formBuilder.group({
      usuarioId: [null],
      rolId: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[0-9]/),
        ],
      ],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      estatus: [true],
    });
  }

  getListadoUsuarios() {
    this.isLoadingUsers = LoadingStates.trueLoading;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuariosFromApi) => {
        this.usuarios = usuariosFromApi;
        this.usuariosFilter = this.usuarios;
        this.isLoadingUsers = LoadingStates.falseLoading;
      }, error: () => {
        this.isLoadingUsers = LoadingStates.errorLoading;
      }
    });
  }

  getRoles() {
    this.usuarioService.getRoles().subscribe({
      next: (rolesFromAPI) => {
        this.roles = rolesFromAPI;
      },
      error: (error) => {
        console.log('error al obtener los roles', error);
      }
    });
  }

  resetForm() {
    this.closebutton.nativeElement.click();
    this.userForm.reset();
  }


  agregarUsuario() {
    this.usuarioService.postUsuario(this.usuario).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Usuario agregado con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar usuario");
        console.error(error);
      }
    }
    );
  }

  actualizarUsuario() {
    this.usuarioService.putUsuario(this.usuario).subscribe({
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

  submitUsuario() {
    this.usuario = this.userForm.value as Usuario;
    this.isModalAdd ? this.agregarUsuario() : this.actualizarUsuario();
  }

  borrarUsuario(id: number, nombreUsuario: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el usuario: ${nombreUsuario}?`,
      () => {
        this.usuarioService.deleteUsuario(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Usuario borrado correctamente');
            //this.ConfigPaginator.currentPage = 1;
          },
          error: (error) => this.mensajeService.mensajeError(error)
        });
      }
    );
  }

  handleChangeAdd() {
    this.userForm.reset();
    this.isModalAdd = true;
  }

  setDataModalUpdate(user: Usuario) {
    this.isModalAdd = false;
    this.userForm.patchValue({
      usuarioId: user.usuarioId,
      rolId: user.rolId,
      email: user.email,
      password: user.password,
      estatus: user.estatus,
      nombre: user.nombre,
      apellidos: user.apellidos
    });
    console.log(this.userForm.value);
  }



}
