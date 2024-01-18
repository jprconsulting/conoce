import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { CandidaturasService } from 'src/app/core/services/candidaturas.service';
import { Partidos } from 'src/app/models/partidos';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core'; // Importa Pipe y PipeTransform
import { LoadingStates } from 'src/app/global/globals';
import { TipoCandidatura } from 'src/app/models/tipocandidatura';
import { PaginationInstance } from 'ngx-pagination';
import { Candidaturas } from 'src/app/models/candidaturas';

@Component({
  selector: 'app-partidos',
  templateUrl: './candidaturas.component.html',
  styleUrls: ['./candidaturas.component.css']
})


export class CandidaturasComponent {
  isLoadingUsers = LoadingStates.neutro;
  previewImage: string | ArrayBuffer | null = null;
  partido!: Partidos;
  candidaturas!:Candidaturas;
  partidos: Partidos[] = [];
  TipoCandidaturas: TipoCandidatura [] =[];
  selectedPartidos: any[] = [];
  partidosSeleccionados: any[] = [];
  partidoForm!: FormGroup;
  nombrePartido = '';
  nombreCoalicion = '';
  nombreCanInd = '';
  logo = '';
  candidatura = false;
  usuariosFilter: Partidos[] = [];
  filtro: string = '';
  itemsPerPage: number = 2;
  currentPage: number = 1;
  mostrarCampoPartidos  = false;
  itemsPerPageOptions: number[] = [2, 4, 6];
  isModalAdd = false;
  datos: Partidos[] = [];
  datosAgrupados: { [key: string]: Partidos[] } = {};

  @ViewChild('imagenInput') imagenInput!: ElementRef;
  @ViewChild('closebutton') closebutton!: ElementRef;

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private candidaturaService: CandidaturasService,
    private formBuilder: FormBuilder,
    private mensajeService: MensajeService,

    ) {
    this.crearFormularioPartido();
    //this.agruparDatosPorTipoCandidatura();
    this.getTipo();
  }

  ngOnInit() {
    console.log('En ngOnInit, antes de obtener los partidos');
    this.obtenerPartidos();
    console.log('En ngOnInit, después de obtener los partidos');
    //this.agruparDatosPorTipoCandidatura();
  }

  // private agruparDatosPorTipoCandidatura() {
  //   console.log('Dentro de agruparDatosPorTipoCandidatura, antes de filtrar');
  //   this.datosAgrupados['Partido Politico'] = this.datos.filter(partido => partido.tipoCandidaturaId === 1);
  //   console.log('Datos agrupados para Partido Politico:', this.datosAgrupados['Partido Politico']);
  //   this.datosAgrupados['Candidatura Común'] = this.datos.filter(partido => partido.tipoCandidaturaId === 2);
  //   console.log('Datos agrupados para Candidatura Común:', this.datosAgrupados['Candidatura Común']);
  //   this.datosAgrupados['Coalición'] = this.datos.filter(partido => partido.tipoCandidaturaId === 3);
  //   console.log('Datos agrupados para Coalición:', this.datosAgrupados['Coalición']);
  //   this.datosAgrupados['Candidatura Independiente'] = this.datos.filter(partido => partido.tipoCandidaturaId === 4);
  //   console.log('Datos agrupados para Candidatura Independiente:', this.datosAgrupados['Candidatura Independiente']);
  // }

  getTipo() {
    this.candidaturaService.gettipos().subscribe({
      next: (tipoFromAPI) => {
        this.TipoCandidaturas = tipoFromAPI; console.log('hui',this.TipoCandidaturas)
      },
      error: (error) => {
        console.log('error al obtener los roles', error);
      }
    });
  }
  // Método para abrir el modal
  openModal() {
    this.previewImage = null;
  }
  onPageChange(number: number) {
    this.configPaginator.currentPage = number;
  }
  crearFormularioPartido() {
    this.partidoForm = this.formBuilder.group({
      id: [null],
      tipoOrganizacion:[''],
      candidatura: ['', Validators.required],
      acronimo: [''],
      estatus: [true, Validators.required],
      logo: [''],
      imagenBase64: ['']
      // base64Logo: [''],
      // nombreFoto: ['', Validators.required],
    });
  }




  get imagenControl(): FormControl {
    return this.partidoForm.get('imagen') as FormControl;
  }

  handleChangeAdd() {
    this.partidoForm.reset();
    this.isModalAdd = true;
  }

// Método para cerrar el modal y reiniciar completamente el formulario
closeModal() {
  this.crearFormularioPartido(); // Vuelve a crear el formulario
  this.previewImage = null; // Elimina la imagen de vista previa
  this.nombrePartido = '';
  this.nombreCoalicion = '';
  this.nombreCanInd = '';
  this.selectedPartidos = [];
  this.isModalAdd = false;
}

// Método para manejar el cambio de la imagen
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
      const imagenBase64Control = this.partidoForm.get('imagenBase64');
      if (imagenBase64Control instanceof FormControl) {
        imagenBase64Control.setValue(base64WithoutPrefix);
      }

      this.previewImage = base64String; // Actualiza la previsualización
    };
  }
}

  // Método para guardar el partido político
  guardarPartido() {
    this.closeModal();
  }

  obtenerPartidos() {
    this.candidaturaService.getCandidaturas().subscribe(
      (partidos: Partidos[]) => {
        this.partidos = partidos;
        this.datos = partidos; // Asigna los datos a la variable datos
        console.log('Candidaturas obtenidas:', this.partidos);
      },
      (error) => {
        console.error('Error al obtener las candidaturas:', error);
      }
    );
  }

  eliminarImagen() {
    this.previewImage = null;
  }

  resetForm() {
    this.closebutton.nativeElement.click();
    this.partidoForm.reset();
  }

agregarCargo() {
  const tipoOrganizacionPoliticaValue = this.partidoForm.get('candidatura')?.value;
const tipoOrganizacionPolitica = { id: tipoOrganizacionPoliticaValue } as TipoCandidatura;
console.log('Tipo Organizacion Politica:', tipoOrganizacionPolitica);

    const acronimo = this.partidoForm.get('acronimo')?.value || '';
    const estatus = this.partidoForm.get('estatus')?.value || '';
    const nombreOrganizacion = this.partidoForm.get('logo')?.value || '';
    const imagenBase64 = this.partidoForm.get('imagenBase64')?.value;
 
    const candidaturas = {
      nombreOrganizacion,
      acronimo,
      imagenBase64,
      estatus,
      tipoOrganizacionPolitica, 
    };

    console.log('Datos a enviar:', candidaturas);

    // Envía el objeto partido al servicio
    this.candidaturaService.postCandidaturas(this.candidaturas).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Agrupación agregada con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar agrupación");
        console.error(error);
      }
    });
}

  getDatosAgrupados() {
    const datosAgrupados: { [key: string]: Partidos[] } = {};

    this.datos.forEach(partido => {
      const tipoCandidatura = partido.nombreCandidatura;
      if (!datosAgrupados[tipoCandidatura]) {
        datosAgrupados[tipoCandidatura] = [];
      }
      datosAgrupados[tipoCandidatura].push(partido);
    });

    return datosAgrupados;
  }

  filtrarCandidaturas(tipoCandidatura: string) {
    this.filtro = tipoCandidatura;
  }

  mostrarTodasCandidaturas() {
    this.filtro = '';
  }


  obtenerRutaImagen(nombreArchivo: string): string {
    const rutaBaseApp = 'https://localhost:7154/';

    if (nombreArchivo) {
      return `${rutaBaseApp}images/${nombreArchivo}`;
    }

    return '/assets/images/';
  }
}


