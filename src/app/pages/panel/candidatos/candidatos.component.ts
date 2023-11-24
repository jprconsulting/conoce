import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { EstadoFormulario, Formulario, RespuestaGoogleFormulario } from 'src/app/models/respuesta-google-formulario';
import { DistritoLocalService } from 'src/app/core/services/distritolocal.service';
import { AyuntamientoService } from 'src/app/core/services/ayuntamiento.service';
import { ComunidadService } from 'src/app/core/services/comunidad.service';
import { DistritoLocal } from 'src/app/models/distritoLocal';
import { Ayuntamiento } from 'src/app/models/ayuntamiento';
import { Comunidad } from 'src/app/models/comunidad';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css']
})
export class CandidatosComponent implements OnInit {

  @ViewChild('closebutton') closebutton!: ElementRef;

  respuestasGoogleFormulario: RespuestaGoogleFormulario = {} as RespuestaGoogleFormulario;
  opcionSeleccionada: string = 'opcion1';
  opcionSeleccionada2: string = '';
  mostrarSegundoDropdown: boolean = false;
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
  filtrado: string = '';
  itemsPerPage: number = 2;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [2, 4, 6];
  isModalAdd = false;
  cargos: Cargos[] = [];
  genero: Genero [] = [];
  candidatos: Candidato[] = [];
  configGoogleForms: ConfigGoogleForm[] = [];
  googleFormIds: string[] = [];
  respuestas: RespuestaGoogleFormulario[] = [];
  estadoRespuestaSeleccionado: 'todos' | 'contestado' | 'sinContestar' = 'todos';
  estatusSeleccionado: string = '';
  formulariosDisponibles: string[] = [];
  candidatosFiltrados: Candidato[] = [];
  formularioSeleccionado: Formulario | null = null;
  estadosFormularios: EstadoFormulario[] = [];
  formularios: Formulario[] = [];
  porcentajeProgreso: number = 0;
  selectedStatus: string | null = null;
  distritosLocales: DistritoLocal[] = [];
  ayuntamientos: Ayuntamiento[] = [];
  comunidades: Comunidad[] = [];
  selectedDemarcacion: string = '';
  selectedTipo: string | undefined;
  opcionesFiltradas: string[] = [];
  partidosFiltrados: Partidos[] = [];
  tipoSeleccionado: number | undefined;
  opcionesDependientes: string[] = [];

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
    private respuestasGoogleFormularioService : RespuestasGoogleService,
    private changeDetectorRef: ChangeDetectorRef,
    private distritoLocalService: DistritoLocalService,
    private ayuntamientoService: AyuntamientoService,
    private comunidadService: ComunidadService,

  ) {
    this.crearFormularioCandidato();
    //this.subscribeRolID();
  }

  crearFormularioCandidato() {
    this.userForm = this.formBuilder.group({
      candidatoId: [null],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      sobrenombrePropietario: [''],
      generoId: [null, Validators.required],
      nombreSuplente: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required],
      direccionCasaCampania: [''],
      telefonoPublico: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
      paginaWeb: [''],
      facebook: ['', Validators.required],
      twitter: ['', Validators.required],
      instagram: ['', Validators.required],
      tiktok: ['', Validators.required],
      foto: [''],
      estatus: [true],
      cargoId: [null, Validators.required],
      estadoId: [null],
      distritoLocalId: [null],
      ayuntamientoId: [null],
      comunidadId: [null],
      candidaturaId: [null, Validators.required]
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
    this.cargarDistritosLocales();
    this.cargarAyuntamientos();
    this.cargarComunidades();
    // this.filtrarPorFormulario();
  }
  cargarDistritosLocales() {
    this.distritoLocalService.getDistritosLocales().subscribe((data: DistritoLocal[]) => {
      this.distritosLocales = data;
      console.log('Distritos Locales:', this.distritosLocales);
    });
  }

  cargarAyuntamientos() {
    this.ayuntamientoService.getAyuntamientos().subscribe((data: Ayuntamiento[]) => {
      this.ayuntamientos = data;
      console.log('Ayuntamientos:', this.ayuntamientos);
    });
  }

  cargarComunidades() {
    this.comunidadService.getComunidades().subscribe((data: Comunidad[]) => {
      this.comunidades = data;
      console.log('Comunidades:', this.comunidades);
    });
  }
  cambiarEstadoRespuesta(estado: 'todos' | 'contestado' | 'sinContestar') {
    this.estadoRespuestaSeleccionado = estado;
  }

  seleccionarFormulario(formulario: Formulario) {
    this.formularioSeleccionado = formulario;
  }

  verEstadosFormularios(candidato: Candidato) {
    const respuestasCandidato = this.respuestas.find(r => r.candidatoId === candidato.candidatoId);
    if (respuestasCandidato) {
      console.log('Formularios del candidato:', respuestasCandidato.formularios);
    } else {
      console.log('Manejar caso: Candidato sin respuestas');
    }
  }


  mostrarModalEstados(estadosFormularios: { nombre: string; estado: string }[]) {

  }

  onChangeDemarcacion(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedDemarcacion = selectedValue;
  }

calcularEstadosFormularios(): { nombre: string; estado: string }[] {
  const estadosFormularios: { nombre: string; estado: string }[] = [];

  if (this.respuestasGoogleFormulario && this.respuestasGoogleFormulario.formularios) {
    this.respuestasGoogleFormulario.formularios.forEach((formulario) => {
      let estadoFormulario = 'Por contestar';

      if (formulario.preguntasRespuestas && formulario.preguntasRespuestas.length > 0) {
        estadoFormulario = 'Contestado';
      }

      estadosFormularios.push({ nombre: formulario.formName, estado: estadoFormulario });
    });
  }

  return estadosFormularios;
}


  calcularTieneRespuestas(candidato: Candidato): { nombre: string; contestado: boolean }[] {
    const respuestasCandidato = this.respuestas.find(r => r.candidatoId === candidato.candidatoId);

    if (respuestasCandidato) {
      return respuestasCandidato.formularios.map(formulario => ({
        nombre: formulario.formName,
        contestado: formulario.preguntasRespuestas.length > 0
      }));
    } else {
      return [];
    }
  }


  filtrarPorEstatus(estatus: string) {
    this.estatusSeleccionado = estatus;
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
        this.mensajeService.mensajeExito("Candidato agregado con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar al candidato");
        console.error(error);
      }
    });
  }

  actualizarUsuario(candidatos: Candidato[]) {
    this.candidatoService.putCandidatos(candidatos).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Candidato actualizado con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar al candidato");
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
    this.http.get<Genero[]>('https://localhost:7154/api/Genero/obtener_usuarios')
    .subscribe((data) => {
      this.genero = data;
      this.userForm.get('generoId')?.enable();
    });
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


  this.respuestasGoogleFormularioService.enviarGoogleFormIds(this.googleFormIds).subscribe(
    (response) => {
    },
    (error) => {
      console.error('Error al enviar los Google Form Ids:', error);
    }
  );
}

obtenerRespuestas(candidatoId: number) {
  this.respuestasGoogleFormularioService.obtenerRespuestasPorCandidatoId(candidatoId).subscribe(
    (respuestas) => {
      this.respuestasGoogleFormulario = respuestas;
      this.calcularEstadosFormularios();

      // Llamar al método detectChanges para forzar la actualización de la vista
      this.changeDetectorRef.detectChanges();
    },
    (error) => {
      console.error('Error al obtener respuestas:', error);
    }
  );
}

filtrarResultadosform() {
  if (!this.filtro) {
    return this.estadosFormularios;
  }
  return this.estadosFormularios.filter(formulario =>
    formulario.formulario.toLowerCase().includes(this.filtro.toLowerCase())
  );
}

calcularPorcentaje(formularios: Formulario[]): number {
  if (!formularios || formularios.length === 0) {
    return 0; // Si no hay formularios, el progreso es 0.
  }
  const formulariosConRespuestas = formularios.filter(formulario => formulario.preguntasRespuestas && formulario.preguntasRespuestas.length > 0);
  const porcentaje = (formulariosConRespuestas.length / formularios.length) * 100;
  console.log('Formularios con respuestas:', formulariosConRespuestas.length);
  return porcentaje;
}

mostrarRespuestas(candidatoId: number) {
  this.respuestasGoogleFormularioService.obtenerRespuestasPorCandidatoId(candidatoId).subscribe(
    (respuestas) => {
      // Obtener porcentaje
      const porcentaje = this.calcularPorcentaje(respuestas.formularios);
      console.log('Porcentaje de progreso:', porcentaje);

      // Actualizar porcentaje
      this.porcentajeProgreso = porcentaje;

      // Forzar actualización de la vista
      this.changeDetectorRef.detectChanges();
    },
    (error) => {
      console.error('Error al obtener respuestas:', error);
    }
  );
}

filtrarPartidos(): void {
    if (this.tipoSeleccionado !== undefined) {
      this.partidosFiltrados = this.partidos.filter(partido => partido.tipoCandidaturaId === this.tipoSeleccionado);
    } else {
      this.partidosFiltrados = [];
    }
  }

  filtrarPorNombreCandidatura(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'null') {
      this.partidosFiltrados = []; // Otra acción en caso de valor nulo
    } else {
      this.partidosFiltrados = this.partidos.filter(partido => partido.nombreCandidatura === selectedValue);
    }
  }

  seleccionarCandidatura(event: any) {
    const candidaturaSeleccionada = event.target.value;
    if (candidaturaSeleccionada === 'null') {
      this.partidosFiltrados = [];
    } else {
      this.partidosFiltrados = this.partidos.filter(partido => partido.tipoCandidaturaId === parseInt(candidaturaSeleccionada, 10));
    }
  }

}

