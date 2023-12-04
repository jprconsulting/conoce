import { Component, ElementRef, ViewChild } from '@angular/core';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { CandidaturasService } from 'src/app/core/services/candidaturas.service';
import { Partidos } from 'src/app/models/partidos';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core'; // Importa Pipe y PipeTransform
import { LoadingStates } from 'src/app/global/globals';

@Component({
  selector: 'app-partidos',
  templateUrl: './candidaturas.component.html',
  styleUrls: ['./candidaturas.component.css']
})


export class CandidaturasComponent {
  isLoadingUsers = LoadingStates.neutro;
  previewImage: string | ArrayBuffer | null = null;
  partido!: Partidos;
  partidos: Partidos[] = [];
  selectedPartidos: any[] = [];
  partidosSeleccionados: any[] = [];
  partidoForm!: FormGroup;
  nombrePartido = '';
  nombreCoalicion = '';
  nombreCanInd = '';
  logo = '';
  candidatura = false;
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
    private candidaturaService: CandidaturasService,
    private formBuilder: FormBuilder,
    private mensajeService: MensajeService,

    ) {
    this.crearFormularioPartido();
    this.agruparDatosPorTipoCandidatura();
  }

  ngOnInit() {
    console.log('En ngOnInit, antes de obtener los partidos');
    this.obtenerPartidos();
    console.log('En ngOnInit, después de obtener los partidos');
    this.agruparDatosPorTipoCandidatura();
  }

  private agruparDatosPorTipoCandidatura() {
    console.log('Dentro de agruparDatosPorTipoCandidatura, antes de filtrar');
    this.datosAgrupados['Partido Politico'] = this.datos.filter(partido => partido.tipoCandidaturaId === 1);
    console.log('Datos agrupados para Partido Politico:', this.datosAgrupados['Partido Politico']);
    this.datosAgrupados['Candidatura Común'] = this.datos.filter(partido => partido.tipoCandidaturaId === 2);
    console.log('Datos agrupados para Candidatura Común:', this.datosAgrupados['Candidatura Común']);
    this.datosAgrupados['Coalición'] = this.datos.filter(partido => partido.tipoCandidaturaId === 3);
    console.log('Datos agrupados para Coalición:', this.datosAgrupados['Coalición']);
    this.datosAgrupados['Candidatura Independiente'] = this.datos.filter(partido => partido.tipoCandidaturaId === 4);
    console.log('Datos agrupados para Candidatura Independiente:', this.datosAgrupados['Candidatura Independiente']);
  }


  // Método para abrir el modal
  openModal() {
    this.previewImage = null;
  }

  crearFormularioPartido() {
    this.partidoForm = this.formBuilder.group({
      candidaturaId: [null],
      candidatura: ['', Validators.required],
      acronimo: [''],
      estatus: [true, Validators.required],
      logo: ['']
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
      const base64LogoControl = this.partidoForm.get('base64Logo');
      if (base64LogoControl instanceof FormControl) {
        base64LogoControl.setValue(base64WithoutPrefix);
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
  const candidaturaControl = this.partidoForm.get('candidatura');

  if (candidaturaControl && candidaturaControl.value !== null && this.partidoForm.valid) {
    const tipoAgrupacionId = candidaturaControl.value;
    const tipoAgrupacionTexto = this.getTipoAgrupacionNombre(tipoAgrupacionId);

    // Obtén el elemento <select> del HTML
    const selectElement = document.getElementById('candidatura') as HTMLSelectElement;

    // Obtén el texto de la opción seleccionada directamente
    const selectedOptionText = selectElement.options[selectElement.selectedIndex].text;

    const acronimo = this.partidoForm.get('acronimo')?.value || '';
    const estatus = this.partidoForm.get('estatus')?.value || '';
    const logo = this.partidoForm.get('logo')?.value || '';
    const foto = this.partidoForm.get('foto')?.value || '';


    // Elimina el prefijo "data:image/png;base64," del valor de base64Logo
    const base64LogoControl = this.partidoForm.get('base64Logo');
    let base64Logo = base64LogoControl?.value || '';
    if (base64Logo.startsWith('data:image/png;base64,')) {
      base64Logo = base64Logo.replace('data:image/png;base64,', ''); // Elimina el prefijo
    }

    const nombreFoto = this.partidoForm.get('nombreFoto')?.value || '';

    // Crea el objeto partido con los valores
    const partido = {
      tipoCandidaturaId: tipoAgrupacionId,
      nombreCandidatura: selectedOptionText, // Utiliza el texto directamente
      acronimo,
      estatus,
      // base64Logo, (si es necesario)
      nombreFoto,
      logo,
      foto
    };

    // Agrega un console.log para verificar los datos a enviar
    console.log('Datos a enviar:', partido);

    // Envía el objeto partido al servicio
    this.candidaturaService.postCandidaturas(partido).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Agrupación agregada con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar agrupación");
        console.error(error);
      }
    });
  } else {
    console.log('El formulario no es válido o candidaturaControl es nulo. No se enviarán datos.');
  }
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

  getPartidosPorTipoCandidatura(tipoCandidatura: string): Partidos[] {
    return this.datos.filter(partido => partido.tipoCandidaturaId === this.getTipoCandidaturaId(tipoCandidatura));
  }

  getTipoCandidaturaId(nombreCandidatura: string): number {
    // Mapea los nombres de candidatura a sus respectivos IDs
    switch (nombreCandidatura.toLowerCase()) {
      case 'partido politico':
        return 1;
      case 'candidatura comun':
        return 2;
      case 'coalicion':
        return 3;
      case 'candidatura independiente':
        return 4;
      default:
        return 0; // Puedes usar 0 para representar un valor desconocido o no válido
    }
  }

  getTipoAgrupacionNombre(valor: number): string {
    console.log('getTipoAgrupacionNombre recibió valor:', valor);

    switch (valor) {
      case 1:
        return "Partido político";
      case 2:
        return "Candidatura común";
      case 3:
        return "Coalición";
      case 4:
        return "Candidatura independiente";
      default:
        return "";
    }
  }

  obtenerRutaImagen(nombreArchivo: string): string {
    const rutaBaseApp = 'https://localhost:7154/';

    if (nombreArchivo) {
      return `${rutaBaseApp}images/${nombreArchivo}`;
    }

    return '/assets/images/';
  }
}


