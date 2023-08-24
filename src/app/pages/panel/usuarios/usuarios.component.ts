import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { LoadingStates } from 'src/app/global/globals';
import { Usuario } from 'src/app/models/usuario';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  // Usuarios
  usuarios: Usuario[] = [];
  isLoadingUsers = LoadingStates.neutro;
  usuariosFilter: Usuario[] = [];
  userForm: FormGroup;

    nombreTocado = false;
    correoTocado = false;
    contrasenaTocada = false;

  constructor(
    private usuarioService: UsuarioService,
    private fbGenerador: FormBuilder,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) {
    //this.crearFormularioGuardar();
    //this.subscribeRolID();

    this.userForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      rol: ['1'],
      contraseña: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[0-9]/),
        ],
      ],
      estadoActivo: [true],
    });


  }

  ngOnInit(): void {
    this.usuarioService.refreshLisUsers.subscribe(() => this.getListadoUsuarios());
    this.getListadoUsuarios();
  }


  getListadoUsuarios() {
    this.isLoadingUsers = LoadingStates.trueLoading;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuariosFromApi) => {
        setTimeout(() => {
          this.usuarios = usuariosFromApi;
          console.log(this.usuarios);
          this.usuariosFilter = this.usuarios;
          this.isLoadingUsers = LoadingStates.falseLoading;

        }, 3000);
      }, error: () => {
        console.log('error');
        this.isLoadingUsers = LoadingStates.errorLoading;
        console.log(this.isLoadingUsers);
      }
    });
  }

  guardarUsuario() {
    const formData = this.userForm.value;

  }

  resetForm() {
    this.userForm.reset({
      nombre: '',
      correo: '',
      rol: '1',
      contraseña: '',
      estadoActivo: true,
    });

    this.nombreTocado = false;
    this.correoTocado = false;
    this.contrasenaTocada = false;
  }

   marcarNombreComoTocado() {
    this.nombreTocado = true;
  }

  marcarCorreoComoTocado() {
    this.correoTocado = true;
  }

  marcarContrasenaComoTocada() {
    this.contrasenaTocada = true;
  }

  agregarUsuario() {
    if (this.userForm.valid) {
      const nuevoUsuario = this.userForm.value;

      this.usuarioService.postUsuario(nuevoUsuario).subscribe(
        (usuarioAgregado) => {
          // El usuario se ha agregado correctamente, puedes realizar acciones adicionales si es necesario.
          this.mensajeService.mensajeExito("Usuario agregado con éxito");
          this.getListadoUsuarios();
          this.resetForm();
        },
        (error) => {
          // Manejo de errores en caso de que la adición de usuario falle.
          this.mensajeService.mensajeError("Error al agregar usuario");
          console.error(error);
        }
      );
    }
  }

}
