import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.css']
})
export class PartidosComponent {
  nombrePartido: string = '';
  previewImage: string | ArrayBuffer | null = null;

  @ViewChild('imagenInput') imagenInput!: ElementRef;

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

    // Método para guardar coalicion
    guardarCoalicion() {
      this.closeModal();
    }
}
