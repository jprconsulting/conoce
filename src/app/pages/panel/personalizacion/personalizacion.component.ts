import { Component, OnInit } from '@angular/core';
import { Diseño } from 'src/app/models/diseño';
import { PersonalizacionService } from 'src/app/core/services/personalizacion.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';

@Component({
  selector: 'app-personalizacion',
  templateUrl: './personalizacion.component.html',
  styleUrls: ['./personalizacion.component.css']
})
export class PersonalizacionComponent implements OnInit {
  diseño!: Diseño;

  constructor(
    private personalizacionService: PersonalizacionService,
    private mensajeService: MensajeService

  ) {}

  ngOnInit() {
    this.personalizacionService.obtenerConfiguracion().subscribe((config: Diseño) => {
      this.diseño = config;
    });
  }

  // Función para manejar la carga de archivos de imagen
  handleLogoInstFileInput(files: FileList) {
    this.diseño.LogoIntitucional = files.item(0);
  }

  handleLogoAppFileInput(files: FileList) {
    this.diseño.LogoAplicacion = files.item(0);
  }

  handleImgBienvenFileInput(files: FileList) {
    this.diseño.ImagenBienvenida = files.item(0);
  }

  guardarConfiguracion() {
    this.personalizacionService.guardarConfiguracion(this.diseño).subscribe(
      (config: Diseño) => {
        // Manejar la respuesta o mostrar un mensaje de éxito
        this.mensajeService.mensajeExito('Configuración guardada con éxito.');
      },
      (error) => {
        // Manejar errores y mostrar un mensaje de error
        this.mensajeService.mensajeError('Error al guardar la configuración.');
      }
    );
  }

}
