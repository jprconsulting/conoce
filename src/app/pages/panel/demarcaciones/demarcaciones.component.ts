import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { MensajeService } from 'src/app/core/services/mensaje.service';

@Component({
  selector: 'app-demarcaciones',
  templateUrl: './demarcaciones.component.html',
  styleUrls: ['./demarcaciones.component.css']
})
export class DemarcacionesComponent {

  @ViewChild('miFormulario') miFormulario!: NgForm;

  variableDeControl: number = 1;
  selectedPeople: any[] = [];
  distritoLocal: any = {}; // Objeto para almacenar los datos del Distrito local
  ayuntamiento: any = {};
  comunidad: any = {};

  distritosLocales: any[] = [
    { nombre: 'Distrito 1 | Pachuca de Soto', acronimo: 'D-PS' },
    { nombre: 'Distrito 2 | Tulancingo de Bravo', acronimo: 'D-TB' }
  ];
  nuevodistritosLocales: any = {};
  editdistritosLocales: number = -1;
  ayuntamientos: any[] = [
    { nombre: 'Ayuntamiento de Pachuca de Soto', acronimo: 'AY1', activo: true, distritoLocal: 'Distrito 1 | Pachuca de Soto' },
    { nombre: 'Ayuntamiento de Tulancingo de Bravo', acronimo: 'AY2', activo: false, distritoLocal: 'Distrito 2 | Tulancingo de Bravo' }
  ];
  nuevoAyuntamiento: any = {};
  editAyuntamiento: number = -1;
  comunidades: any[] = [
    { nombre: 'Barrio la Camelia', acronimo: 'BC' },
    { nombre: 'Santa María Asunción', acronimo: 'SMA' }
  ];
  nuevaComunidad: any = {}; // Esta variable almacena la nueva Comunidad a agregar

  // Define un FormGroup para el formulario de Distrito Local
  distritoLocalForm: FormGroup;
    nombreTocado= false;
    acronimoTocado=false;
    activoTocado=false;
    extPetTocado=false;
    estadoTocado=false;
  
    constructor(
      private mensajeService: MensajeService,
      private formBuilder: FormBuilder,
    ) {
      //this.crearFormularioGuardar();
      //this.subscribeRolID();

      this.distritoLocalForm = this.formBuilder.group({
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        acronimo: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        activo: [true],
        extPet: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        estado: [''],
      });
    }

  // Define una función para guardar el Distrito Local
  guardarDistritoLocal() {
    if (this.distritoLocalForm.valid) {
      // Aquí debes implementar la lógica para guardar el Distrito local en la base de datos
      console.log('Distrito local guardado:', this.distritoLocalForm.value);
      // Reiniciar el formulario o redirigir según sea necesario
      this.distritoLocalForm.reset();
    } else {
      // Formulario inválido, muestra un mensaje de error o toma alguna acción apropiada.
    }
  }

  // Función para editar un Distrito Local existente en la lista
  editarDistritoLocal(index: number) {
    // Implementa la lógica para editar un Distrito Local aquí
  }

  // Función para eliminar un Distrito Local de la lista
  eliminarDistritoLocal(index: number) {
    this.distritosLocales.splice(index, 1);
  }

  // Define un FormGroup para el formulario de Ayuntamiento
  ayuntamientoForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    acronimo: new FormControl('', Validators.required),
    activo: new FormControl(false),
    distritoLocal: new FormControl('', Validators.required)
  });

  // Define una función para guardar el Ayuntamiento
  guardarAyuntamiento() {
    if (this.ayuntamientoForm.valid) {
      // Aquí debes implementar la lógica para guardar el Ayuntamiento en la base de datos
      console.log('Ayuntamiento guardado:', this.ayuntamientoForm.value);
      // Reiniciar el formulario o redirigir según sea necesario
      this.ayuntamientoForm.reset();
    } else {
      // Formulario inválido, muestra un mensaje de error o toma alguna acción apropiada.
    }
  }

  // Función para editar un Ayuntamiento
  editarAyuntamiento(index: number) {
    // Guardar el índice del Ayuntamiento en edición
    this.editAyuntamiento = index;
    // Copiar los datos del Ayuntamiento al formulario de edición
    this.nuevoAyuntamiento = { ...this.ayuntamientos[index] };
  }

  // Función para guardar los cambios de edición
  guardarEdicion() {
    if (this.editAyuntamiento !== -1) {
      // Actualizar los datos del Ayuntamiento editado en la lista
      this.ayuntamientos[this.editAyuntamiento] = { ...this.nuevoAyuntamiento };
      // Limpiar el formulario y salir del modo de edición
      this.nuevoAyuntamiento = {};
      this.editAyuntamiento = -1;
    }
  }

  // Función para cancelar la edición
  cancelarEdicion() {
    // Limpiar el formulario y salir del modo de edición
    this.nuevoAyuntamiento = {};
    this.editAyuntamiento = -1;
  }

  // Función para eliminar un Ayuntamiento
  eliminarAyuntamiento(index: number) {
    // Eliminar el Ayuntamiento de la lista
    this.ayuntamientos.splice(index, 1);
  }

  // Define un FormGroup para el formulario de Comunidad
  comunidadForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    acronimo: new FormControl('', Validators.required)
  });

  // Función para agregar una Comunidad
  agregarComunidad() {
    if (this.comunidadForm.valid) {
      this.comunidades.push({ ...this.comunidadForm.value });
      this.comunidadForm.reset();
    } else {
      // Formulario inválido, muestra un mensaje de error o toma alguna acción apropiada.
    }
  }

  // Función para editar una Comunidad existente en la lista
  editarComunidad(index: number) {
    // Implementa la lógica para editar una Comunidad aquí
  }

  // Función para eliminar una Comunidad de la lista
  eliminarComunidad(index: number) {
    this.comunidades.splice(index, 1);
  }

  resetForm() {
    this.distritoLocalForm.reset({
      nombre: '',
      acronimo:'',
      activo:true,
      extPet:'',
      estado:'null',
    });

    this.nombreTocado = false;
    this.acronimoTocado=false;
    this.activoTocado=false;
    this.extPetTocado=false;
    this.estadoTocado=false;

  }

  marcarNombreTocado() {
    this.nombreTocado = true;
  }

  marcarAcronimoTocado() {
    this.acronimoTocado = true;
  }

  marcarActivoTocado() {
    this.activoTocado = true;
  }
  marcarExtPetTocado() {
    this.extPetTocado = true;
  }
  marcarEstadoTocado() {
    this.estadoTocado = true;
  }

}

