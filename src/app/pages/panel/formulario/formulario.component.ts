import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { FormularioService } from 'src/app/core/services/formulario.service';
import { LoadingStates } from 'src/app/global/globals';
import { ConfigGoogleForm } from 'src/app/models/googleForm';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {
  // Usuarios
  formulario: ConfigGoogleForm[] = [];
  configForm!: ConfigGoogleForm;
  jsonConfig: any;
  isLoadingUsers = LoadingStates.neutro;
  FormularioFilter: ConfigGoogleForm[] = [];
  configGoogleFormFormGroup: FormGroup;

  constructor(
    private formularioService: FormularioService,
    private fb: FormBuilder,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) {
    this.configGoogleFormFormGroup = this.formBuilder.group({
      formularioIdFront: ['', Validators.required],
      formNameFront: ['', Validators.required],
      googleFormIdFront: ['', Validators.required],
      googleEditFormIdFront: ['', Validators.required],
      spreadsheetIdFront: ['', Validators.required],
      sheetNameFront: ['', Validators.required],
      projectIdFront: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.obtenerFormularios();
  }

  obtenerFormularios() {
    this.formularioService.getFormularios().subscribe(
      (formularios) => {
        this.formulario = formularios;
        console.log('Respuesta de la API:', formularios);
      },
      (error) => {
        console.error('Error al obtener los formularios', error);
      }
    );

  }


  resetForm() {
    this.configGoogleFormFormGroup.reset({
      FormularioIdFront: '',
      FormNameFront: '',
      GoogleFormIdFront: '',
      GoogleEditFormIdFront: '',
      SpreadsheetIdFront: '',
      SheetNameFront: '',
      ProjectIdFront: '',
    });
    this.configGoogleFormFormGroup.get('archvioJson')?.setValue(null);


  }

  onFileChange(event: any) {
    event.preventDefault();
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileReader = new FileReader();

      fileReader.onload = (e: any) => {
        // Aquí tienes el contenido del archivo JSON como una cadena
        const jsonContent = e.target.result;

        try {
          // Intenta analizar el contenido JSON
          this.jsonConfig = JSON.parse(jsonContent);
        } catch (error) {
          console.error('Error al analizar el archivo JSON:', error);
        }
      };

      fileReader.readAsText(selectedFile);
    }

  }

  guardarUsuario() {
    console.log('El formulario es válido, enviando datos...');
    this.configForm = this.configGoogleFormFormGroup.value as ConfigGoogleForm;
    this.configForm.type = this.jsonConfig.type;
    this.configForm.project_id = this.jsonConfig.project_id;
    this.configForm.private_key_id = this.jsonConfig.private_key_id;
    this.configForm.private_key = this.jsonConfig.private_key;
    this.configForm.client_email = this.jsonConfig.client_email;
    this.configForm.client_id = this.jsonConfig.client_id;
    this.configForm.auth_uri = this.jsonConfig.auth_uri;
    this.configForm.token_uri = this.jsonConfig.token_uri;
    this.configForm.auth_provider_x509_cert_url = this.jsonConfig.auth_provider_x509_cert_url;
    this.configForm.client_x509_cert_url = this.jsonConfig.client_x509_cert_url;
    this.configForm.universe_domain = this.jsonConfig.universe_domain;
 
    this.formularioService.postFormulario(this.configForm).subscribe({
      next: () => {
        console.log('Formulario guardado con éxito');
        // Limpia el formulario después de guardar
        //this.resetForm();
        // Muestra un mensaje de éxito utilizando el servicio de mensajes
        this.mensajeService.mensajeExito('Formulario guardado con éxito');
      },
      error: (error) => {
        console.error('Error al guardar el formulario', error);
        // Muestra un mensaje de error utilizando el servicio de mensajes
        //this.mensajeService.mensajeError('Error al guardar el formulario');
      }
    });

  }

}

