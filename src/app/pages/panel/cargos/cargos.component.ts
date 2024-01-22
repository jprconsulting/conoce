import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { CargoService } from 'src/app/core/services/cargo.service';
import { LoadingStates } from 'src/app/global/globals';
import { Cargos } from 'src/app/models/cargos';
import { PaginationInstance } from 'ngx-pagination';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
})
export class CargosComponent implements OnInit {

  @ViewChild('closebutton') closebutton!: ElementRef;

  // Usuarios
  cargo!: Cargos;
  cargos: Cargos[] = [];
  isLoading = LoadingStates.neutro;
  usuariosFilter: Cargos[] = [];
  userForm!: FormGroup;
  isModalAdd = false;
  filtro: string = '';
  itemsPerPage: number = 3;
  currentPage: number = 1;
  mostrarCampoPartidos  = false;
  itemsPerPageOptions: number[] = [3, 6, 9];

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private cargoService: CargoService,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) {
    this.crearFormularioUsuario();
  }

  ngOnInit(): void {
    this.cargoService.refreshLisUsers.subscribe(() => this.getListadoUsuarios());
    this.getListadoUsuarios();
  }

  crearFormularioUsuario() {
    this.userForm = this.formBuilder.group({
      id: [null],
      nombreCargo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+$/),
          Validators.pattern(/^[^\s]+$/),
        ],
      ],
    });
  }

  getListadoUsuarios() {
    this.isLoading = LoadingStates.trueLoading;
    this.cargoService.getCargos().subscribe({
      next: (usuariosFromApi) => {
        this.cargos = usuariosFromApi;
        this.usuariosFilter = this.cargos;
        this.isLoading = LoadingStates.falseLoading;
      }, error: () => {
        this.isLoading = LoadingStates.errorLoading;
      }
    });
  }

  resetForm() {
    this.closebutton.nativeElement.click();
    this.userForm.reset();
  }


  agregarUsuario() {
    const cargoIdControl = this.userForm.get('cargoId');
    const cargoIdValue = cargoIdControl ? cargoIdControl.value : undefined;

    let cargoData: any;
    if (cargoIdValue !== null && cargoIdValue !== undefined) {
      cargoData = { ...this.cargo, cargoId: cargoIdValue };
    } else {
      cargoData = { ...this.cargo };
      delete cargoData.cargoId;
    }

    const nuevoCargo = this.userForm.value;
    const cargoExistente = this.cargos.some(dl => dl.nombreCargo === nuevoCargo.nombre);

    if (cargoExistente) {
      console.error('Ya existe un cargo con este nombre.');
      this.mensajeService.mensajeError('Ya existe un cargo con este nombre.');
    }
    else {
    // this.cargoService.postCargo(cargoData).subscribe({
    //   next: () => {
    //     this.mensajeService.mensajeExito("Cargo agregado con éxito");
    //     this.resetForm();
    //   },
    //   error: (error) => {
    //     this.mensajeService.mensajeError("Error al agregar cargo");
    //     console.error(error);
    //   }
    // });
  }}

  actualizarUsuario() {
    this.cargoService.put(this.idUpdate, this.cargo).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Cargo actualizado con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar cargo");
        console.error(error);
      }
    }
    );
  }

  submitUsuario() {
    this.cargo = this.userForm.value as Cargos;
    this.isModalAdd ? this.agregarUsuario() : this.actualizarUsuario();
  }

  borrarUsuario(id: number, nombreUsuario: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el cargo: ${nombreUsuario}?`,
      () => {
        this.cargoService.delete(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Cargo borrado correctamente');
            // this.ConfigPaginator.currentPage = 1; // Si necesitas realizar alguna acción adicional después de la eliminación
          },
          error: (error) => {
            const errorMessage = typeof error === 'string' ? error : 'Error al borrar cargo';
            this.mensajeService.mensajeError(errorMessage);
            console.error('Error al borrar cargo:', error); // Para depuración, puedes mostrar el error en la consola
          }
        });
      }
    );
  }

  onPageChange(number: number) {
    this.configPaginator.currentPage = number;
  }

  handleChangeAdd() {
    this.userForm.reset();
    this.isModalAdd = true;
  }


  idUpdate!: number;
  setDataModalUpdate(dto: Cargos) {
    this.isModalAdd = false;
    this.idUpdate = dto.id;
    this.userForm.patchValue({
      id: dto.id,
      nombreCargo: dto.nombreCargo,
    });
    console.log(this.userForm.value);
  }

  handleChangeSearch(event: any) {
    const inputValue = event.target.value;
    const valueSearch = inputValue.toLowerCase();
    this.usuariosFilter = this.cargos.filter(cargos =>
      cargos.nombreCargo.toLowerCase().includes(valueSearch)
    );
    this.configPaginator.currentPage = 1;
  }

  exportarDatosAExcel() {
    if (this.cargos.length === 0) {
      console.warn('La lista de usuarios está vacía. No se puede exportar.');
      return;
    }

    const datosParaExportar = this.cargos.map(cargo => {
      return {
        'Id': cargo.id,
        'Nombre': cargo.nombreCargo,
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExportar);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.guardarArchivoExcel(excelBuffer, 'cargos.xlsx');
  }

  guardarArchivoExcel(buffer: any, nombreArchivo: string) {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
