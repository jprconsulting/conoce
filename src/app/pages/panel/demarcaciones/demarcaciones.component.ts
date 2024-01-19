import { Component, ViewChild, OnInit, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DistritoLocalService } from 'src/app/core/services/distritolocal.service';
import { AyuntamientoService } from 'src/app/core/services/ayuntamiento.service';
import { ComunidadService } from 'src/app/core/services/comunidad.service';
import { DistritoLocal } from 'src/app/models/distritoLocal';
import { Ayuntamiento } from 'src/app/models/ayuntamiento';
import { Comunidad } from 'src/app/models/comunidad';
import { Estados } from 'src/app/models/estados';
import { EstadoService } from 'src/app/core/services/estados.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { LoadingStates } from 'src/app/global/globals';
import { PaginationInstance } from 'ngx-pagination';
@Component({
  selector: 'app-demarcaciones',
  templateUrl: './demarcaciones.component.html',
  styleUrls: ['./demarcaciones.component.css']
})
export class DemarcacionesComponent implements OnInit {
  @ViewChild('miFormulario') miFormulario!: NgForm;
  @ViewChild('closebutton') closebutton!: ElementRef;
  distritoLocalForm: FormGroup;
  ayuntamientoForm: FormGroup;
  comunidadForm: FormGroup;
  distritoLocal!: DistritoLocal;
  ayuntamiento!: Ayuntamiento;
  comunidad!: Comunidad;
  distritosLocales: DistritoLocal[] = [];
  usuariosFilter: DistritoLocal[] = [];
  ayuntamientos: Ayuntamiento[] = [];
  comunidades: Comunidad[] = [];
  estados: Estados[] = [];
  isModalAdd = false;
  isLoadingUsers = LoadingStates.neutro;
  itemsPerPage: number = 5;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 15];
  searchTerm: string = '';
  filteredDistritosLocales: DistritoLocal[] = [];
  filteredAyuntamientos: Ayuntamiento[] = [];
  filteredComunidades: Comunidad[] = [];
  currentTab: string = 'distrito-local';
  currentTabClicked: string | null = null;
  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private distritoLocalService: DistritoLocalService,
    private ayuntamientoService: AyuntamientoService,
    private comunidadService: ComunidadService,
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private mensajeService: MensajeService,
  ) {
    this.distritoLocalForm = this.formBuilder.group({
      distritoLocalId: [null],
      nombre: ['', [Validators.required]],
      acronimo: ['', [Validators.required]],
      estatus: [true],
      peticion: ['', [Validators.required]],
      estado: [[null, Validators.required],],
    });
    this.ayuntamientoForm = this.formBuilder.group({
      ayuntamientoId: [null],
      nombre: ['', [Validators.required]],
      acronimo: ['', [Validators.required]],
      estatus: [true],
      peticion: ['', [Validators.required]],
      distritoLocal: [null, Validators.required],
    });
    this.comunidadForm = this.formBuilder.group({
      comunidadId: [null],
      nombre: ['', [Validators.required]],
      acronimo: ['', [Validators.required]],
      estatus: [true],
      peticion: ['', [Validators.required]],
      ayuntamiento: [null, Validators.required],
    });
  }
  ngOnInit(): void {
    console.log('OnInit - currentTab:', this.currentTab);
    this.getListadoDistritosLocales();
    this.cargarAyuntamientos();
    this.cargarComunidades();
    this.subscribeToRefreshEvents();
    this.obtenerEstados();
    console.log('OnInit - currentTab:', this.currentTab);
    if (!['distrito-local', 'ayuntamiento', 'comunidad'].includes(this.currentTab)) {
        console.warn(`Valor inesperado para currentTab: ${this.currentTab}. Estableciendo a 'distrito-local' por defecto.`);
        this.currentTab = 'distrito-local';
    }  }

  getListadoDistritosLocales() {
    this.isLoadingUsers = LoadingStates.trueLoading;
    this.distritoLocalService.getDistritosLocales().subscribe({
      next: (distritosFromApi) => {
        this.distritosLocales = distritosFromApi;
        this.usuariosFilter = this.distritosLocales;
        this.isLoadingUsers = LoadingStates.falseLoading;
      },
      error: () => {
        this.isLoadingUsers = LoadingStates.errorLoading;
      }
    });
  }
  handleMouseDown(elementType: string): void {
    this.currentTabClicked = elementType;
    setTimeout(() => {
        this.currentTabClicked = null;
    }, 2);
}

  cargarDistritosLocales() {
    this.distritoLocalService.getDistritosLocales().subscribe((data: DistritoLocal[]) => {
      this.distritosLocales = data;
    });
  }

  cargarAyuntamientos() {
    this.ayuntamientoService.getAyuntamientos().subscribe((data: Ayuntamiento[]) => {
      this.ayuntamientos = data;
    });
  }

  cargarComunidades() {
    this.comunidadService.getComunidades().subscribe((data: Comunidad[]) => {
      this.comunidades = data;
    });
  }

  subscribeToRefreshEvents() {
    this.distritoLocalService.refreshListUsers.subscribe(() => {
      console.log('Evento de actualización recibido para distritos locales');
      this.getListadoDistritosLocales(); // Usa la función original
    });

    this.ayuntamientoService.refreshListUsers.subscribe(() => {
      console.log('Evento de actualización recibido para ayuntamientos');
      this.cargarAyuntamientos();
    });

    this.comunidadService.refreshListUsers.subscribe(() => {
      console.log('Evento de actualización recibido para comunidades');
      this.cargarComunidades();
    });
  }


  obtenerEstados() {
    this.estadoService.obtenerEstados().subscribe(
      (estados: Estados[]) => {
        this.estados = estados;
        console.log('Estados', estados)
      },
      (error) => {
        console.error('Error al obtener estados:', error);
      }
    );
  }

  enviarFormulario() {
    this.distritoLocal = this.distritoLocalForm.value as DistritoLocal;
    const tipoOrganizacionPoliticaValue = this.distritoLocalForm.get('estado')?.value;
    this.distritoLocal.estado = { id: tipoOrganizacionPoliticaValue } as Estados;
    this.distritoLocalService.postDistritoLocal(this.distritoLocal).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Distrito local agregada con éxito");
        this.resetForm();
        this.getListadoDistritosLocales();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar el distrito local");
        console.error(error);
      }
    });
}

  enviarAyuntamiento() {
    this.ayuntamiento = this.ayuntamientoForm.value as Ayuntamiento;
    const tipoOrganizacionPoliticaValue = this.ayuntamientoForm.get('distritoLocal')?.value;
    this.ayuntamiento.distritoLocal = { id: tipoOrganizacionPoliticaValue } as DistritoLocal;
    this.ayuntamientoService.postAyuntamiento(this.ayuntamiento).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Ayuntamiento agregado con éxito");
        this.resetForm();
        this.cargarAyuntamientos();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar el ayuntamiento");
        console.error(error);
      }
    });
}

  agregarComunidad() {
    this.comunidad = this.comunidadForm.value as Comunidad;
    const tipoOrganizacionPoliticaValue = this.ayuntamientoForm.get('ayuntamiento')?.value;
    this.comunidad.ayuntamiento = { id: tipoOrganizacionPoliticaValue } as Ayuntamiento;
    this.comunidadService.agregarComunidad(this.comunidad).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Comunidad agregada con éxito");
        this.resetForm();
        this.cargarComunidades();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar la comunidad");
        console.error(error);
      }
    });
}

  resetForm() {
    this.closebutton.nativeElement.click();
    this.distritoLocalForm.reset();
    this.comunidadForm.reset();
  }
  resetFormAy() {
    if (this.isModalAdd) {
      this.closebutton.nativeElement.click();
    }
    this.ayuntamientoForm.reset();
  }
  submitAyuntamientos() {
    this.ayuntamiento = this.ayuntamientoForm.value as Ayuntamiento;
    if (this.isModalAdd) {
      this.enviarAyuntamiento();
    } else {
      this.actualizarAyuntamiento();
    }
    this.resetFormAy();
  }
  submitComunidades() {
    this.comunidad = this.comunidadForm.value as Comunidad;
    if (this.isModalAdd) {
      this.agregarComunidad();
    } else {
      this.actualizarComunidad();
    }
    this.resetFormAy();
  }
  handleChangeAdd(elementType: string) {
    console.log('handleChangeAdd called with elementType:', elementType);
    this.distritoLocalForm.reset();
    this.ayuntamientoForm.reset();
    this.comunidadForm.reset();
    switch (elementType) {
        case 'distrito-local':
            console.log('Changing tab to distrito-local');
            this.currentTab = 'distrito-local';
            break;
        case 'ayuntamiento':
            console.log('Changing tab to ayuntamiento');
            this.currentTab = 'ayuntamiento';
            break;
        case 'comunidad':
            console.log('Changing tab to comunidad');
            this.currentTab = 'comunidad';
            break;
        default:
            break;
    }
    this.isModalAdd = true;
    console.log('currentTab after handleChangeAdd:', this.currentTab);
    console.log('isModalAdd after handleChangeAdd:', this.isModalAdd);
}
  eliminarDistritoLocal(distritoLocalId: number, nombreDistritoLocal: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el Distrito Local: ${nombreDistritoLocal}?`,
      () => {
        this.distritoLocalService.deleteDistritoLocal(distritoLocalId).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Distrito Local eliminado correctamente');
          },
          error: (error) => {
            if (error.status === 400 && error.error && error.error.message === 'No se puede eliminar el Distrito Local porque tiene Ayuntamientos registrados.') {
              this.mensajeService.mensajeError('No se puede eliminar el Distrito Local porque tiene Ayuntamientos registrados.');
            } else {
              this.mensajeService.mensajeError('No se puede eliminar el Distrito Local porque tiene Ayuntamientos registrados.');
            }
          }
        });
      }
    );
  }
  eliminarAyuntamiento(ayuntamientoId: number, nombreAyuntamiento: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el Ayuntamiento: ${nombreAyuntamiento}?`,
      () => {
        this.ayuntamientoService.deleteAyuntamiento(ayuntamientoId).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Ayuntamiento eliminado correctamente');
          },
          error: (error) => {
            if (error.status === 400 && error.error && error.error.message === 'No se puede eliminar el Ayuntamiento porque tiene Comunidades registradas.') {
              this.mensajeService.mensajeError('No se puede eliminar el Ayuntamiento porque tiene Comunidades registradas');
            } else {
              this.mensajeService.mensajeError('No se puede eliminar el Ayuntamiento porque tiene Comunidades registradas');
            }
          }        });
      }
    );
  }
  eliminarComunidad(comunidadId: number, nombreComunidad: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar la Comunidad: ${nombreComunidad}?`,
      () => {
        this.comunidadService.eliminarComunidad(comunidadId).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Comunidad eliminada correctamente');
          },
          error: (error) => this.mensajeService.mensajeError(error)
        });
      }
    );
  }
  actualizarUsuario() {
    this.distritoLocalService.putDistritoLocal(this.distritoLocal).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Distrito local actualizado con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar distrito local");
        console.error(error);
      }
    }
    );
  }
  actualizarAyuntamiento() {
    this.ayuntamientoService.putAyuntamiento(this.ayuntamiento).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Ayuntamiento actualizado con éxito");
        this.resetFormAy();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar el ayuntamiento");
        console.error(error);
      }
    }
    );
  }
  actualizarComunidad() {
    this.comunidadService.editarComunidad(this.comunidad).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Comunidad actualizada con éxito");
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar la comunidad");
        console.error(error);
      }
    }
    );
  }
  setDataModalUpdateComunidad(user: Comunidad) {
    this.isModalAdd = false;
    this.comunidadForm.patchValue({
      id: user.id,
      nombre: user.nombre,
      acronimo: user.acronimo,
      estatus: user.estatus,
      peticion: user.peticion,
      ayuntamientoId: user.ayuntamiento
    });
    console.log(this.comunidadForm.value);
  }
  setDataModalUpdateAyuntamiento(user: Ayuntamiento) {
    this.isModalAdd = false;
    this.ayuntamientoForm.patchValue({
      ayuntamientoId: user.id,
      nombreAyuntamiento: user.nombre,
      acronimo: user.acronimo,
      estatus: user.estatus,
      peticion: user.peticion,
      distritoLocalId: user.distritoLocal
    });
    console.log(this.ayuntamientoForm.value);
  }
  setDataModalUpdate(user: DistritoLocal) {
    this.isModalAdd = false;
    this.distritoLocalForm.patchValue({
      id: user.id,
      nombre: user.nombre,
      acronimo: user.acronimo,
      estatus: user.estatus,
      peticion: user.peticion,
      estado: user.estado
    });
    console.log(this.distritoLocalForm.value);
  }
  submitDistritosLocales() {
    this.distritoLocal = this.distritoLocalForm.value as DistritoLocal;
    this.isModalAdd ? this.enviarFormulario() : this.actualizarUsuario();
  }
  filtrarDistritoslocales = () => {
    return this.distritosLocales.filter(distritoLocal => {
      const searchTermLower = this.searchTerm.toLowerCase();
      return (
        distritoLocal.nombre.toLowerCase().includes(searchTermLower) ||
        distritoLocal.acronimo.toLowerCase().includes(searchTermLower)
      );
    });
  };
  filtrarAyuntamientos = () => {
    return this.ayuntamientos.filter(ayuntamientos => {
      const searchTermLower = this.searchTerm.toLowerCase();
      return (
        ayuntamientos.nombre.toLowerCase().includes(searchTermLower) ||
        ayuntamientos.acronimo.toLowerCase().includes(searchTermLower)
      );
    });
  };
  filtrarComunidades = () => {
    return this.comunidades.filter(comunidades => {
      const searchTermLower = this.searchTerm.toLowerCase();
      return (
        comunidades.nombre.toLowerCase().includes(searchTermLower) ||
        comunidades.acronimo.toLowerCase().includes(searchTermLower)
      );
    });
  };

  onPageChange(number: number) {
    this.configPaginator.currentPage = number;
  }
}
