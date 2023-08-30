import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { CandidatoService } from 'src/app/core/services/candidato.service';
import { LoadingStates } from 'src/app/global/globals';
import { Candidato } from 'src/app/models/candidato';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css']
})
export class CandidatosComponent {

  // Usuarios
  candidato: Candidato[] = [];
  isLoadingUsers = LoadingStates.neutro;
  candidatoFilter: Candidato[] = [];
  userForm: FormGroup;
    contrasenaTocada = false;
    nombreTocado = false;
    ocupacionTocada = false;
    partidoPoliticoTocado = false;
    ubicacionGoogleTocada =  false;
    direccionTocada = false;
    telefonoTocado = false;
    correoTocado = false;
    linkFacebookTocado = false;
    userFacebookTocado = false;
    linkIGTocado = false;
    userIGTocado = false;
    linkTwitterTocado = false;
    userTwitterTocado = false;
    whatsappTocado = false;
    esloganTocado = false;
    edadTocada = false;
    estadoTocado = false;
    generoTocado = false;
    nombreSupTocado = false;
    edadSupTocada = false;
    estadoSupTocado = false;
    generoSupTocado = false;
    historiaTocada = false;
    carreraTocada = false;
    razonTocada = false;
    nombreProp1Tocado = false;
    prop1Tocada = false;
    nombreProp2Tocado = false;
    prop2Tocada = false;
    nombreProp3Tocado = false;
    prop3Tocada = false;
    trayectoriaTocada = false;
    gradoAcadTocado = false;




  constructor(
    private candidatoService: CandidatoService,
    private fbGenerador: FormBuilder,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) {
    //this.crearFormularioGuardar();
    //this.subscribeRolID();

    this.userForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      ocupacion: ['', Validators.required],
      partidoPolitico: ['', Validators.required],
      ubicacionGoogle: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      linkFacebook: ['', Validators.required],
      userfacebook: ['', Validators.required],
      linkIG: ['', Validators.required],
      userIG: ['', Validators.required],
      linkTwitter: ['', Validators.required],
      userTwitter: ['', Validators.required],
      whatsapp: ['', Validators.required],
      eslogan: ['', Validators.required],
      edad: ['', Validators.required],
      estado: ['', Validators.required],
      genero: ['', Validators.required],
      nombreSup: ['', Validators.required],
      edadSup: ['', Validators.required],
      estadoSup: ['', Validators.required],
      generoSup: ['', Validators.required],
      historia: ['', Validators.required],
      carrera: ['', Validators.required],
      razon: ['', Validators.required],
      nombreProp1: ['', Validators.required],
      prop1: ['', Validators.required],
      nombreProp2: ['', Validators.required],
      prop2: ['', Validators.required],
      nombreProp3: ['', Validators.required],
      prop3: ['', Validators.required],
      trayectoria: ['', Validators.required],
      gradoAcad: ['', Validators.required],

    });


  }

  ngOnInit(): void {
    this.candidatoService.refreshLisUsers.subscribe(() => this.getListadocandidato());
    this.getListadocandidato();
  }


  getListadocandidato() {
    this.isLoadingUsers = LoadingStates.trueLoading;
    this.candidatoService.getCandidatos().subscribe({
      next: (candidatosFromApi) => {
        setTimeout(() => {
          this.candidato = candidatosFromApi;
          console.log(this.candidato);
          this.candidatoFilter = this.candidato;
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
   // this.correoTocado = true;
  }

  marcarContrasenaComoTocada() {
    //this.contrasenaTocada = true;
  }

  agregarUsuario() {
    if (this.userForm.valid) {
      const nuevoCandidato = this.userForm.value;

      this.candidatoService.postCandidatos(nuevoCandidato).subscribe(
        (candidatoAgregado) => {
          // El usuario se ha agregado correctamente, puedes realizar acciones adicionales si es necesario.
          this.mensajeService.mensajeExito("Usuario agregado con éxito");
          this.getListadocandidato();
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

