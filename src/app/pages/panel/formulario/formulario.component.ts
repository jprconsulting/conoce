import { Component, OnInit } from '@angular/core';
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
export class FormularioComponent implements OnInit {
  // Usuarios
  formulario: ConfigGoogleForm[] = [];
  configForm!: ConfigGoogleForm;
  jsonConfig: any;
  isLoadingUsers = LoadingStates.neutro;
  FormularioFilter: ConfigGoogleForm[] = [];
  configGoogleFormFormGroup: FormGroup;
  filtro: string = '';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 15];
  formularioSeleccionado: ConfigGoogleForm | null = null;

  formularioIdFrontTocado=false;
      formNameFrontTocado=false;
      googleFormIdFrontTocado=false;
      googleEditFormIdFrontTocado=false;
      spreadsheetIdFrontTocado=false;
      sheetNameFrontTocado=false;
      projectIdFrontTocado =false;

  constructor(
    private formularioService: FormularioService,
    private fb: FormBuilder,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,

  ) {
    this.configGoogleFormFormGroup = this.formBuilder.group({
      formularioId: [null],
      formName: ['', Validators.required],
      googleFormId: ['', Validators.required],
      spreadsheetId: ['', Validators.required],
      sheetName: ['', Validators.required], 
    });
  }

  ngOnInit(): void {
    this.obtenerFormularios();
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
      formularioIdFront: '',
      formNameFront: '',
      googleFormIdFront: '',
      googleEditFormIdFront: '',
      spreadsheetIdFront: '',
      sheetNameFront: '',
      projectIdFront: '',
    });
    this.configGoogleFormFormGroup.get('archvioJson')?.setValue(null);
    this.formularioIdFrontTocado=false;
    this.formNameFrontTocado=false;
    this.googleFormIdFrontTocado=false;
    this.googleEditFormIdFrontTocado=false;
    this.spreadsheetIdFrontTocado=false;
    this.sheetNameFrontTocado=false;
    this.projectIdFrontTocado =false;


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
    this.configForm.projectId = this.jsonConfig.project_id;
    this.configForm.privateKeyId = this.jsonConfig.private_key_id;
    this.configForm.privateKey = this.jsonConfig.private_key;
    this.configForm.clientEmail = this.jsonConfig.client_email;
    this.configForm.clientId = this.jsonConfig.client_id;
    this.configForm.authUri = this.jsonConfig.auth_uri;
    this.configForm.tokenUri = this.jsonConfig.token_uri;
    this.configForm.authProviderX509CertUrl = this.jsonConfig.auth_provider_x509_cert_url;
    this.configForm.clientX509CertUrl = this.jsonConfig.client_x509_cert_url;
    this.configForm.universeDomain = this.jsonConfig.universe_domain;

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



  marcarFormularioIdTocado() {
    this.formularioIdFrontTocado = true;
    return this.configGoogleFormFormGroup.get('formularioIdFront')?.invalid && this.configGoogleFormFormGroup.get('formularioIdFront')?.touched;
  }

  marcarFormNameFrontTocado() {
    this.formNameFrontTocado = true;
    return this.configGoogleFormFormGroup.get('formNameFront')?.invalid && this.configGoogleFormFormGroup.get('formNameFront')?.touched;
  }

  marcarGoogleFormIdFrontTocado() {
    this.googleFormIdFrontTocado = true;
    return this.configGoogleFormFormGroup.get('googleFormIdFront')?.invalid && this.configGoogleFormFormGroup.get('googleFormIdFront')?.touched;
  }

  marcarGoogleEditFormIdFrontTocado() {
    this.googleEditFormIdFrontTocado = true;
    return this.configGoogleFormFormGroup.get('googleEditFormIdFront')?.invalid && this.configGoogleFormFormGroup.get('googleEditFormIdFront')?.touched;
  }

  marcarSpreadsheetIdFrontTocado() {
    this.spreadsheetIdFrontTocado = true;
    return this.configGoogleFormFormGroup.get('spreadsheetIdFront')?.invalid && this.configGoogleFormFormGroup.get('spreadsheetIdFront')?.touched;
  }

  marcarSheetNameFrontTocado() {
    this.sheetNameFrontTocado = true;
    return this.configGoogleFormFormGroup.get('sheetNameFront')?.invalid && this.configGoogleFormFormGroup.get('sheetNameFront')?.touched;
  }

  marcarProjectIdFrontTocado() {
    this.projectIdFrontTocado = true;
    return this.configGoogleFormFormGroup.get('projectIdFront')?.invalid && this.configGoogleFormFormGroup.get('projectIdFront')?.touched;
  }

  filtrarResultados() {
    return this.formulario.filter(formulario =>
      formulario.formName.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  abrirModal(formulario: ConfigGoogleForm) {
    this.formularioSeleccionado = formulario;
    console.log('Formulario seleccionado:', this.formularioSeleccionado);
  }
}

