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
    private fbGenerador: FormBuilder,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) {
    //this.crearFormularioGuardar();
    //this.subscribeRolID();

    this.formularioForm = this.formBuilder.group({
      formularioID: ['', Validators.required],
      formName: ['', Validators.required],
      googleFormID: ['', Validators.required],
      googleEditFormID: ['', Validators.required],
      spreadsheetID: ['', Validators.required],
      sheetName: ['', Validators.required],
      projectID: ['', Validators.required],
      archvioJson: [null, Validators.required],
    });

  }

  ngOnInit(): void {
    this.FormularioService.refreshLisUsers.subscribe(() => this.getFormulario());
    this.getFormulario();
  }

  getFormulario() {
     this.isLoadingUsers = LoadingStates.trueLoading;
     this.FormularioService.getFormulario().subscribe({
       next: (usuariosFromApi) => {
         setTimeout(() => {
           this.formulario = usuariosFromApi;
           console.log(this.formulario);
           this.FormularioFilter = this.formulario;
           this.isLoadingUsers = LoadingStates.falseLoading;

         }, 3000);
       }, error: () => {
         console.log('error');
         this.isLoadingUsers = LoadingStates.errorLoading;
         console.log(this.isLoadingUsers);
       }
     });
   }

  resetForm() {
    this.formularioForm.reset({
      formularioID: '',
      formName: '',
      googleFormID: '',
      googleEditFormID: '',
      spreadsheetID: '',
      sheetName: '',
      projectID: '',
    });
    this.formularioForm.get('CredencialesJSON')?.setValue(null);

    // Elimina y recrea el campo de carga de archivos
    const credencialesJSONInput = document.getElementById('credencialesJSONInput') as HTMLInputElement;
    if (credencialesJSONInput) {
      const parent = credencialesJSONInput.parentElement;
      if (parent) {
        parent.removeChild(credencialesJSONInput);
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
    this.formularioForm.get('CredencialesJSON')?.setValue(file);
  }

  guardarFormulario() {
    if (this.formularioForm.valid) {
      this.spinnerService.show(); // Muestra un spinner de carga
      this.FormularioService.postFormulario(this.formularioForm.value).subscribe(
        (response) => {
          console.log('Formulario guardado con éxito', response);
          // Limpia el formulario después de guardar
          this.resetForm();
          this.spinnerService.hide(); // Oculta el spinner de carga
        },
        (error) => {
          console.error('Error al guardar el formulario', error);
          this.spinnerService.hide(); // Oculta el spinner de carga en caso de error
        }
      );
    }
  }


}

