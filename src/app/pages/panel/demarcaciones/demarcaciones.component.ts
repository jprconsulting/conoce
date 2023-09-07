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

    ayuntamientoForm: FormGroup;
    nombreATocado= false;
    acronimoATocado=false;
    activoATocado=false;
    extPetATocado=false;
    estadoATocado=false;

    comunidadForm: FormGroup;
    nombreCTocado= false;
    acronimoCTocado=false;
    activoCTocado=false;
    extPetCTocado=false;
  
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

      this.ayuntamientoForm = this.formBuilder.group({
        nombreA: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        acronimoA: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        activoA: [true],
        extPetA: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        estadoA: [''],
      });

      this.comunidadForm = this.formBuilder.group({
        nombreC: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        acronimoC: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        activoC: [true],
        extPetC: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
        estadoC: [''],
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

    this.ayuntamientoForm.reset({
      nombreA: '',
      acronimoA:'',
      activoA:true,
      extPetA:'',
      estado:'null',
    });

    this.comunidadForm.reset({
      nombreC: '',
      acronimoC:'',
      activoC:true,
      extPetC:'',
      estadoC:'null',
    });

    this.nombreTocado = false;
    this.acronimoTocado=false;
    this.activoTocado=false;
    this.extPetTocado=false;
    this.estadoTocado=false;

    this.nombreATocado = false;
    this.acronimoATocado=false;
    this.activoATocado=false;
    this.extPetATocado=false;
    this.estadoATocado=false;

    this.nombreCTocado = false;
    this.acronimoCTocado=false;
    this.activoCTocado=false;
    this.extPetCTocado=false;
    this.estadoTocado=false;

  }

  marcarNombreTocado() {
    this.nombreTocado = true;
    return this.distritoLocalForm.get('nombre')?.invalid && this.distritoLocalForm.get('nombre')?.touched;
  }

  marcarAcronimoTocado() {
    this.acronimoTocado = true;
    return this.distritoLocalForm.get('acronimo')?.invalid && this.distritoLocalForm.get('acronimo')?.touched;
  }

  marcarActivoTocado() {
    this.activoTocado = true;
  }
  marcarExtPetTocado() {
    this.extPetTocado = true;
    return this.distritoLocalForm.get('extPet')?.invalid && this.distritoLocalForm.get('extPet')?.touched;
  }
  marcarEstadoTocado() {
    this.estadoTocado = true;
  }


  marcarNombreATocado() {
    this.nombreATocado = true;
    return this.ayuntamientoForm.get('nombreA')?.invalid && this.ayuntamientoForm.get('nombreA')?.touched;
  }

  marcarAcronimoATocado() {
    this.acronimoTocado = true;
    return this.ayuntamientoForm.get('acronimoA')?.invalid && this.ayuntamientoForm.get('acronimoA')?.touched;
  }

  marcarActivoATocado() {
    this.activoTocado = true;
  }
  marcarExtPetATocado() {
    this.extPetTocado = true;
    return this.ayuntamientoForm.get('extPetA')?.invalid && this.ayuntamientoForm.get('extPetA')?.touched;
  }
  marcarEstadoATocado() {
    this.estadoTocado = true;
  }

  marcarNombreCTocado() {
    this.nombreATocado = true;
    return this.comunidadForm.get('nombreC')?.invalid && this.comunidadForm.get('nombreC')?.touched;
  }

  marcarAcronimoCTocado() {
    this.acronimoTocado = true;
    return this.comunidadForm.get('acronimoC')?.invalid && this.comunidadForm.get('acronimoC')?.touched;
  }

  marcarActivoCTocado() {
    this.activoTocado = true;
  }
  marcarExtPetCTocado() {
    this.extPetTocado = true;
    return this.comunidadForm.get('extPetC')?.invalid && this.comunidadForm.get('extPetC')?.touched;
  }
  marcarEstadoCTocado() {
    this.estadoTocado = true;
  }

}

