import { Component, OnInit } from '@angular/core';
import { Diseño } from 'src/app/models/diseño';
import { PersonalizacionService } from 'src/app/core/services/personalizacion.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personalizacion',
  templateUrl: './personalizacion.component.html',
  styleUrls: ['./personalizacion.component.css']
})
export class PersonalizacionComponent implements OnInit {
  diseño!: Diseño;
  PersonalizacionForm!:FormGroup;
  previewImage1: string | ArrayBuffer | null = null;
  previewImage2: string | ArrayBuffer | null = null;
  previewImage3: string | ArrayBuffer | null = null;
  userForm!: FormGroup
  
  constructor(
    private personalizacionService: PersonalizacionService,
    private mensajeService: MensajeService,
    private formBuilder: FormBuilder,

  ) {}

  ngOnInit() {
    this.crearFormulario();  // Initialize the form
    this.personalizacionService.obtenerConfiguracion().subscribe((config: Diseño) => {
      this.diseño = config;
    });
  }
  

  // Función para manejar la carga de archivos de imagen
  handleLogoInstFileInput(files: FileList) {
    this.diseño.logoIntitucional = files.item(0);
  }

  handleLogoAppFileInput(files: FileList) {
    this.diseño.logoAplicacion = files.item(0);
  }

  handleImgBienvenFileInput(files: FileList) {
    this.diseño.imagenBienvenida = files.item(0);
  }

  guardarConfiguracion() {
    const diseño = { ...this.PersonalizacionForm.value };
    console.log('Datos',diseño);
    this.personalizacionService.guardarConfiguracion(diseño).subscribe(
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
  onImageChange1(event: any) {
    const file = event.target.files[0];
    const maxAllowedWidth = 500;
    const maxAllowedHeight = 500;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width <= maxAllowedWidth && img.height <= maxAllowedHeight) {
            // La imagen cumple con el tamaño permitido
            this.previewImage1 = reader.result; // Actualiza la previsualización
            const fotoControl = this.userForm.get('foto');
            if (fotoControl) {
              fotoControl.setValue(reader.result); // Actualiza el campo "foto" en el formulario
            }
          } else {
            // La imagen excede las dimensiones permitidas
            this.mensajeService.mensajeError("La imagen debe ser de 500px por 500px como máximo");
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  
  }
  eliminarImagen1() {
    this.previewImage1 = null;
  }
  crearFormulario() {
    this.PersonalizacionForm = this.formBuilder.group({
      numeroTelefono: ['' , [Validators.required, Validators.pattern('^[0-9]+$'),Validators.minLength(10), Validators.maxLength(10)]],
      logoIntitucional:['' , [Validators.required]],
      logoAplicacion: ['' , [Validators.required]],
      imagenBienvenida: ['' , [Validators.required]],
      direccion: ['' , [Validators.required,Validators.maxLength(50),,Validators.minLength(7)]],
      uRLFacebook: ['' , [Validators.required,Validators.minLength(15)]],
      uRLInstagram: ['' , [Validators.required,Validators.minLength(15)]],
      uRLTwitter: ['' , [Validators.required,Validators.minLength(15)]],
      uRLYoutube: ['' , [Validators.required,Validators.minLength(15)]],
      colorprimario: ['' , [Validators.required]],
      colorsecundario: ['' , [Validators.required]]
    });
  }
  
  onImageChange2(event: any) {
    const file = event.target.files[0];
    const maxAllowedWidth = 500;
    const maxAllowedHeight = 500;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width <= maxAllowedWidth && img.height <= maxAllowedHeight) {
            // La imagen cumple con el tamaño permitido
            this.previewImage2 = reader.result; // Actualiza la previsualización
            const fotoControl = this.userForm.get('foto');
            if (fotoControl) {
              fotoControl.setValue(reader.result); // Actualiza el campo "foto" en el formulario
            }
          } else {
            // La imagen excede las dimensiones permitidas
            this.mensajeService.mensajeError("La imagen debe ser de 500px por 500px como máximo");
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  eliminarImagen2() {
    this.previewImage2 = null;
  }
  onImageChange3(event: any) {
    const file = event.target.files[0];
    const maxAllowedWidth = 500;
    const maxAllowedHeight = 500;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width <= maxAllowedWidth && img.height <= maxAllowedHeight) {
            // La imagen cumple con el tamaño permitido
            this.previewImage3 = reader.result; // Actualiza la previsualización
            const fotoControl = this.userForm.get('foto');
            if (fotoControl) {
              fotoControl.setValue(reader.result); // Actualiza el campo "foto" en el formulario
            }
          } else {
            // La imagen excede las dimensiones permitidas
            this.mensajeService.mensajeError("La imagen debe ser de 500px por 500px como máximo");
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  eliminarImagen3() {
    this.previewImage2 = null;
  }
}
