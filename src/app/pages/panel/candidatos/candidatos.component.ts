import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { CandidatoService } from 'src/app/core/services/candidato.service';
import { LoadingStates } from 'src/app/global/globals';
import { Candidato } from 'src/app/models/candidato';
import { Estado } from 'src/app/models/estado';
import { Partidos } from 'src/app/models/partidos';
import { EstadoService } from 'src/app/core/services/estados.service';
import { Cargos } from 'src/app/models/cargos';
import { Genero } from 'src/app/models/genero';
import { HttpClient } from '@angular/common/http';
import { FormularioService } from 'src/app/core/services/formulario.service';
import { RespuestasGoogleService } from 'src/app/core/services/respuestasGoogle.service';
import { EstadoFormulario, Formulario, RespuestaGoogleFormulario } from 'src/app/models/respuesta-google-formulario';
import { DistritoLocalService } from 'src/app/core/services/distritolocal.service';
import { MunicipioService } from 'src/app/core/services/municipio.service';
import { ComunidadService } from 'src/app/core/services/comunidad.service';
import { DistritoLocal } from 'src/app/models/distritoLocal';
import { Municipio } from 'src/app/models/municipio';
import { Comunidad } from 'src/app/models/comunidad';
import { ConfigGoogleForm } from 'src/app/models/formulario';
import { PaginationInstance } from 'ngx-pagination';
import { CargoService } from 'src/app/core/services/cargo.service';
import { GeneroService } from 'src/app/core/services/genero.service';
import { AgrupacionPolitica } from 'src/app/models/agrupacion-politica';
import { AgrupacionPoliticaService } from 'src/app/core/services/agrupacion-politica.service';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css']
})
export class CandidatosComponent {

  @ViewChild('closebutton') closebutton!: ElementRef;

  respuestasGoogleFormulario: RespuestaGoogleFormulario = {} as RespuestaGoogleFormulario;
  // Candidato
  candidatoForm!: FormGroup;
  candidatos: Candidato[] = [];
  candidatosFilter: Candidato[] = [];
  isLoading = LoadingStates.neutro;


  estados: Estado[] = [];
  distritosLocales: DistritoLocal[] = [];
  municipios: Municipio[] = [];
  comunidades: Comunidad[] = [];
  cargos: Cargos[] = [];
  generos: Genero[] = [];
  agrupacionesPoliticas: AgrupacionPolitica[] = [];


  previewImage: string | ArrayBuffer | null = null;
  currentPage: number = 1;
  isModalAdd = false;
  respuestas: RespuestaGoogleFormulario[] = [];
  fileCandidatura: File | undefined;

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private candidatoService: CandidatoService,
    private fbGenerador: FormBuilder,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private cargoService: CargoService,
    private generoService: GeneroService,
    private agrupacionPoliticaService: AgrupacionPoliticaService,
    private formularioService: FormularioService,
    private respuestasGoogleFormularioService: RespuestasGoogleService,
    private changeDetectorRef: ChangeDetectorRef,
    private distritoLocalService: DistritoLocalService,
    private municipioService: MunicipioService,
    private comunidadService: ComunidadService,

  ) {
    this.creteForm();    
    this.getCandidatos();
    this.getCargos();
    this.getGeneros();
    this.getEstados();
    this.getDistritos();
    this.getMunicipios();
    this.getComunidades();
    this.getAgrupacionesPoliticas();
    this.getConfigGoogleForms();
  }

  creteForm() {
    this.candidatoForm = this.formBuilder.group({
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
      foto: [null],
      estatus: [true],
      cargoId: [null, Validators.required],
      estadoId: [null],
      distritoLocalId: [null],
      municipioId: [null],
      comunidadId: [null],
      agrupacionPoliticaId: [null, Validators.required],
      fotoArchivo: [null, Validators.required]
    });
  }

  onFileSelectCand(event: any) {
    this.fileCandidatura = event.target.files.item(0) as File;
  }


  exportarDatosAExcel() {

  }

  getCandidatos() {
    this.isLoading = LoadingStates.trueLoading;
    this.candidatoService.getCandidatos().subscribe(
      {
        next: (dataFromAPI) => {
          this.candidatos = dataFromAPI;
          this.candidatosFilter = this.candidatos;
          this.isLoading = LoadingStates.falseLoading;
        },
        error: () => {
          this.isLoading = LoadingStates.errorLoading
        }
      }
    );
  }

  getCargos() {
    this.cargoService.getCargos().subscribe({ next: (dataFromAPI) => this.cargos = dataFromAPI });
  }

  getGeneros() {
    this.generoService.getGeneros().subscribe({ next: (dataFromAPI) => this.generos = dataFromAPI });
  }

  getEstados() {
    this.estadoService.getEstados().subscribe({ next: (dataFromAPI) => this.estados = dataFromAPI });
  }

  getDistritos() {
    this.distritoLocalService.getDistritosLocales().subscribe({ next: (dataFromAPI) => this.distritosLocales = dataFromAPI });
  }

  getMunicipios() {
    this.municipioService.getMunicipios().subscribe({ next: (dataFromAPI) => this.municipios = dataFromAPI });
  }

  getComunidades() {
    this.comunidadService.getComunidades().subscribe({ next: (dataFromAPI) => this.comunidades = dataFromAPI });
  }

  getAgrupacionesPoliticas() {
    this.agrupacionPoliticaService.getAgrupacionesPoliticas().subscribe({ next: (dataFromAPI) => this.agrupacionesPoliticas = dataFromAPI });
  }

  submitUsuario() {
    if (this.isModalAdd) {
      this.agregarCandidato();
    } else {
      const candidatoToAddOrUpdate: Candidato = this.candidatoForm.value as Candidato;
      this.actualizarUsuario(candidatoToAddOrUpdate);
    }
  }

  agregarCandidato() {
    const candidatoToAddOrUpdate: Candidato = this.candidatoForm.value as Candidato;
    const file: File | null = this.candidatoForm.get('fotoArchivo')?.value as File;

    if (file) {
      const formData = new FormData();
      formData.append('fotoArchivo', file);

      formData.append('candidatoId', this.candidatoForm.get('candidatoId')?.value ? this.candidatoForm.get('candidatoId')?.value.toString() : '');
      formData.append('nombre', this.candidatoForm.get('nombre')?.value);
      formData.append('apellidoPaterno', this.candidatoForm.get('apellidoPaterno')?.value);
      formData.append('apellidoMaterno', this.candidatoForm.get('apellidoMaterno')?.value);
      formData.append('sobrenombrePropietario', this.candidatoForm.get('sobrenombrePropietario')?.value);
      formData.append('generoId', this.candidatoForm.get('generoId')?.value);
      formData.append('nombreSuplente', this.candidatoForm.get('nombreSuplente')?.value);
      formData.append('fechaNacimiento', this.candidatoForm.get('fechaNacimiento')?.value);
      formData.append('direccionCasaCampania', this.candidatoForm.get('direccionCasaCampania')?.value);
      formData.append('telefonoPublico', this.candidatoForm.get('telefonoPublico')?.value);
      formData.append('email', this.candidatoForm.get('email')?.value);
      formData.append('paginaWeb', this.candidatoForm.get('paginaWeb')?.value);
      formData.append('facebook', this.candidatoForm.get('facebook')?.value);
      formData.append('twitter', this.candidatoForm.get('twitter')?.value);
      formData.append('instagram', this.candidatoForm.get('instagram')?.value);
      formData.append('tiktok', this.candidatoForm.get('tiktok')?.value);
      formData.append('estatus', this.candidatoForm.get('estatus')?.value);
      formData.append('cargoId', this.candidatoForm.get('cargoId')?.value);
      formData.append('estadoId', this.candidatoForm.get('estadoId')?.value);
      formData.append('distritoLocalId', this.candidatoForm.get('distritoLocalId')?.value);
      formData.append('municipioId', this.candidatoForm.get('municipioId')?.value);
      formData.append('comunidadId', this.candidatoForm.get('comunidadId')?.value);
      formData.append('candidaturaId', this.candidatoForm.get('candidaturaId')?.value);

      this.candidatoService.postCandidato(formData).subscribe({
        next: () => {
          console.log('Candidato agregado con éxito');
        },
        error: (error) => {
          console.error('Error al agregar al candidato:', error);
        }
      });
    } else {
      console.error('Por favor, selecciona una foto.');
    }
  }

  onFileChange(event: any) {
    const file = event?.target?.files?.[0];
    if (file) {
      const fileName = file.name;
      console.log(fileName); // Esto mostrará el nombre del archivo en la consola
      this.candidatoForm.get('fotoArchivo')?.setValue(file);
    }
  }

  actualizarUsuario(candidato: Candidato) {
    this.candidatoService.putCandidato(candidato).subscribe({
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
    this.candidatoForm.reset();
  }



  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.previewImage = reader.result; // Actualiza la previsualización

        const fotoControl = this.candidatoForm.get('foto');
        if (fotoControl) {
          fotoControl.setValue(reader.result); // Actualiza el campo "foto" en el formulario
        }
      };
    }
  }

  eliminarImagen() {
    this.previewImage = null;
  }



  handleChangeAdd() {
    this.candidatoForm.reset();
    this.isModalAdd = true;
  }

  getConfigGoogleForms() {
    // this.formularioService.getFormularios().subscribe(
    //   (configGoogleFormsFromApi) => {
    //     this.configGoogleForms = configGoogleFormsFromApi;
    //     console.log('Configuraciones de Google Form cargadas:', this.configGoogleForms);
    //   },
    //   (error) => {
    //     console.error('Error al cargar configuraciones de Google Form:', error);
    //   }
    // );
  }

  handleChangeSearch(event: any) {
    const inputValue = event.target.value;
    const valueSearch = inputValue.toLowerCase();

    this.configPaginator.currentPage = 1;
  }

  obtenerRutaImagen(nombreArchivo: string): string {
    const rutaBaseApp = 'https://localhost:7154/';

    if (nombreArchivo) {
      return `${rutaBaseApp}images/${nombreArchivo}`;
    }
    return '/assets/images/';
  }



}

