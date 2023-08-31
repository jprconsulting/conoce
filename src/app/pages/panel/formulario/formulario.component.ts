import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { FormularioService } from 'src/app/core/services/formulario.service';
import { LoadingStates } from 'src/app/global/globals';
import { Formulario } from 'src/app/models/formulario';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {
  // Usuarios
  formulario: Formulario[] = [];
  isLoadingUsers = LoadingStates.neutro;
  FormularioFilter: Formulario[] = [];
  formularioForm: FormGroup;

  constructor(
    private FormularioService: FormularioService,
    private fb: FormBuilder,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) {
    this.formularioForm = this.formBuilder.group({
      FormNameFront: ['', Validators.required],
      GoogleFormIdFront: ['', Validators.required],
      GoogleEditFormIdFront: ['', Validators.required],
      SheetNameFront: ['', Validators.required],
      SpreadsheetIdFront: ['', Validators.required],
      ProjectIdFront: ['', Validators.required],
      archvioJson: [null, Validators.required] // Puedes iniciar con null si es un campo opcional
    });
  }

  ngOnInit(): void {
    this.obtenerFormularios();
  }

  obtenerFormularios() {
    this.FormularioService.getFormularios().subscribe(
      (formularios) => {
        this.formulario = formularios;
      },
      (error) => {
        console.error('Error al obtener los formularios', error);
        // Manejar el error si es necesario
      }
    );
  }

  resetForm() {
    this.formularioForm.reset({
      FormularioIdFront: '',
      FormNameFront: '',
      GoogleFormIdFront: '',
      GoogleEditFormIdFront: '',
      SpreadsheetIdFront: '',
      SheetNameFront: '',
      ProjectIdFront: '',
    });
    this.formularioForm.get('archvioJson')?.setValue(null);

    // Elimina y recrea el campo de carga de archivos
    const archvioJsonInput = document.getElementById('archvioJsonInput') as HTMLInputElement;
    if (archvioJsonInput) {
      const parent = archvioJsonInput.parentElement;
      if (parent) {
        parent.removeChild(archvioJsonInput);
        const newInput = document.createElement('input');
        newInput.type = 'file';
        newInput.accept = '.json';
        newInput.className = 'form-control';
        newInput.id = 'credencialesJSONInput';
        newInput.addEventListener('change', (event) => this.onFileChange(event));
        parent.appendChild(newInput);
      }
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.formularioForm.get('archvioJson')?.setValue(file);
}

guardarUsuario() {
  console.log('El formulario es válido, enviando datos...');
  if (this.formularioForm.valid) {
    this.FormularioService.postFormulario(this.formularioForm.value).subscribe(
      (response) => {
        console.log('Formulario guardado con éxito', response);
        // Limpia el formulario después de guardar
        this.resetForm();
        // Muestra un mensaje de éxito utilizando el servicio de mensajes
        this.mensajeService.mensajeExito('Formulario guardado con éxito');
      },
      (error) => {
        console.error('Error al guardar el formulario', error);
        // Muestra un mensaje de error utilizando el servicio de mensajes
        this.mensajeService.mensajeError('Error al guardar el formulario');
      }
    );
  } else {
    console.log('Formulario no válido. Verifica los campos.');
  }
}

}

