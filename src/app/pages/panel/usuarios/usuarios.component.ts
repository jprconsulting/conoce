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
  itemsPerPage: number = 5;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 15];
  filtro: string = '';

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
      Id: [null],
      rol: [null, Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[0-9]/),
        ],
      ],
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      estatus: [false],
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
  if (this.userForm.valid) {
    const nuevoUsuario = { ...this.userForm.value };
    
    delete nuevoUsuario.Id;
    this.usuario = this.userForm.value as Usuario;
    const rol = this.userForm.get('rol')?.value;
    nuevoUsuario.rol = { id: rol } as Rol;
    const nombreUsuarioExistente = this.usuarios.some(u => u.nombres === nuevoUsuario.nombres);
    const apellidosUsuarioExistente = this.usuarios.some(u => u.apellidoPaterno === nuevoUsuario.apellidoPaterno);
    const correoExistente = this.usuarios.some(u => u.correo === nuevoUsuario.correo);
    console.log(this.userForm.value);
    if (nombreUsuarioExistente) {
      console.error('Ya existe un usuario con este nombre de usuario.');
      this.mensajeService.mensajeError('Ya existe un usuario con este nombre de usuario.');
    } else if (correoExistente) {
      console.error('Ya existe un usuario con este correo electrónico.');
      this.mensajeService.mensajeError('Ya existe un usuario con este correo electrónico.');
    } else {
      this.usuarioService.postUsuario(nuevoUsuario).subscribe({
        next: () => {
          console.log('Usuario agregado con éxito:', nuevoUsuario);
          this.mensajeService.mensajeExito('Usuario agregado con éxito');
          this.resetForm();
          // También puedes agregar el nuevo usuario a la lista local
          this.usuarios.push(nuevoUsuario);
        },
        error: (error) => {
          console.error('Error al agregar usuario:', error);
          this.mensajeService.mensajeError('Error al agregar usuario');
        }
      });
    }
  } else {
    console.error('El formulario de usuario es inválido. No se puede enviar.');
    this.mensajeService.mensajeError('Formulario de usuario inválido. Revise los campos.');
  }
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
      usuarioId: user.id,
      rolId: user.rol,
      email: user.correo,
      password: user.password,
      estatus: user.estatus,
      nombre: user.nombres,
      apellidos: user.apellidoPaterno
    });
    console.log(this.userForm.value);
  }

  filtrarResultados() {
    const filtroLowerCase = this.filtro.toLowerCase().trim();

    return this.usuarios.filter(usuario =>
      usuario.nombres.toLowerCase().includes(filtroLowerCase) ||
      usuario.apellidoPaterno.toLowerCase().includes(filtroLowerCase) ||
      usuario.correo.toLowerCase().includes(filtroLowerCase)
    );
  }

}
