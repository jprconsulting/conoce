  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { NgxSpinnerService } from 'ngx-spinner';
  import { MensajeService } from 'src/app/core/services/mensaje.service';
  import { CandidatoService } from 'src/app/core/services/candidato.service';
  import { LoadingStates } from 'src/app/global/globals';
  import { CandidatosMaqu } from 'src/app/models/candidatosmaq';
  import { Subscription } from 'rxjs';
  import { EstadoService } from 'src/app/core/services/estados.service';
  import {Estados} from 'src/app/models/estados';
  import {Candidaturas} from 'src/app/models/candidaturas';
  import { PartidoService } from 'src/app/core/services/partidos.service';
  import { Partidos } from 'src/app/models/partidos';

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
    candidato: CandidatosMaqu[] = [];
    isLoadingUsers = LoadingStates.neutro;
    candidatoFilter: CandidatosMaqu[] = [];
    usuarioSeleccionado: CandidatosMaqu | null = null;

    userForm: FormGroup;
    nameCandidate= false;
    apPaterno= false;
    apMaterno= false;
    sobrenombre= false;
    eleccion= false;
    distritos= false;
    ayuntamiento= false;
    comunidad= false;
    partido= false;
    apPaternoS= false;
    apMaternoS= false;
    nameSuplent= false;
    previewImage: string | ArrayBuffer | null = null;
    estados: Estados[] = [];
    candidaturas: Candidaturas[] = [];
    partidos: Partidos[] = [];

// Método para abrir el modal y mostrar la información del usuario.
abrirModal(candidato: CandidatosMaqu) {
  this.usuarioSeleccionado = candidato;
  console.log('Candidato seleccionado:', this.usuarioSeleccionado);
  this.previewImage = null;
}



  cerrarModal() {
    this.usuarioSeleccionado = null;
    // Cierra el modal aquí.
  }
    constructor(
      private candidatoService: CandidatoService,
      private fbGenerador: FormBuilder,
      private mensajeService: MensajeService,
      private spinnerService: NgxSpinnerService,
      private formBuilder: FormBuilder,
      private estadoService: EstadoService,
      private partidoService: PartidoService,

    ) {
      //this.crearFormularioGuardar();
      //this.subscribeRolID();

      this.userForm = this.formBuilder.group({
        nameCandidate: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        apPaterno:['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        apMaterno:['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        sobrenombre:['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        eleccion: ['', Validators.required],
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

    ngOnInit() {
      // this.candidatoService['refreshLisUsers'].subscribe(() => this.getListadocandidato());
      this.getListadocandidato();
      this.obtenerEstados();
      this.obtenerCandidaturas();
      this.obtenerPartidos();
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

    obtenerEstados() {
      this.estadoService.obtenerEstados().subscribe(
        (estados: Estados[]) => {
          this.estados = estados;
        },
        (error) => {
          console.error('Error al obtener estados:', error);
        }
      );
    }

    obtenerCandidaturas() {
      this.estadoService.obtenerCandidaturas().subscribe(
        (candidaturas: Candidaturas[]) => {
          console.log('Datos de candidaturas recibidos:', candidaturas); // Agrega este console.log
          this.candidaturas = candidaturas;
        },
        (error) => {
          console.error('Error al obtener candidaturas:', error);
        }
      );
    }

    obtenerPartidos() {
      this.partidoService.obtenerPartidos().subscribe(
        (partidos: Partidos[]) => {
          this.partidos = partidos;
          console.log('Partidos obtenidos:', this.partidos);
        },
        (error) => {
          console.error('Error al obtener partidos:', error);
        }
      );
    }

    guardarUsuario() {
      const formData = this.userForm.value;

    }

    resetForm() {
      this.userForm.reset({
        nameCandidate: '',
        apPaterno:'',
        apMaterno:'',
        sobrenombre:'',
        eleccion: '',
        estados: '',
        distritos: '',
        ayuntamiento: '',
        comunidad: '',
        partido: '',
        apPaternoS:'',
        apMaternoS:'',
        nameSuplent: '',



      });

      this.nameCandidate = false;
      this.apPaterno = false;
      this.apMaterno = false;
      this.sobrenombre = false;
      this.eleccion = false;
      this.distritos = false;
      this.ayuntamiento = false;
      this.comunidad = false;
      this.partido = false;
      this.apPaternoS = false;
      this.apMaternoS = false;
      this.nameSuplent = false;

    }

    marcarNombreComoTocado() {
      this.nameCandidate = true;
      return this.userForm.get('nameCandidate')?.invalid && this.userForm.get('nameCandidate')?.touched;
    }

    marcarApPaternoTocado(){
      this.apPaterno=true;
      return this.userForm.get('apPaterno')?.invalid && this.userForm.get('apPaterno')?.touched
    }

    marcarApMaternoTocado(){
      this.apMaterno=true;
      return this.userForm.get('apMaterno')?.invalid && this.userForm.get('apMaterno')?.touched
    }

    marcarSobrenombreTocado(){
      this.sobrenombre = true;
      return this.userForm.get('sobrenombre')?.invalid && this.userForm.get('sobrenombre')?.touched;
    }
    marcarNombreSComoTocado() {
      this.nameSuplent = true;
      return this.userForm.get('nameSuplent')?.invalid && this.userForm.get('nameSuplent')?.touched
    }
    marcarApPaternoSTocado(){
      this.apPaternoS=true;
      return this.userForm.get('apPaternoS')?.invalid && this.userForm.get('apPaternoS')?.touched
    }

    marcarApMaternoSTocado(){
      this.apMaternoS=true;
      return this.userForm.get('apMaternoS')?.invalid && this.userForm.get('apMaternoS')?.touched
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

    // agregarUsuario() {

    //   if (this.userForm.valid) {
    //     const nuevoCandidato = this.userForm.value;
    //     console.log(nuevoCandidato)

    //     this.candidatoService.postCandidatos(nuevoCandidato).subscribe(
    //       (candidatoAgregado) => {
    //         // El usuario se ha agregado correctamente, puedes realizar acciones adicionales si es necesario.
    //         this.mensajeService.mensajeExito("Usuario agregado con éxito");
    //         this.getListadocandidato();
    //         this.resetForm();
    //       },
    //       (error) => {
    //         // Manejo de errores en caso de que la adición de usuario falle.
    //         this.mensajeService.mensajeExito("Usuario agregado con éxito");
    //         this.getListadocandidato();
    //         console.error(error);
    //       }
    //     );
    //   }
    // }

    onImageChange(event: any) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.previewImage = reader.result;
        };
      }
    }

    eliminarImagen() {
      // Lógica para eliminar la imagen seleccionada
      this.previewImage = null;
    }

  }

