import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormularioService } from 'src/app/core/services/formulario.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { LoadingStates } from 'src/app/global/globals';
import { PaginationInstance } from 'ngx-pagination';
import { CandidatoService } from 'src/app/core/services/candidato.service';
import { Formulario } from 'src/app/models/formulario';
import { Candidato } from 'src/app/models/candidato';
import { AsignacionFormulario } from 'src/app/models/asignacion-formulario';
import { AsignacionFormularioService } from 'src/app/core/services/asignacion-formulario.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent {

  @ViewChild('closebutton') closebutton!: ElementRef;
  @ViewChild('searchItem') searchItem!: ElementRef;

  asignacion!: AsignacionFormulario;
  isLoading = LoadingStates.neutro;
  asignacionForm!: FormGroup;
  asignaciones: AsignacionFormulario[] = [];
  asignacionesFilter: AsignacionFormulario[] = [];
  formularios: Formulario[] = [];
  candidatos: Candidato[] = [];
  id!: number;

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private asignacionFormularioService: AsignacionFormularioService,
    private candidatoService: CandidatoService,
    private formularioService: FormularioService,
    private formBuilder: FormBuilder,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,

  ) {
    this.asignacionFormularioService.refreshListAsignaciones.subscribe(() => this.getAsignaciones());
    this.getAsignaciones();
    this.creteForm();
    this.getFormulariosSinConfiguracion();
    this.getCandidatos();
  }

  getAsignaciones() {
    this.isLoading = LoadingStates.trueLoading;
    this.asignacionFormularioService.getAll().subscribe(
      {
        next: (dataFromAPI) => {
          this.asignaciones = dataFromAPI;
          this.asignacionesFilter = this.asignaciones;
          this.isLoading = LoadingStates.falseLoading;
        },
        error: () => {
          this.isLoading = LoadingStates.errorLoading
        }
      }
    );
  }

  getFormulariosSinConfiguracion() {
    this.formularioService.getFormulariosSinConfiguracion().subscribe({
      next: (dataFromAPI) => {
        this.formularios = dataFromAPI;
      },
      error: (error) => {
        console.error('Error al obtener los formularios', error);
      }
    });
  }

  getCandidatos() {
    this.candidatoService.getCandidatos().subscribe({
      next: (dataFromAPI) => {
        this.candidatos = dataFromAPI;
      },
      error: (error) => {
        console.error('Error al obtener los candidatos', error);
      }
    });
  }

  creteForm() {
    this.asignacionForm = this.formBuilder.group({
      formularioId: [null, Validators.required],
      candidatosIds: [[], Validators.required],
    });
  }

  handleChangeAdd() {
    if (this.asignacionForm) {
      this.asignacionForm.reset();
    }
  }
  setDataModalUpdate(dto: AsignacionFormulario) {
    this.id = dto.id;
    this.asignacionForm.patchValue({
      id: dto.id,
      formularioId: dto.formulario.id,
      candidatosIds: dto.candidato.nombreCompleto
    });
    console.log(this.asignacionForm.value);
  }

  deleteItem(id: number) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar?`,
      () => {
        this.asignacionFormularioService.delete(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Registro borrado exitosamente');
            this.configPaginator.currentPage = 1;
            this.getAsignaciones();
            //this.ConfigPaginator.currentPage = 1;
          },
          error: (error) => this.mensajeService.mensajeError(error)
        });
      }
    );
  }

  resetForm() {
    this.closebutton.nativeElement.click();
    this.asignacionForm.reset();
  }

  onPageChange(number: number) {
    this.configPaginator.currentPage = number;
  }

  submitUsuario() {
    const formularioId = this.asignacionForm.get('formularioId')?.value;
    this.asignacion = {
      formulario: { id: formularioId } as Formulario,
      candidatosIds: this.asignacionForm.get('candidatosIds')?.value as number[]
    } as AsignacionFormulario;

    this.spinnerService.show();
    this.asignacionFormularioService.post(this.asignacion).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.mensajeService.mensajeExito('Asignación guardada correctamente');
        this.resetForm();
        this.configPaginator.currentPage = 1;
      },
      error: (error) => {
        this.spinnerService.hide();
        this.mensajeService.mensajeError(error);
      },
    });

  }
  editar(){
    const formularioId = this.asignacionForm.get('formularioId')?.value;
    this.asignacion = {
      formulario: { id: formularioId } as Formulario,
      candidatosIds: this.asignacionForm.get('candidatosIds')?.value as number[]
    } as AsignacionFormulario;

    this.spinnerService.show();
    this.asignacionFormularioService.put(this.id,this.asignacion).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.mensajeService.mensajeExito('Asignación guardada correctamente');
        this.resetForm();
        this.configPaginator.currentPage = 1;
      },
      error: (error) => {
        this.spinnerService.hide();
        this.mensajeService.mensajeError(error);
      },
    });

  }
}
