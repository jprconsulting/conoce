import { Component, ElementRef, ViewChild } from '@angular/core';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { PartidoService } from 'src/app/core/services/partidos.service';
import { Partidos } from 'src/app/models/partidos';
import { Coaliciones } from 'src/app/models/coaliciones';
import { FormGroup,FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.css']
})
export class PartidosComponent {
 // nombrePartido: string = '';
  previewImage: string | ArrayBuffer | null = null;
  partidos: Partidos[] = [];
  selectedPartidos: any[] = [];
  partidosSeleccionados: any[] = [];
  coaliciones: Coaliciones[] = [];
  partidoForm: FormGroup;
  nombrePartido = '';
  candidatura = false;

  @ViewChild('imagenInput') imagenInput!: ElementRef;

  constructor(private partidoService: PartidoService,
    private fb: FormBuilder) {
    this.partidoForm = this.fb.group({
      nombrePartido: [''],
      imagen: [''],
      candidatura: [''],
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
    this.previewImage = null;
    this.nombrePartido = '';
    this.imagenInput.nativeElement.value = '';
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

  guardarCoalicion() {
    this.partidosSeleccionados = this.selectedPartidos;
    this.closeModal();
  }

  // Método para obtener y mostrar los partidos en la consola
  obtenerPartidos() {
    this.partidoService.obtenerPartidos().subscribe(
      (partidos: Partidos[]) => {
        this.partidos = partidos; // Asigna el array de partidos a la propiedad 'partidos'
        console.log('Partidos obtenidos:', this.partidos);
      },
      (error) => {
        console.error('Error al obtener partidos:', error);
      }
    );
  }
obtenerCoaliciones() {
  this.partidoService.obtenerCoaliciones().subscribe(
    (coaliciones: Coaliciones[]) => {
      this.coaliciones = coaliciones;
      console.log('Partidos obtenidos:', this.coaliciones);
    },
    (error) => {
      console.error('Error al obtener partidos:', error);
    }
  );
}

resetForm() {
  this.partidoForm.reset();
  this.previewImage = null;

  // Reemplaza el campo de entrada de archivo con un nuevo clon
  const inputElement = this.imagenInput.nativeElement;
  const newInput = inputElement.cloneNode(true);
  inputElement.parentNode.replaceChild(newInput, inputElement);
}



}
