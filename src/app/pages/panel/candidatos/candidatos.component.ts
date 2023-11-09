import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { CandidatoService } from 'src/app/core/services/candidato.service';
import { LoadingStates } from 'src/app/global/globals';
import { Candidato } from 'src/app/models/candidato';
import { Estados } from 'src/app/models/estados';
import { Candidaturas } from 'src/app/models/candidaturas';
import { CandidaturasService } from 'src/app/core/services/candidaturas.service';
import { Partidos } from 'src/app/models/partidos';
import { EstadoService } from 'src/app/core/services/estados.service';
import {Cargos} from 'src/app/models/cargos';
import {Genero} from 'src/app/models/genero';
import { HttpClient } from '@angular/common/http';
import { FormularioService } from 'src/app/core/services/formulario.service';
import { ConfigGoogleForm } from 'src/app/models/googleForm';
import { RespuestasGoogleService } from 'src/app/core/services/respuestasGoogle.service';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css']
})
export class CandidatosComponent implements OnInit {

  @ViewChild('closebutton') closebutton!: ElementRef;

  opcionSeleccionada: string = 'opcion1'; // Valor predeterminado del primer dropdown
  opcionSeleccionada2: string = ''; // Valor predeterminado del segundo dropdown
  mostrarSegundoDropdown: boolean = false; // Variable para mostrar/ocultar el segundo dropdown
  // Usuarios
  candidato: Candidato[] = [];
  isLoadingUsers: number = 0;
  candidatoFilter: Candidato[] = [];
  usuarioSeleccionado: Candidato | null = null;
  candidaturaSeleccionada: string = '';

  userForm!: FormGroup;
  previewImage: string | ArrayBuffer | null = null;
  estados: Estados[] = [];
  candidaturas: Candidaturas[] = [];
  partidos: Partidos[] = [];
  filtro: string = '';
  itemsPerPage: number = 2;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [2, 4, 6];
  isModalAdd = false;
  cargos: Cargos[] = [];
  genero: Genero [] = [];
  candidatos: Candidato[] = [];
  configGoogleForms: ConfigGoogleForm[] = [];
  googleFormIds: string[] = [];

  constructor(
    private candidatoService: CandidatoService,
    private fbGenerador: FormBuilder,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private partidoService: CandidaturasService,
    private http: HttpClient,
    private formularioService: FormularioService,
    private respuestasGoogleService : RespuestasGoogleService,
  ) {
    this.crearFormularioCandidato();
    //this.subscribeRolID();
  }

  crearFormularioCandidato() {
    this.userForm = this.formBuilder.group({
      candidatoId: [null],
      nombrePropietario: ['', Validators.required],
      sobrenombrePropietario: ['', Validators.required],
      generoId: [null, Validators.required],
      nombreSuplente: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required],
      direccionCasaCampaña: ['', Validators.required],
      telefonoPublico: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
      paginaWeb: ['', Validators.required],
      cargoId: [null, Validators.required],
      estadoId: [null, Validators.required],
      candidaturaId: [null, Validators.required],
      facebook:['', Validators.required],
      twitter:['', Validators.required],
      instagram:['', Validators.required],
      tiktok:['', Validators.required],
      foto:['', Validators.required]
    });
  }

  ngOnInit() {
    this.getListadocandidato();
    this.obtenerEstados();
    this.obtenerCandidaturas();
    this.obtenerPartidos();
    this.obtenerCargos();
    this.obtenerGeneros();
    this.getConfigGoogleForms();
  }

  getListadocandidato() {
    this.isLoadingUsers = LoadingStates.trueLoading;
    this.candidatoService.getCandidatos().subscribe(
        (candidatosFromApi) => {
            this.candidatos = candidatosFromApi;
            this.candidatoFilter = this.candidatos;
            console.log('Candidatos cargados:', this.candidatos);
            this.isLoadingUsers = LoadingStates.falseLoading;
        },
        (error) => {
            console.log('Error al cargar candidatos:', error);
            this.isLoadingUsers = LoadingStates.errorLoading;
        }
    );
}

getNombreCargo(cargoId: number): string {
  const cargo = this.cargos.find((e) => e.cargoId === cargoId);
  return cargo ? cargo.nombreCargo : 'Desconocido';
}

getNombreAgrupacion(candidaturaId: number): string {
  const candidaturas = this.candidaturas.find((e) => e.tipoCandidaturaId === candidaturaId);
  return candidaturas ? candidaturas.nombreTipoCandidatura : 'Desconocido';
}
  obtenerCargos() {
    this.estadoService.obtenerCargos().subscribe(
      (cargos: Cargos[]) => {
        this.cargos = cargos;
        console.log('Cargos recibidos:', cargos);
      },
      (error) => {
        console.error('Error al obtener cargos:', error);
      }
    );
  }

  obtenerGeneros() {
    this.estadoService.obtenerGeneros().subscribe(
      (genero: Genero[]) => {
        this.genero = genero;
        console.log('Generos recibidos:', genero);
      },
      (error) => {
        console.error('Error al obtener generos:', error);
      }
    );
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
        console.log('Datos de candidaturas recibidos:', candidaturas);
        this.candidaturas = candidaturas;
      },
      (error) => {
        console.error('Error al obtener candidaturas:', error);
      }
    );
  }

  obtenerPartidos() {
    this.partidoService.getCandidaturas().subscribe(
      (partidos: Partidos[]) => {
        this.partidos = partidos;
        console.log('Partidos obtenidos:', this.partidos);
      },
      (error) => {
        console.error('Error al obtener partidos:', error);
      }
    );
  }

  // Método para abrir el modal y mostrar la información del usuario.
  abrirModal(candidato: Candidato) {
    this.usuarioSeleccionado = candidato;
    console.log('Candidato seleccionado:', this.usuarioSeleccionado);
    this.previewImage = null;
  }

  submitUsuario() {
    const candidatoToAddOrUpdate: Candidato[] = [this.userForm.value as Candidato];
    this.isModalAdd ? this.agregarCandidato(candidatoToAddOrUpdate) : this.actualizarUsuario(candidatoToAddOrUpdate);
  }

  cerrarModal() {
    this.usuarioSeleccionado = null;
    // Cierra el modal aquí.
  }

  agregarCandidato(candidatos: Candidato[]) {
    this.candidatoService.postCandidatos(candidatos).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Usuarios agregados con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar usuarios");
        console.error(error);
      }
    });
  }

  actualizarUsuario(candidatos: Candidato[]) {
    this.candidatoService.putCandidatos(candidatos).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Usuarios actualizados con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar usuarios");
        console.error(error);
      }
    });
  }

  resetForm() {
    this.closebutton.nativeElement.click();
    this.userForm.reset();
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

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.previewImage = reader.result; // Actualiza la previsualización

        const fotoControl = this.userForm.get('foto');
        if (fotoControl) {
          fotoControl.setValue(reader.result); // Actualiza el campo "foto" en el formulario
        }
      };
    }
  }

  eliminarImagen() {
    this.previewImage = null;
  }

  filtrarResultados() {
    return this.candidato.filter(candidato =>
      candidato.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  handleChangeAdd() {
    this.userForm.reset();
    this.isModalAdd = true;
  }

  cargarGenero() {
    this.genero = [
      { generoId: 1, nombreGenero: 'Femenino' },
      { generoId: 2, nombreGenero: 'Masculino' },
    ];
        this.userForm.get('generoId')?.enable();
  }

  cargarEstados() {
    this.http.get<Estados[]>('https://conocelosprueba.bsite.net/api/estado/obtener_estados')
    .subscribe((data) => {
      this.estados = data;
      this.userForm.get('estadoId')?.enable();
    });
    this.userForm.get('estadoId')?.enable();
  }

  cargarCargos() {
    this.http.get<Cargos[]>('https://conocelosprueba.bsite.net/api/cargo/obtener_cargos')
      .subscribe((data) => {
        this.cargos = data;
        this.userForm.get('cargoId')?.enable();
      });
}

cargarCandidaturas() {
  this.http.get<Candidaturas[]>('https://conocelosprueba.bsite.net/api/candidatura/obtener_candidaturas')
    .subscribe((data) => {
      this.candidaturas = data;
      this.userForm.get('candidaturaId')?.enable();
    });
}

getConfigGoogleForms() {
  this.formularioService.getFormularios().subscribe(
    (configGoogleFormsFromApi) => {
      this.configGoogleForms = configGoogleFormsFromApi;
      console.log('Configuraciones de Google Form cargadas:', this.configGoogleForms);
    },
    (error) => {
      console.error('Error al cargar configuraciones de Google Form:', error);
    }
  );
}

enviarGoogleFormIds() {
  this.googleFormIds = this.configGoogleForms.map((config) => config.googleFormId);
  console.log('Google Form Ids a enviar:', this.googleFormIds);


  this.respuestasGoogleService.enviarGoogleFormIds(this.googleFormIds).subscribe(
    (response) => {
    },
    (error) => {
      console.error('Error al enviar los Google Form Ids:', error);
    }
  );
}
}
