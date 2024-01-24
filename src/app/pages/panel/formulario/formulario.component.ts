import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { FormularioService } from 'src/app/core/services/formulario.service';
import { LoadingStates } from 'src/app/global/globals';
import { ConfigGoogleForm, Formulario } from 'src/app/models/formulario';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {

  @ViewChild('closebutton') closebutton!: ElementRef;

  formulario!: Formulario;
  formularioForm!: FormGroup;
  id!: number;
  formularios: Formulario[] = [];
  formulariosFilter: Formulario[] = [];
  isLoading = LoadingStates.neutro;
  jsonConfig: any;
  isModalAdd = true;

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private formularioService: FormularioService,
    private formBuilder: FormBuilder,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,

  ) {
    this.formularioService.refreshListFormularios.subscribe(() => this.getFormularios());
    this.getFormularios();
    this.creteForm();
  }

  getFormularios() {
    this.isLoading = LoadingStates.trueLoading;
    this.formularioService.getAll().subscribe(
      {
        next: (dataFromAPI) => {
          this.formularios = dataFromAPI;
          this.formulariosFilter = this.formularios;
          this.isLoading = LoadingStates.falseLoading;
        },
        error: () => {
          this.isLoading = LoadingStates.errorLoading
        }
      }
    );
  }

  

  submit() {
    this.isModalAdd ? this.agregar() : this.editar();
  }
  editar() {
    this.formulario = this.formularioForm.value as Formulario;
    this.formulario.configGoogleForm = {
      type: this.jsonConfig.type,
      projectId: this.jsonConfig.project_id,
      privateKeyId: this.jsonConfig.private_key_id,
      privateKey: this.jsonConfig.private_key,
      clientEmail: this.jsonConfig.client_email,
      clientId: this.jsonConfig.client_id,
      authUri: this.jsonConfig.auth_uri,
      tokenUri: this.jsonConfig.token_uri,
      authProviderX509CertUrl: this.jsonConfig.auth_provider_x509_cert_url,
      clientX509CertUrl: this.jsonConfig.client_x509_cert_url,
      universeDomain: this.jsonConfig.universe_domain
    } as ConfigGoogleForm;

    this.spinnerService.show();
    this.formularioService.put(this.id,this.formulario).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.mensajeService.mensajeExito('Formulario editado correctamente');
        this.resetForm();
        this.configPaginator.currentPage = 1;
      },
      error: (error) => {
        this.spinnerService.hide();
        this.mensajeService.mensajeError(error);
      },
    });
  }
  creteForm() {
    this.formularioForm = this.formBuilder.group({
      id: [null],
      nombreFormulario: ['', Validators.required],
      googleFormId: ['', Validators.required],
      spreadsheetId: ['', Validators.required],
      sheetName: ['', Validators.required],
      endPointEditLinks: ['', Validators.required]
    });
  }

  agregar() {
    this.formulario = this.formularioForm.value as Formulario;
    this.formulario.configGoogleForm = {
      type: this.jsonConfig.type,
      projectId: this.jsonConfig.project_id,
      privateKeyId: this.jsonConfig.private_key_id,
      privateKey: this.jsonConfig.private_key,
      clientEmail: this.jsonConfig.client_email,
      clientId: this.jsonConfig.client_id,
      authUri: this.jsonConfig.auth_uri,
      tokenUri: this.jsonConfig.token_uri,
      authProviderX509CertUrl: this.jsonConfig.auth_provider_x509_cert_url,
      clientX509CertUrl: this.jsonConfig.client_x509_cert_url,
      universeDomain: this.jsonConfig.universe_domain
    } as ConfigGoogleForm;

    console.log(this.formulario);

    this.spinnerService.show();
    this.formularioService.post(this.formulario).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.mensajeService.mensajeExito('Formulario guardado correctamente');
        this.resetForm();
        this.configPaginator.currentPage = 1;
      },
      error: (error) => {
        this.spinnerService.hide();
        this.mensajeService.mensajeError(error);
      },
    });

  }

  handleChangeSearch(event: any) {
    const inputValue = event.target.value;

    this.configPaginator.currentPage = 1;
  }

  exportarDatosAExcel() {

  }

  resetForm() {
    this.closebutton.nativeElement.click();
    this.formularioForm.reset();
  }

  handleChangeAdd() {
    this.formularioForm.reset();
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




  setDataModalUpdate(dto: Formulario) {
    this.id = dto.id;
     this.isModalAdd = false;
     this.formularioForm.patchValue({
       id: dto.id,
       nombreFormulario: dto.nombreFormulario,
       googleFormId: dto.googleFormId,
       spreadsheetId: dto.spreadsheetId,
       sheetName: dto.sheetName,
       endPointEditLinks: dto.endPointEditLinks,
       configGoogleForm: dto.configGoogleForm
     });
     console.log(this.formularioForm.value);
  }

  deleteItem(id: number,) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el formulario?`,
      () => {
        this.formularioService.delete(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Formulario borrado correctamente');
            this.configPaginator.currentPage = 1;
            this.getFormularios();
          },
          error: (error) => this.mensajeService.mensajeError(error)
        });
      }
    );
  }

  onPageChange(number: number) {
    this.configPaginator.currentPage = number;
  }
}

