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
    const formData = this.userForm.value; // Obtiene los valores del formulario

  }

  resetForm() {
    this.userForm.reset({
      nombre: '',
      correo: '',
      rol: '1',
      contraseña: '',
      estadoActivo: true,
    });
  }

}
