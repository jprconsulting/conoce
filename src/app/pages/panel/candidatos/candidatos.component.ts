import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { CandidatoService } from 'src/app/core/services/candidato.service';
import { LoadingStates } from 'src/app/global/globals';
import { Candidato } from 'src/app/models/candidato';
import { Estado } from 'src/app/models/estado';
import { Partidos } from 'src/app/models/partidos';
import { EstadoService } from 'src/app/core/services/estados.service';
import { Cargo } from 'src/app/models/cargos';
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
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css']
})
export class CandidatosComponent {

  @ViewChild('closebutton') closebutton!: ElementRef;

  respuestasGoogleFormulario: RespuestaGoogleFormulario = {} as RespuestaGoogleFormulario;
  // Candidato
  id!: number;
  candidatoForm!: FormGroup;
  candidatos: Candidato[] = [];
  candidato!: Candidato;
  candidatosFilter: Candidato[] = [];
  isLoading = LoadingStates.neutro;
  estados: Estado[] = [];
  distritosLocales: DistritoLocal[] = [];
  municipios: Municipio[] = [];
  comunidades: Comunidad[] = [];
  cargos: Cargo[] = [];
  generos: Genero[] = [];
  agrupacionesPoliticas: AgrupacionPolitica[] = [];
  filtro: string = '';
  previewImage: string | ArrayBuffer | null = null;
  currentPage: number = 1;
  isModalAdd = false;
  respuestas: RespuestaGoogleFormulario[] = [];
  fileCandidatura: File | undefined;
  showImage: boolean = true;
  verdadero = "Activo";
  falso = "Inactivo";
  estatusBtn = true;
  estatusTag = this.verdadero;

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
      id: [null],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^([a-zA-ZÀ-ÿ\u00C0-\u00FF]{2})[a-zA-ZÀ-ÿ\u00C0-\u00FF ]+$/)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^([a-zA-ZÀ-ÿ\u00C0-\u00FF]{2})[a-zA-ZÀ-ÿ\u00C0-\u00FF ]+$/)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^([a-zA-ZÀ-ÿ\u00C0-\u00FF]{2})[a-zA-ZÀ-ÿ\u00C0-\u00FF ]+$/)]],
      sobrenombre: ['', [Validators.required, Validators.minLength(2)]],
      nombreSuplente: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^([a-zA-ZÀ-ÿ\u00C0-\u00FF]{2})[a-zA-ZÀ-ÿ\u00C0-\u00FF ]+$/)]],
      fechaNacimiento: ['', Validators.required],
      direccionCasaCampania: ['', [Validators.required, Validators.minLength(6)]],
      telefonoPublico: ['', [Validators.required, Validators.minLength(9), Validators.pattern(/[0-9]/)]],
      email: ['', [Validators.required, Validators.email]],
      paginaWeb: [''],
      facebook: ['', Validators.required],
      twitter: ['', Validators.required],
      instagram: ['', Validators.required],
      tiktok: ['', Validators.required],
      foto: [null],
      imagenBase64: [''],
      estatus: [this.estatusBtn],
      agrupacionPoliticaId: [null, Validators.required],
      cargoId: [null, Validators.required],
      estadoId: [null, Validators.required],
      generoId: [null, Validators.required],
      distritoLocalId: [null, Validators.required],
      municipioId: [null, Validators.required],
      comunidadId: [null, Validators.required],
    });
  }
  setEstatus() {
    this.estatusTag = this.estatusBtn ? this.verdadero : this.falso;
  }
  onFileSelectCand(event: any) {
    this.fileCandidatura = event.target.files.item(0) as File;
  }


  exportarDatosAExcel() {
    if (this.candidatos.length === 0) {
      console.warn('La lista de candidatos está vacía. No se puede exportar.');
      return;
    }

    const datosParaExportar = this.candidatos.map(candidato => {
      const estatus = candidato.estatus ? 'Activo' : 'Inactivo';
      return {
        'Id': candidato.id,
        'Nombres': candidato.nombres,
        'Apellido paterno': candidato.apellidoMaterno,
        'Apellido materno': candidato.apellidoMaterno,
        'Sobrenombre': candidato.sobrenombre,
        'Nombre suplente': candidato.nombreSuplente,
        'Fecha de nacimiento': candidato.fechaNacimiento,
        'Direccion de campaña': candidato.direccionCasaCampania,
        'Telefono publico': candidato.telefonoPublico,
        'Email': candidato.email,
        'Pagina web': candidato.paginaWeb,
        'facebook': candidato.facebook,
        'twitter': candidato.twitter,
        'instagram': candidato.instagram,
        'tiktok': candidato.tiktok,
        'Estatus': estatus,
        'agrupacionPoliticaId': candidato.agrupacionPolitica,
        'cargoId': candidato.cargo.nombreCargo,
        'estadoId': candidato.estado.nombreEstado,
        'generoId': candidato.genero.nombreGenero,
        'distritoLocalId': candidato.distritoLocal.nombreDistritoLocal,
        'municipioId': candidato.municipio.nombreMunicipio,
        'comunidadId': candidato.comunidad.nombreComunidad
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExportar);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.guardarArchivoExcel(excelBuffer, 'candidatos.xlsx');
  }
  guardarArchivoExcel(buffer: any, nombreArchivo: string) {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  getCandidatos() {
    this.isLoading = LoadingStates.trueLoading;
    this.candidatoService.getCandidatos().subscribe(
      {
        next: (dataFromAPI) => {
          this.candidatos = dataFromAPI;
          this.candidatosFilter = this.candidatos; console.log(this.candidatos);
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
  onPageChange(number: number) {
    this.configPaginator.currentPage = number;
  }
  agregarCandidato() {
    this.candidato = this.candidatoForm.value as Candidato;
    const agrupacionPoliticaId = this.candidatoForm.get('agrupacionPoliticaId')?.value;
    this.candidato.agrupacionPolitica = { id: agrupacionPoliticaId } as AgrupacionPolitica;
    const cargoId = this.candidatoForm.get('cargoId')?.value;
    this.candidato.cargo = { id: cargoId } as Cargo;
    const generoId = this.candidatoForm.get('generoId')?.value;
    this.candidato.genero = { id: generoId } as Genero;
    const estadoId = this.candidatoForm.get('estadoId')?.value;
    this.candidato.estado = { id: estadoId } as Estado;
    const distritoLocalId = this.candidatoForm.get('distritoLocalId')?.value;
    this.candidato.distritoLocal = { id: distritoLocalId } as DistritoLocal;
    const municipioId = this.candidatoForm.get('municipioId')?.value;
    this.candidato.municipio = { id: municipioId } as Municipio;
    const comunidadId = this.candidatoForm.get('comunidadId')?.value;
    this.candidato.comunidad = { id: comunidadId } as Comunidad;
    const imagenBase64 = this.candidatoForm.get('imagenBase64')?.value;

    console.log(this.candidato);
    if (imagenBase64) {
      const candidato = { ...this.candidato, imagenBase64 };
      this.candidatoService.postCandidato(this.candidato).subscribe({
        next: () => {
          this.mensajeService.mensajeExito("Candidato agregado con éxito");
          this.resetForm();
          this.getCandidatos();
        },
        error: (error) => {
          this.mensajeService.mensajeError("Error al agregar al candidato");
          console.error(error);
        }
      });
    } else {
      console.error('Error: No se encontró una representación válida en base64 de la imagen.');
    }
  }

  actualizarUsuario(candidato: Candidato) {
    this.candidato = this.candidatoForm.value as Candidato;
    const agrupacionPoliticaId = this.candidatoForm.get('agrupacionPoliticaId')?.value;
    this.candidato.agrupacionPolitica = { id: agrupacionPoliticaId } as AgrupacionPolitica;
    const cargoId = this.candidatoForm.get('cargoId')?.value;
    this.candidato.cargo = { id: cargoId } as Cargo;
    const generoId = this.candidatoForm.get('generoId')?.value;
    this.candidato.genero = { id: generoId } as Genero;
    const estadoId = this.candidatoForm.get('estadoId')?.value;
    this.candidato.estado = { id: estadoId } as Estado;
    const distritoLocalId = this.candidatoForm.get('distritoLocalId')?.value;
    this.candidato.distritoLocal = { id: distritoLocalId } as DistritoLocal;
    const municipioId = this.candidatoForm.get('municipioId')?.value;
    this.candidato.municipio = { id: municipioId } as Municipio;
    const comunidadId = this.candidatoForm.get('comunidadId')?.value;
    this.candidato.comunidad = { id: comunidadId } as Comunidad;
    const imagenBase64 = this.candidatoForm.get('imagenBase64')?.value;

    console.log(this.candidato);
    this.candidatoService.putCandidato(this.id, candidato).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Candidato actualizado con éxito");
        this.resetForm();
        this.getCandidatos();
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
    this.previewImage = null;
  }



  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // La cadena Base64 incluye el prefijo "data:image/png;base64,"
        const base64String = reader.result as string;

        // Eliminar el prefijo "data:image/png;base64," de la cadena
        const base64WithoutPrefix = base64String.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

        console.log(base64WithoutPrefix); // Verifica que la cadena no incluya el prefijo

        // Asigna la cadena Base64 sin el prefijo al control del formulario base64Logo
        const imagenBase64Control = this.candidatoForm.get('imagenBase64');
        if (imagenBase64Control instanceof FormControl) {
          imagenBase64Control.setValue(base64WithoutPrefix);
        }

        this.previewImage = base64String; // Actualiza la previsualización
      };
    }
  }

  mostrar() {
    this.showImage = true;
  }


  eliminarImagen(event: Event) {
    this.showImage = false;
    this.previewImage = null;
    event.stopPropagation();
  }

  handleChangeAdd() {
    if (this.candidatoForm) {
      this.candidatoForm.reset();
      const estatusControl = this.candidatoForm.get('estatus');
      if (estatusControl) {
        estatusControl.setValue(true);
      }
      this.isModalAdd = true;
      this.previewImage = null;
    }
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

  readFileAsDataURL(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Error al leer el archivo como URL de datos.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo.'));
      };

      reader.readAsDataURL(new Blob([filePath]));
    });
  }

  obtenerRutaImagen(nombreArchivo: string): string {
    const rutaBaseAPI = 'https://localhost:7224/';
    if (nombreArchivo) {
      return `${rutaBaseAPI}images/${nombreArchivo}`;
    }
    return ''; // O una URL predeterminada si no hay nombre de archivo
  }

  imagenAmpliada: string | null = null;
  mostrarImagenAmpliada(rutaImagen: string) {
    this.imagenAmpliada = rutaImagen;
    const modal = document.getElementById('modal-imagen-ampliada');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  cerrarModal() {
    this.imagenAmpliada = null;
    const modal = document.getElementById('modal-imagen-ampliada');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  get imagenControl(): FormControl {
    return this.candidatoForm.get('imagen') as FormControl;
  }
  deleteItem(id: number) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar?`,
      () => {
        this.candidatoService.deleteCandidatos(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Candidato borrado exitosamente');
            this.configPaginator.currentPage = 1;
            this.getCandidatos();
          },
          error: (error) => this.mensajeService.mensajeError(error)
        });
      }
    );
  }
  formatoFecha(fecha: string): string {
    const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
    return fechaFormateada;
  }

  setDataModalUpdatecandidatos(dto: Candidato) {
    this.id = dto.id;
    this.previewImage = dto.imagenBase64,
    this.isModalAdd = false;
    const fechaFormateada = this.formatoFecha(dto.fechaNacimiento);
    this.candidatoForm.patchValue({
      id: dto.id,
      nombres: dto.nombres,
      apellidoPaterno: dto.apellidoPaterno,
      apellidoMaterno: dto.apellidoMaterno,
      sobrenombre: dto.sobrenombre,
      nombreSuplente: dto.nombreSuplente,
      fechaNacimiento: fechaFormateada,
      direccionCasaCampania: dto.direccionCasaCampania,
      telefonoPublico: dto.telefonoPublico,
      email: dto.email,
      paginaWeb: dto.paginaWeb,
      facebook: dto.facebook,
      twitter: dto.twitter,
      instagram: dto.instagram,
      tiktok: dto.tiktok,
      imagenBase64: dto.imagenBase64,
      estatus: dto.estatus,
      agrupacionPoliticaId: dto.agrupacionPolitica.id,
      cargoId: dto.cargo.id,
      estadoId: dto.estado.id,
      generoId: dto.genero.id,
      distritoLocalId: dto.distritoLocal.id,
      municipioId: dto.municipio.id,
      comunidadId: dto.comunidad.id,
    });
    console.log(this.candidatoForm.value);
  }

  filtrarResultados() {
    const filtroLowerCase = this.filtro.toLowerCase().trim();

    return this.candidatos.filter(candidato =>
      candidato.nombres.toLowerCase().includes(filtroLowerCase) ||
      candidato.apellidoPaterno.toLowerCase().includes(filtroLowerCase) ||
      candidato.apellidoMaterno.toLowerCase().includes(filtroLowerCase) ||
      candidato.email.toLowerCase().includes(filtroLowerCase) ||
      candidato.cargo.nombreCargo.toLowerCase().includes(filtroLowerCase) ||
      candidato.genero.nombreGenero.toLowerCase().includes(filtroLowerCase)
    );
  }
obtenerRespuestas(id: number) {
  console.log(id)
  console.log('fdhjfdsh')
  this.respuestasGoogleFormularioService.obtenerRespuestasPorCandidatoId(id).subscribe(
    (respuestas) => {
      this.respuestasGoogleFormulario = respuestas;
      console.log(this.respuestasGoogleFormulario);
    },
    (error) => {
      console.error('Error al obtener respuestas:', error);
    }
  );
}

}

