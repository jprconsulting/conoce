import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { CargoService } from 'src/app/core/services/cargo.service';
import { LoadingStates } from 'src/app/global/globals';
import { Cargos } from 'src/app/models/cargos';

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
  isLoadingUsers = LoadingStates.neutro;
  cargosFilter: Cargos[] = [];
  userForm!: FormGroup;
  isModalAdd = false;

  constructor(
    private cargoService:   CargoService,
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
      cargoId: [],
      nombreCargo: ['', Validators.required],
    });
  }

  getListadoUsuarios() {
    this.isLoadingUsers = LoadingStates.trueLoading;
    this.cargoService.getCargos().subscribe({
      next: (usuariosFromApi) => {
        this.cargos = usuariosFromApi;
        this.cargosFilter = this.cargos;
        this.isLoadingUsers = LoadingStates.falseLoading;
        console.log('Lista de cargos:', this.cargos); // Agregado para depurar
      },
      error: (error) => {
        this.isLoadingUsers = LoadingStates.errorLoading;
        console.error('Error al obtener cargos:', error); // Agregado para depurar
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

    // Crear un nuevo objeto de datos sin cargoId si está vacío o nulo
    let cargoData: any;
    if (cargoIdValue !== null && cargoIdValue !== undefined) {
      cargoData = { ...this.cargo, cargoId: cargoIdValue };
    } else {
      cargoData = { ...this.cargo };
      delete cargoData.cargoId;
    }

    this.cargoService.postCargo(cargoData).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Usuario agregado con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar usuario");
        console.error(error);
      }
    });
  }


  actualizarUsuario() {
    this.cargoService.putCargo(this.cargo).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Cargo actualizado con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar cargo");
        console.error('Error al actualizar usuario:', error); // Agregado para depurar
      }
    });
  }

  submitUsuario() {
    this.cargo = this.userForm.value as Cargos;
    this.isModalAdd ? this.agregarUsuario() : this.actualizarUsuario();
  }

  borrarUsuario(id: number, nombreCargo: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el Cargo: ${nombreCargo}?`,
      () => {
        this.cargoService.deleteCrago(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Cargo borrado correctamente');
            //this.ConfigPaginator.currentPage = 1;
          },
          error: (error) => {
            this.mensajeService.mensajeError(error);
            console.error('Error al borrar usuario:', error); // Agregado para depurar
          }
        });
      }
    );
  }

  handleChangeAdd() {
    this.userForm.reset();
    this.isModalAdd = true;
  }

  setDataModalUpdate(user: Cargos) {
    this.isModalAdd = false;
    this.userForm.patchValue({
      cargoId: user.cargoId,
      nombrecargo: user.nombreCargo,
    });
    console.log('Datos del formulario modal:', this.userForm.value); // Agregado para depurar
  }
}
