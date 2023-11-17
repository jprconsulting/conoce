import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('closebutton') closebutton!: ElementRef;

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
  isModalAdd = false;
  userForm: any;

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
    this.isLoadingUsers = LoadingStates.trueLoading;
    this.formularioService.getFormularios().subscribe(
      (formularios) => {
        this.formulario = formularios;
        console.log('Respuesta de la API:', formularios);
        this.isLoadingUsers = LoadingStates.falseLoading;
      },
      (error) => {
        console.error('Error al obtener los formularios', error);
        this.isLoadingUsers = LoadingStates.errorLoading;
      }
    );
  }

  resetForm() {
    this.closebutton.nativeElement.click();
    this.configGoogleFormFormGroup.reset();
  }

  handleChangeAdd() {
    this.configGoogleFormFormGroup.reset();
    this.isModalAdd = true;
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
        this.resetForm();
        // Muestra un mensaje de éxito utilizando el servicio de mensajes
        this.mensajeService.mensajeExito('Formulario guardado con éxito');
      },
      error: (error) => {
        console.error('Error al guardar el formulario', error);
        // Muestra un mensaje de error utilizando el servicio de mensajes
        this.mensajeService.mensajeError('Error al guardar el formulario');
      }
    });
  }
  agregarformulario() {
    if (this.userForm.valid) {
      const nuevoformulario = this.userForm.value;
  
      // Verificar si el nombre de formulario ya existe
      const nombreformularioExistente = this.formulario.some(u => u.formularioId === nuevoformulario.nombre);

      if (nombreformularioExistente) {
        console.error('Ya existe un formulario con este nombre de formulario.');
        this.mensajeService.mensajeError('Ya existe un formulario con este nombre de foemulario.');
      } {
        console.error('Ya existe un formulario con este correo electrónico.');
        this.mensajeService.mensajeError('Ya existe un formulario con este nombre.');
      }  {
        this.formularioService.postFormulario(nuevoformulario).subscribe({
          next: () => {
            console.log('formulario agregado con éxito:', nuevoformulario);
            this.mensajeService.mensajeExito('formulario agregado con éxito');
            this.resetForm();
            // También puedes agregar el nuevo formulario a la lista local
            this.formulario.push(nuevoformulario);
          },
          error: (error) => {
            console.error('Error al agregar formulario:', error);
            this.mensajeService.mensajeError('Error al agregar formulario');
          }
        });
      }
    } else {
      console.error('El formulario de usuario es inválido. No se puede enviar.');
      this.mensajeService.mensajeError('Formulario de usuario inválido. Revise los campos.');
    }
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

  borrarFormulario(formularioId: number, formName: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el formulario: ${formName}?`,
      () => {
        this.formularioService.deleteFormulario(formularioId).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Formulario borrado correctamente');
            //this.ConfigPaginator.currentPage = 1;
          },
          error: (error) => this.mensajeService.mensajeError(error)
        });
      }
    );
  }

  actualizarFormulario() {
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

    this.formularioService.putFormulario(this.configForm).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Formulario actualizado con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar formulario");
        console.error(error);
      }
    }
    );
  }

  setDataModalUpdate(user: ConfigGoogleForm) {
    this.isModalAdd = false;
    this.configGoogleFormFormGroup.patchValue({
      formularioId: user.formularioId,
      formName: user.formName,
      googleFormId: user.googleFormId,
      spreadsheetId: user.spreadsheetId,
      sheetName: user.sheetName,
    });
    console.log(this.configGoogleFormFormGroup.value);
  }

  submitUsuario() {
    this.configForm = this.configGoogleFormFormGroup.value as ConfigGoogleForm;
    this.isModalAdd ? this.guardarUsuario() : this.actualizarFormulario();
  }
}

