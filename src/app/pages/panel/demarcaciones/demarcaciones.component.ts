import { Component, ViewChild, OnInit, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DistritoLocalService } from 'src/app/core/services/distritolocal.service';
import { MunicipioService } from 'src/app/core/services/municipio.service';
import { ComunidadService } from 'src/app/core/services/comunidad.service';
import { DistritoLocal } from 'src/app/models/distritoLocal';
import { Municipio } from 'src/app/models/municipio';
import { Comunidad } from 'src/app/models/comunidad';
import { Estado } from 'src/app/models/estado';
import { EstadoService } from 'src/app/core/services/estados.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { LoadingStates } from 'src/app/global/globals';
import { PaginationInstance } from 'ngx-pagination';
@Component({
  selector: 'app-demarcaciones',
  templateUrl: './demarcaciones.component.html',
  styleUrls: ['./demarcaciones.component.css']
})
export class DemarcacionesComponent {
  @ViewChild('miFormulario') miFormulario!: NgForm;
  @ViewChild('closebutton') closebutton!: ElementRef;
  distritoLocalForm: FormGroup;
  municipioForm: FormGroup;
  comunidadForm: FormGroup;
  distritoLocal!: DistritoLocal;
  Municipio!: Municipio;
  municipiosFilter: Municipio[] = [];
  comunidad!: Comunidad;
  distritosLocales: DistritoLocal[] = [];
  usuariosFilter: DistritoLocal[] = [];
  comunidadFilter: Comunidad[] = [];
  Municipios: Municipio[] = [];
  comunidades: Comunidad[] = [];
  estados: Estado[] = [];
  isModalAdd = false;
  isLoadingUsers = LoadingStates.neutro;
  itemsPerPage: number = 5;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 15];
  searchTerm: string = '';
  filteredDistritosLocales: DistritoLocal[] = [];
  filteredComunidades: Comunidad[] = [];
  id!: number;
  currentTab: string = 'distrito-local';
  currentTabClicked: string | null = null;
  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private distritoLocalService: DistritoLocalService,
    private municipioService: MunicipioService,
    private comunidadService: ComunidadService,
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private mensajeService: MensajeService,
  ) {
    this.distritoLocalForm = this.formBuilder.group({
      id: [null],
      nombreDistritoLocal: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^([a-zA-ZÀ-ÿ0-9()\u00C0-\u00FF]{2})[a-zA-ZÀ-ÿ0-9()\u00C0-\u00FF ]+$/)]],
      estado: ['', [Validators.required]]
    });
    this.municipioForm = this.formBuilder.group({
      id: [null],
      nombreMunicipio: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^([a-zA-ZÀ-ÿ\u00C0-\u00FF]{2})[a-zA-ZÀ-ÿ\u00C0-\u00FF ]+$/)]],
      distritoLocal: [null, Validators.required],
    });
    this.comunidadForm = this.formBuilder.group({
      id: [null],
      nombreComunidad: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^([a-zA-ZÀ-ÿ\u00C0-\u00FF]{2})[a-zA-ZÀ-ÿ\u00C0-\u00FF ]+$/)]],
      municipio: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    console.log('OnInit - currentTab:', this.currentTab);
    this.getListadoDistritosLocales();
    this.cargarMunicipios();
    this.cargarComunidades();
    this.subscribeToRefreshEvents();
    this.obtenerEstados();
    console.log('OnInit - currentTab:', this.currentTab);
    if (!['distrito-local', 'municipios', 'comunidad'].includes(this.currentTab)) {
      console.warn(`Valor inesperado para currentTab: ${this.currentTab}. Estableciendo a 'distrito-local' por defecto.`);
      this.currentTab = 'distrito-local';
    }
  }

  getListadoDistritosLocales() {
    this.isLoadingUsers = LoadingStates.trueLoading;
    this.distritoLocalService.getDistritosLocales().subscribe({
      next: (distritosFromApi) => {
        this.distritosLocales = distritosFromApi;
        this.usuariosFilter = this.distritosLocales; console.log('huifrruih', this.distritosLocales)
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

  cargarMunicipios() {
    this.municipioService.getMunicipios().subscribe((data: Municipio[]) => {
      this.Municipios = data;
      console.log('Municipios cargados:', this.Municipios);
      this.municipiosFilter = this.Municipios;
      this.filtrarMunicipios();
    });
  }

  cargarComunidades() {
    this.comunidadService.getComunidades().subscribe((data: Comunidad[]) => {
      this.comunidades = data;
      this.comunidadFilter = this.comunidades;
    });
  }

  subscribeToRefreshEvents() {
    this.distritoLocalService.refreshListUsers.subscribe(() => {
      console.log('Evento de actualización recibido para distritos locales');
      this.getListadoDistritosLocales(); // Usa la función original
    });

    this.municipioService.refreshListUsers.subscribe(() => {
      console.log('Evento de actualización recibido para Mun8icipios');
      this.cargarMunicipios();
    });

    this.comunidadService.refreshListUsers.subscribe(() => {
      console.log('Evento de actualización recibido para comunidades');
      this.cargarComunidades();
    });
  }


  obtenerEstados() {
    this.estadoService.getEstados().subscribe(
      (estados: Estado[]) => {
        this.estados = estados;
        console.log('Estados', estados)
      },
      (error) => {
        console.error('Error al obtener estados:', error);
      }
    );
  }

  enviarFormulario() {
    const nuevodistrito = { ...this.distritoLocalForm.value };
    delete nuevodistrito.id;

    this.distritoLocal.estado = this.distritoLocalForm.value as Estado;
    const estado = this.distritoLocalForm.get('estado')?.value;
    nuevodistrito.estado = { id: estado } as Estado;
    this.distritoLocalService.postDistritoLocal(nuevodistrito).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Distrito local agregado con éxito");
        this.resetForm();
        this.getListadoDistritosLocales();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar el distrito local");
        console.error(error);
      }
    });
  }


  enviarMunicipio() {
    const nuevomunicipio = { ...this.municipioForm.value };
    delete nuevomunicipio.id;

    const distrito = this.municipioForm.get('distritoLocal')?.value;
    nuevomunicipio.distritoLocal = { id: distrito } as DistritoLocal;

    this.municipioService.postMunicipios(nuevomunicipio).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Municipio agregado con éxito");
        this.resetForm();
        this.cargarMunicipios();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar el municipio");
        console.error(error);
      }
    });
  }

  agregarComunidad() {
    const nuevocomunidad = { ...this.comunidadForm.value };
    delete nuevocomunidad.id;
    const municipio = this.comunidadForm.get('municipio')?.value;
    nuevocomunidad.municipio = { id: municipio } as Municipio;
    this.comunidadService.agregarComunidad(nuevocomunidad).subscribe({
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
    this.municipioForm.reset();
  }
  submitMunicipios() {
    this.Municipio = this.municipioForm.value as Municipio;
    if (this.isModalAdd) {
      this.enviarMunicipio();
    } else {
      this.actualizarMunicipio();
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
    this.municipioForm.reset();
    this.comunidadForm.reset();
    switch (elementType) {
      case 'distrito-local':
        console.log('Changing tab to distrito-local');
        this.currentTab = 'distrito-local';
        break;
      case 'municipio':
        console.log('Changing tab to municipio');
        this.currentTab = 'municipio';
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
      `¿Estás seguro de eliminar el distrito Local: ${nombreDistritoLocal}?`,
      () => {
        this.distritoLocalService.deleteDistritoLocal(distritoLocalId).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Distrito local eliminado correctamente');
          },
          error: (error) => {
            if (error.status === 400 && error.error && error.error.message === 'No se puede eliminar el distrito local porque tiene municipios registrados.') {
              this.mensajeService.mensajeError('No se puede eliminar el distrito local porque tiene municipios registrados.');
            } else {
              this.mensajeService.mensajeError('No se puede eliminar el distrito local porque tiene municipios registrados.');
            }
          }
        });
      }
    );
  }
  eliminarMunicipio(id: number, nombremunicipio: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el municipio: ${nombremunicipio}?`,
      () => {
        this.municipioService.deleteMunicipios(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Municipio eliminado correctamente');
          },
          error: (error) => {
            if (error.status === 400 && error.error && error.error.message === 'No se puede eliminar el municipio porque tiene comunidades registradas.') {
              this.mensajeService.mensajeError('No se puede eliminar el municipio porque tiene comunidades registradas');
            } else {
              this.mensajeService.mensajeError('No se puede eliminar el municipio porque tiene comunidades registradas');
            }
          }
        });
      }
    );
  }
  eliminarComunidad(comunidadId: number, nombreComunidad: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar la comunidad: ${nombreComunidad}?`,
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
  actualizardistrito() {
    const distrito = { ...this.distritoLocalForm.value };
    this.distritoLocal.estado = this.distritoLocalForm.value as Estado;
    const estado = this.distritoLocalForm.get('estado')?.value;
    distrito.estado = { id: estado } as Estado;
    this.distritoLocalService.putDistritoLocal(this.id, distrito).subscribe({
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
  actualizarMunicipio() {
    this.Municipio = this.municipioForm.value as Municipio;
    const tipoOrganizacionPoliticaValue = this.municipioForm.get('distritoLocal')?.value;
    this.Municipio.distritoLocal = { id: tipoOrganizacionPoliticaValue } as DistritoLocal;

    this.municipioService.putMunicipios(this.id, this.Municipio).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Municipio actualizado con éxito");
        this.resetFormAy();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar el municipio");
        console.error(error);
      }
    }
    );
  }
  actualizarComunidad() {
    const municipio = this.comunidadForm.get('municipio')?.value;
    this.comunidad.municipio = { id: municipio } as Municipio;

    this.comunidadService.editarComunidad(this.id, this.comunidad).subscribe({
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
  setDataModalUpdateComunidad(com: Comunidad) {
    this.isModalAdd = false;
    this.id = com.id
    this.comunidadForm.patchValue({
      id: com.id,
      nombreComunidad: com.nombreComunidad,
      municipio: com.municipio.id
    });
    console.log(this.comunidadForm.value);
  }
  setDataModalUpdateMunicipio(mun: Municipio) {
    this.isModalAdd = false;
    this.id = mun.id;
    this.municipioForm.patchValue({
      id: mun.id,
      nombreMunicipio: mun.nombreMunicipio,
      distritoLocal: mun.distritoLocal.id
    });
    console.log(this.municipioForm.value);
  }
  setDataModalUpdate(dto: DistritoLocal) {
    this.id = dto.id;
    this.isModalAdd = false;
    this.distritoLocalForm.patchValue({
      id: dto.id,
      nombreDistritoLocal: dto.nombreDistritoLocal,
      estado: dto.estado.id
    });
    console.log(this.distritoLocalForm.value);
  }
  submitDistritosLocales() {
    this.distritoLocal = this.distritoLocalForm.value as DistritoLocal;
    this.isModalAdd ? this.enviarFormulario() : this.actualizardistrito();
  }


  filtrarMunicipios = () => {
    return this.Municipios.filter(Municipios => {
      const searchTermLower = this.searchTerm.toLowerCase();
      return (
        Municipios.nombreMunicipio.toLowerCase().includes(searchTermLower) ||
        Municipios.distritoLocal.nombreDistritoLocal.toLowerCase().includes(searchTermLower)
      );
    });
  };
  filtrarComunidades = () => {
    return this.comunidades.filter(comunidades => {
      const searchTermLower = this.searchTerm.toLowerCase();
      return (
        comunidades.nombreComunidad.toLowerCase().includes(searchTermLower) ||
        comunidades.municipio.nombreMunicipio.toLowerCase().includes(searchTermLower)
      );
    });
  };
  filtrarDistritoslocales = () => {
    return this.distritosLocales.filter(distritoLocal => {
      const searchTermLower = this.searchTerm.toLowerCase();
      return (
        distritoLocal.nombreDistritoLocal.toLowerCase().includes(searchTermLower) ||
        distritoLocal.estado.nombreEstado.toLowerCase().includes(searchTermLower)
      );
    });
  };
  onPageChange(number: number) {
    this.configPaginator.currentPage = number;
  }
  onPageChange2(number: number) {
    this.configPaginator.currentPage = number;
  }
  onPageChange3(number: number) {
    this.configPaginator.currentPage = number;
  }
}
