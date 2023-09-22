import { Component, ElementRef, ViewChild } from '@angular/core';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { CandidaturasService } from 'src/app/core/services/candidaturas.service';
import { Partidos } from 'src/app/models/partidos';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core'; // Importa Pipe y PipeTransform

@Pipe({
  name: 'filterByTipoCandidatura'
})
export class FilterByTipoCandidaturaPipe implements PipeTransform {
  transform(items: any[], filtro: string): any[] {
    if (!filtro) return items; // Si el filtro está vacío, retorna todos los elementos.

    // Filtra los elementos que coinciden con el tipo de candidatura especificado.
    return items.filter(item => item.nombreTipoCandidatura.toLowerCase().includes(filtro.toLowerCase()));
  }
}

@Component({
  selector: 'app-partidos',
  templateUrl: './candidaturas.component.html',
  styleUrls: ['./candidaturas.component.css']
})


export class CandidaturasComponent {
  previewImage: string | ArrayBuffer | null = null;
  partido!: Partidos;
  partidos: Partidos[] = [];
  selectedPartidos: any[] = [];
  partidosSeleccionados: any[] = [];
  partidoForm!: FormGroup;
  nombrePartido = '';
  nombreCandidatura = '';
  nombreCoalicion = '';
  nombreCanInd = '';
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
    this.obtenerPartidos();
  }

  private agruparDatosPorTipoCandidatura() {
    this.datosAgrupados['Partido Político'] = this.datos.filter(partido => partido.nombreTipoCandidatura === 'Partido Político');
    this.datosAgrupados['Candidatura Común'] = this.datos.filter(partido => partido.nombreTipoCandidatura === 'Candidatura Común');
    this.datosAgrupados['Coalición'] = this.datos.filter(partido => partido.nombreTipoCandidatura === 'Coalición');
    this.datosAgrupados['Candidatura Independiente'] = this.datos.filter(partido => partido.nombreTipoCandidatura === 'Candidatura Independiente');
  }
  // Método para abrir el modal
  openModal() {
    this.previewImage = null;
  }

  crearFormularioPartido() {
    this.partidoForm = this.formBuilder.group({
      candidatura: ['', Validators.required],
      nombrePartido: [''],
      acronimoPartido: [''],
      nombreCandidatura: [''],
      acronimoCandidatura: [''],
      nombreCoalicion: [''],
      acronimoCoalicion: [''],
      nombreCanInd: [''],
      acronimoCanInd: [''],
      estatus: [true, Validators.required],
      imagen: [null, Validators.required],
      nombreFoto: ['',Validators.required],
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
  this.nombreCandidatura = '';
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
        this.previewImage = reader.result; // Actualiza la previsualización

        const fotoControl = this.partidoForm.get('foto');
        if (fotoControl) {
          fotoControl.setValue(reader.result); // Actualiza el campo "foto" en el formulario
        }
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



  toggleMostrarCampoPartidos() {
    const candidaturaControl = this.partidoForm.get('candidatura');
    if (candidaturaControl) {
      const candidaturaValue = candidaturaControl.value;

      // Deshabilitar todos los campos primero
      const nombrePartidoControl = this.partidoForm.get('nombrePartido');
      const acronimoPartidoControl = this.partidoForm.get('acronimoPartido');
      const nombreCandidaturaControl = this.partidoForm.get('nombreCandidatura');
      const acronimoCandidaturaControl = this.partidoForm.get('acronimoCandidatura');
      const nombreCoalicionControl = this.partidoForm.get('nombreCoalicion');
      const acronimoCoalicionControl = this.partidoForm.get('acronimoCoalicion');
      const nombreCanIndControl = this.partidoForm.get('nombreCanInd');
      const acronimoCanIndControl = this.partidoForm.get('acronimoCanInd');

      nombrePartidoControl?.setValue('');
      acronimoPartidoControl?.setValue('');
      nombreCandidaturaControl?.setValue('');
      acronimoCandidaturaControl?.setValue('');
      nombreCoalicionControl?.setValue('');
      acronimoCoalicionControl?.setValue('');
      nombreCanIndControl?.setValue('');
      acronimoCanIndControl?.setValue('');

      // Habilitar los campos según la opción seleccionada
      if (candidaturaValue === 'Partido') {
        nombrePartidoControl?.enable();
        acronimoPartidoControl?.enable();
      } else if (candidaturaValue === 'Candidatura común') {
        nombreCandidaturaControl?.enable();
        acronimoCandidaturaControl?.enable();
      } else if (candidaturaValue === 'Coalición') {
        nombreCoalicionControl?.enable();
        acronimoCoalicionControl?.enable();
      } else if (candidaturaValue === 'Candidatura independiente') {
        nombreCanIndControl?.enable();
        acronimoCanIndControl?.enable();
      }
    }
  }

  filtrarResultados() {
    return this.partidos.filter(partido =>
      partido.nombreTipoCandidatura.toLowerCase().includes(this.filtro.toLowerCase()),
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
    console.log('Datos a enviar:', this.partido); // Agrega esta línea para ver los datos antes de enviarlos

    this.candidaturaService.postCandidaturas(this.partido).subscribe({
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
      const tipoCandidatura = partido.nombreTipoCandidatura;
      if (!datosAgrupados[tipoCandidatura]) {
        datosAgrupados[tipoCandidatura] = [];
      }
      datosAgrupados[tipoCandidatura].push(partido);
    });

    return datosAgrupados;
  }

  getPartidosPorTipoCandidatura(tipoCandidatura: string): Partidos[] {
    return this.datos.filter(partido => partido.nombreTipoCandidatura === tipoCandidatura);
  }


}


