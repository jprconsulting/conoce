  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { NgxSpinnerService } from 'ngx-spinner';
  import { MensajeService } from 'src/app/core/services/mensaje.service';
  import { CandidatoService } from 'src/app/core/services/candidato.service';
  import { LoadingStates } from 'src/app/global/globals';
  import { Candidato } from 'src/app/models/candidato';
  import { Subscription } from 'rxjs';

  @Component({
    selector: 'app-candidatos',
    templateUrl: './candidatos.component.html',
    styleUrls: ['./candidatos.component.css']
  })
  export class CandidatosComponent {
    opcionSeleccionada: string = 'opcion1'; // Valor predeterminado del primer dropdown
    opcionSeleccionada2: string = ''; // Valor predeterminado del segundo dropdown
    mostrarSegundoDropdown: boolean = false; // Variable para mostrar/ocultar el segundo dropdown

    // Usuarios
    candidato: Candidato[] = [];
    isLoadingUsers = LoadingStates.neutro;
    candidatoFilter: Candidato[] = [];
    userForm: FormGroup;
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
      apPaternoTocado = false;
      apMaternoTocado = false;
      apPaternoSTocado = false;
      apMaternoSTocado = false;
      sobrenombreTocado = false;
      nombreSTocado = false;



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
        nameCandidate: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
       // position: ['', Validators.required],
      //  actorPolitico: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        // ubicacionGoogle: ['', Validators.required],
        // direccion: ['', Validators.required],
        // telefono: ['', Validators.required],
        // correo: ['', Validators.required],
        // linkFacebook: ['', Validators.required],
        // userfacebook: ['', Validators.required],
        // linkIG: ['', Validators.required],
        // userIG: ['', Validators.required],
        // linkTwitter: ['', Validators.required],
        // userTwitter: ['', Validators.required],
        // whatsapp: ['', Validators.required],
        // eslogan: ['', Validators.required],
      //  estado: ['', Validators.required],
        // nombreSup: ['', Validators.required],
        // edadSup: ['', Validators.required],
        // estadoSup: ['', Validators.required],
        // generoSup: ['', Validators.required],
        // historia: ['', Validators.required],
        // carrera: ['', Validators.required],
        // razon: ['', Validators.required],
        // nombreProp1: ['', Validators.required],
        // prop1: ['', Validators.required],
        // nombreProp2: ['', Validators.required],
        // prop2: ['', Validators.required],
        // nombreProp3: ['', Validators.required],
        // prop3: ['', Validators.required],
        // trayectoria: ['', Validators.required],
       // typeDisability:['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        apPaterno:['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        apMaterno:['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        sobrenombre:['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        //academicDegree: ['Licenciatura'],
        //lgbtq:[false],
        //indigenousCandidacy: [false],
        eleccion: ['', Validators.required], // Valor predeterminado
        estados: ['', Validators.required],
        distritos: [''],
        ayuntamiento: [''],
        comunidad: [''],
        partido: [''],
        apPaternoS:['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        apMaternoS:['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        nameSuplent: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],


      });


    }

    ngOnInit(): void {
      this.candidatoService['refreshLisUsers'].subscribe(() => this.getListadocandidato());
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
        ocupacion: '',
        partidoPolitico: '',
        ubicacionGoogle: '',
        direccion: '',
        telefono: '',
        correo: '',
        linkFacebook: '',
        userfacebook: '',
        linkIG: '',
        userIG: '',
        linkTwitter: '',
        userTwitter: '',
        whatsapp: '',
        eslogan: '',
        edad: '',
        estado: '',
        genero: '',
        nombreSup: '',
        edadSup: '',
        estadoSup: '',
        generoSup: '',
        historia: '',
        carrera: '',
        razon: '',
        nombreProp1: '',
        prop1:'',
        nombreProp2:'',
        prop2:'',
        nombreProp3:'',
        prop3:'',
        trayectoria:'',
        gradoAcad:'',
        apPaterno:'',
        apMaterno:'',
        sobrenombre:'',
        gender:'null',
        eleccion: 'null', // Valor predeterminado
        estados: 'null',
        distritos: 'null',
        ayuntamiento: 'null',
        comunidad: 'null',
        partido: 'null',

        indigenousCandidacy:false,
        academicDegree:'Licenciatura',
        lgbtq:false,
        apPaternoS:'',
        apMaternoS:'',
        nameSuplent:'',

        
      });

      this.nombreTocado = false;
      this.ocupacionTocada = false;
      this.partidoPoliticoTocado = false;
      this.ubicacionGoogleTocada =  false;
      this.direccionTocada = false;
      this.telefonoTocado = false;
      this.correoTocado = false;
      this.linkFacebookTocado = false;
      this.userFacebookTocado = false;
      this.linkIGTocado = false;
      this.userIGTocado = false;
      this.linkTwitterTocado = false;
      this.userTwitterTocado = false;
      this.whatsappTocado = false;
      this.esloganTocado = false;
      this.edadTocada = false;
      this.estadoTocado = false;
      this.generoTocado = false;
      this.nombreSupTocado = false;
      this.edadSupTocada = false;
      this.estadoSupTocado = false;
      this.generoSupTocado = false;
      this.historiaTocada = false;
      this.carreraTocada = false;
      this.razonTocada = false;
      this.nombreProp1Tocado = false;
      this.prop1Tocada = false;
      this.nombreProp2Tocado = false;
      this.prop2Tocada = false;
      this.nombreProp3Tocado = false;
      this.prop3Tocada = false;
      this.trayectoriaTocada = false;
      this.gradoAcadTocado = false;
      this.apMaternoTocado = false;
      this.apPaternoTocado = false;
      this.sobrenombreTocado = false;
      this.apPaternoSTocado = false;
      this.apMaternoSTocado = false;
      this.nombreSTocado = false;
    }

    marcarNombreComoTocado() {
      this.nombreTocado = true;
      return this.userForm.get('nameCandidate')?.invalid && this.userForm.get('nameCandidate')?.touched;
    }
    marcarOcupacionTocada() {
      this.ocupacionTocada = true;
    }
    marcarPartidoPoliticoTocado() {
      this.partidoPoliticoTocado = true;
    }

    marcarUbicacionGoogleTocada(){
      this.ubicacionGoogleTocada=true;
    }

    marcarDireccionTocada(){
      this.direccionTocada=true;
    }


    marcarTelefonoTocado(){
      this.telefonoTocado=true;
    }

    marcarCorreoTocado(){
      this.correoTocado=true;

    }

    marcarLinkFacebookTocado(){
      this.linkFacebookTocado=true;
    }

    marcarUserFacebookTocado(){
      this.userFacebookTocado=true;
    }

    marcarLinkIGTocado(){
      this.linkIGTocado=true;
    }

    marcarUserIGTocado(){
      this.userIGTocado=true;
    }

    marcarLinkTwitterTocado(){
      this.linkTwitterTocado=true;
    }

    marcarUserTwitterTocado(){
      this.userTwitterTocado=true;
    }

    marcarWhatsAppTocado(){
      this.whatsappTocado=true;
    }

    marcarEsloganTocado(){
      this.esloganTocado=true;
    }

    marcarEdadTocada(){
      this.edadTocada=true;
    }

    marcarEstadoTocado(){
      this.estadoTocado=true;
    }

    marcarGeneroTocado(){
      this.generoTocado=true;
    }

    marcarNombreSupTocado(){
      this.nombreSupTocado=true;
    }

    marcarEdadSupTocada(){
      this.edadSupTocada=true;
    }

    marcarEstadoSupTocado(){
      this.estadoSupTocado=true;
    }

    marcarGeneroSupTocado(){
      this.generoSupTocado=true;
    }

    marcarHistoriaTocada(){
      this.historiaTocada=true;
    }

    marcarCarreraTocada(){
      this.carreraTocada=true;
    }

    marcarRazonTocada(){
      this.razonTocada=true;
    }

    marcarNombreProp1Tocado(){
      this.nombreProp1Tocado=true;
    }

    marcarProp1Tocada(){
      this.prop1Tocada=true;
    }

    marcarNombreProp2Tocado(){
      this.nombreProp2Tocado=true;
    }

    marcarProp2Tocada(){
      this.prop2Tocada=true;
    }

    marcarNombreProp3Tocado(){
      this.nombreProp3Tocado=true;
    }

    marcarProp3Tocada(){
      this.prop3Tocada=true;
    }

    marcarTrayectoriaTocada(){
      this.trayectoriaTocada=true;
    }

    marcarGradoAcadTocado(){
      this.gradoAcadTocado=true;
    }

    marcarApPaternoTocado(){
      this.apPaternoTocado=true;
      return this.userForm.get('apPaterno')?.invalid && this.userForm.get('apPaterno')?.touched
    }

    marcarApMaternoTocado(){
      this.apMaternoTocado=true;
      return this.userForm.get('apMaterno')?.invalid && this.userForm.get('apMaterno')?.touched
    }

    marcarApPaternoSTocado(){
      this.apPaternoSTocado=true;
      return this.userForm.get('apPaternoS')?.invalid && this.userForm.get('apPaternoS')?.touched
    }

    marcarApMaternoSTocado(){
      this.apMaternoSTocado=true;
      return this.userForm.get('apMaternoS')?.invalid && this.userForm.get('apMaternoS')?.touched
    }
    marcarNombreSComoTocado() {
      this.nombreSTocado = true;
      return this.userForm.get('nameSuplent')?.invalid && this.userForm.get('nameSuplent')?.touched
    }
    marcarSobrenombreTocado(){
      this.sobrenombreTocado=true;
      return this.userForm.get('sobrenombre')?.invalid && this.userForm.get('sobrenombre')?.touched
    }

    onDropdownChange() {
      // Lógica para mostrar u ocultar el segundo dropdown según la selección en el primero
      if (this.opcionSeleccionada === 'opcion2') {
        this.mostrarSegundoDropdown = true; // Muestra el segundo dropdown
      } else {
        this.mostrarSegundoDropdown = false; // Oculta el segundo dropdown
        this.opcionSeleccionada2 = ''; // Restablece la selección en el segundo dropdown
      }
    }

    agregarUsuario() {

      if (this.userForm.valid) {
        const nuevoCandidato = this.userForm.value;
        console.log(nuevoCandidato)

        this.candidatoService.postCandidatos(nuevoCandidato).subscribe(
          (candidatoAgregado) => {
            // El usuario se ha agregado correctamente, puedes realizar acciones adicionales si es necesario.
            this.mensajeService.mensajeExito("Usuario agregado con éxito");
            this.getListadocandidato();
            this.resetForm();
          },
          (error) => {
            // Manejo de errores en caso de que la adición de usuario falle.
            this.mensajeService.mensajeExito("Usuario agregado con éxito");
            this.getListadocandidato();
            console.error(error);
          }
        );
      }
    }



  }

