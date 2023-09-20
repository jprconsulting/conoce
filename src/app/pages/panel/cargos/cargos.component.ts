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
  usuariosFilter: Cargos[] = [];
  userForm!: FormGroup;
  isModalAdd = false;
  filtro: string = '';
  itemsPerPage: number = 3;
  currentPage: number = 1;
  mostrarCampoPartidos  = false;
  itemsPerPageOptions: number[] = [3, 6, 9];

  constructor(
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
      cargoId: [null],
      nombreCargo: ['', Validators.required],
    });
  }

  getListadoUsuarios() {
    this.isLoadingUsers = LoadingStates.trueLoading;
    this.cargoService.getCargos().subscribe({
      next: (usuariosFromApi) => {
        this.cargos = usuariosFromApi;
        this.usuariosFilter = this.cargos;
        this.isLoadingUsers = LoadingStates.falseLoading;
      }, error: () => {
        this.isLoadingUsers = LoadingStates.errorLoading;
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
        this.mensajeService.mensajeExito("Cargo agregado con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar cargo");
        console.error(error);
      }
    });
  }

  actualizarUsuario() {
    this.cargoService.putCargo(this.cargo).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Usuario actualizado con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar usuario");
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
      `¿Estás seguro de eliminar el usuario: ${nombreUsuario}?`,
      () => {
        this.cargoService.deleteCrago(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Usuario borrado correctamente');
            // this.ConfigPaginator.currentPage = 1; // Si necesitas realizar alguna acción adicional después de la eliminación
          },
          error: (error) => {
            const errorMessage = typeof error === 'string' ? error : 'Error al borrar usuario';
            this.mensajeService.mensajeError(errorMessage);
            console.error('Error al borrar usuario:', error); // Para depuración, puedes mostrar el error en la consola
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
      nombreCargo: user.nombreCargo,
    });
    console.log(this.userForm.value);
  }

  filtrarResultados() {
    return this.cargos.filter(cargo =>
      cargo.nombreCargo.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

}
