import { Component, ElementRef, ViewChild } from '@angular/core';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { PartidoService } from 'src/app/core/services/partidos.service';
import { Partidos } from 'src/app/models/partidos';
import { Coaliciones } from 'src/app/models/coaliciones';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.css']
})
export class PartidosComponent {
  previewImage: string | ArrayBuffer | null = null;
  partidos: Partidos[] = [];
  selectedPartidos: any[] = [];
  partidosSeleccionados: any[] = [];
  coaliciones: Coaliciones[] = [];
  partidoForm: FormGroup;
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

  @ViewChild('imagenInput') imagenInput!: ElementRef;

  constructor(private partidoService: PartidoService, private fb: FormBuilder) {
    this.partidoForm = this.fb.group({
      nombrePartido: [''],
      imagen: [''],
      candidatura: [''],
      selectedPartidos: [''],
      nombreCandidatura: [''],
      nombreCoalicion: [''],
      nombreCanInd: [''],

    });
  }

  ngOnInit() {
    this.obtenerPartidos();
    this.obtenerCoaliciones();
  }

  // Método para abrir el modal
  openModal() {
    this.previewImage = null;
  }

  // Método para cerrar el modal y limpiar los campos
  closeModal() {
    this.partidoForm.reset({
      candidatura:'',



    });
    this.previewImage = null;
    this.nombrePartido = '';
    this.imagenInput.nativeElement.value = '';
    this.candidatura = false;
    this.nombreCandidatura = '';
    this.nombreCoalicion = '';
    this.nombreCanInd = '';
    this.selectedPartidos= [''];
  }

  // Método para manejar el cambio de la imagen
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

  // Método para guardar el partido político
  guardarPartido() {
    this.closeModal();
  }

  // Método para guardar la coalición
  guardarCoalicion() {
    this.partidosSeleccionados = this.selectedPartidos;
    this.closeModal();
  }

  // Método para obtener y mostrar los partidos en la consola
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

  // Método para obtener y mostrar las coaliciones en la consola
  obtenerCoaliciones() {
    this.partidoService.obtenerCoaliciones().subscribe(
      (coaliciones: Coaliciones[]) => {
        this.coaliciones = coaliciones;
        console.log('Coaliciones obtenidas:', this.coaliciones);
      },
      (error) => {
        console.error('Error al obtener coaliciones:', error);
      }
    );
  }

  toggleMostrarCampoPartidos() {
    const candidaturaControl = this.partidoForm.get('candidatura');
    if (candidaturaControl !== null) {
      const tipoCandidatura = candidaturaControl.value;
      this.mostrarCampoPartidos = tipoCandidatura === 'Coalición';
    } else {
      // Manejar el caso en que candidaturaControl es null, si es necesario.
    }
  }

  filtrarResultados() {
    return this.partidos.filter(partido =>
      partido.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

}

