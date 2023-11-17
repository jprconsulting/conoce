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
      const nuevoUsuario = this.userForm.value;
  
      // Verificar si el nombre de usuario ya existe
      const nombreUsuarioExistente = this.usuarios.some(u => u.nombre === nuevoUsuario.nombre);
      const apellidosUsuarioExistente = this.usuarios.some(u => u.apellidos === nuevoUsuario.apellidos);
  
      // Verificar si el correo electrónico ya existe
      const correoExistente = this.usuarios.some(u => u.email === nuevoUsuario.email);
  
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

  filtrarResultados() {
    const filtroLowerCase = this.filtro.toLowerCase().trim();

    return this.usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(filtroLowerCase) ||
      usuario.apellidos.toLowerCase().includes(filtroLowerCase) ||
      usuario.email.toLowerCase().includes(filtroLowerCase)
    );
  }

}
