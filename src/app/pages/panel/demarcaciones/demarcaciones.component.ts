import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
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
    private distritoLocalService: DistritoLocalService,
    private ayuntamientoService: AyuntamientoService,
    private comunidadService: ComunidadService,
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private mensajeService: MensajeService,
  ) {
    this.distritoLocalForm = this.formBuilder.group({
      distritoLocalId: [null],
      nombreDistritoLocal: ['', [Validators.required]],
      acronimo: ['', [Validators.required]],
      estatus: [true],
      extPet: ['', [Validators.required]],
      estadoId: [null, Validators.required],
    });
    this.ayuntamientoForm = this.formBuilder.group({
      ayuntamientoId: [null],
      nombreAyuntamiento: ['', [Validators.required]],
      acronimo: ['', [Validators.required]],
      estatus: [true],
      extPet: ['', [Validators.required]],
      distritoLocalId: [null, Validators.required],
    });
    this.comunidadForm = this.formBuilder.group({
      comunidadId: [null],
      nombreComunidad: ['', [Validators.required]],
      acronimo: ['', [Validators.required]],
      estatus: [true],
      extPet: ['', [Validators.required]],
      ayuntamientoId: [null, Validators.required],
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
      },
      (error) => {
        console.error('Error al obtener estados:', error);
      }
    );
  }
  getNombreEstado(estadoId: number): string {
    const estado = this.estados.find((e) => e.estadoId === estadoId);
    return estado ? estado.nombreEstado : 'Desconocido';
  }
  getNombreDistritoLocal(distritoLocalId: number): string {
    const distritoLocal = this.distritosLocales.find((dl) => dl.distritoLocalId === distritoLocalId);
    return distritoLocal ? distritoLocal.nombreDistritoLocal : 'Desconocido';
  }
  getNombreAyuntamiento(ayuntamientoId: number): string {
    const ayuntamiento = this.ayuntamientos.find((a) => a.ayuntamientoId === ayuntamientoId);
    return ayuntamiento ? ayuntamiento.nombreAyuntamiento : 'Desconocido';
  }
  enviarFormulario() {
    if (this.distritoLocalForm.valid) {
      const nuevoDistritoLocal = this.distritoLocalForm.value;
      const nombreExistente = this.distritosLocales.some(dl => dl.nombreDistritoLocal === nuevoDistritoLocal.nombreDistritoLocal);
      const acronimoExistente = this.distritosLocales.some(dl => dl.acronimo === nuevoDistritoLocal.acronimo);
      if (nombreExistente) {
        console.error('Ya existe un Distrito Local con este nombre.');
        this.mensajeService.mensajeError('Ya existe un Distrito Local con este nombre.');
      } else if (acronimoExistente) {
        console.error('Ya existe un Distrito Local con este acrónimo.');
        this.mensajeService.mensajeError('Ya existe un Distrito Local con este acrónimo.');
      } else {
        this.distritoLocalService.postDistritoLocal(nuevoDistritoLocal).subscribe(
          (response) => {
            console.log('Distrito Local creado exitosamente:', response);
            this.mensajeService.mensajeExito("Distrito Local creado exitosamente");
            this.resetForm();
            // También puedes agregar el nuevo Distrito Local a la lista local
            this.distritosLocales.push(nuevoDistritoLocal);
          },
          (error) => {
            console.error('Error al crear el Distrito Local:', error);
            this.mensajeService.mensajeError("Error al crear Distrito Local");
          }
        );
      }
    } else {
      console.error('El formulario es inválido. No se puede enviar.');
      this.mensajeService.mensajeError("Formulario inválido. Revise los campos.");
    }
  }
  enviarAyuntamiento() {
    if (this.ayuntamientoForm.valid) {
      const ayuntamientoData: Ayuntamiento = this.ayuntamientoForm.value;
      const nombreExistente = this.ayuntamientos.some(a => a.nombreAyuntamiento === ayuntamientoData.nombreAyuntamiento);
      const acronimoExistente = this.ayuntamientos.some(a => a.acronimo === ayuntamientoData.acronimo);
      if (nombreExistente) {
        this.mensajeService.mensajeError('Ya existe un Ayuntamiento con este nombre.');
      } else if (acronimoExistente) {
        this.mensajeService.mensajeError('Ya existe un Ayuntamiento con este acrónimo.');
      } else {
        this.ayuntamientoService.postAyuntamiento(ayuntamientoData).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Ayuntamiento agregado con éxito');
            this.resetFormAy();
          },
          error: (error) => {
            this.mensajeService.mensajeError('Error al agregar Ayuntamiento');
            console.error(error);
          }
        });
      }
    }
  }
  agregarComunidad(): void {
    if (this.comunidadForm.valid) {
      const nuevaComunidadData = this.comunidadForm.value;
      const nombreExistente = this.comunidades.some(c => c.nombreComunidad === nuevaComunidadData.nombreComunidad);
      const acronimoExistente = this.comunidades.some(c => c.acronimo === nuevaComunidadData.acronimo);
      if (nombreExistente) {
        this.mensajeService.mensajeError('Ya existe una Comunidad con este nombre.');
      } else if (acronimoExistente) {
        this.mensajeService.mensajeError('Ya existe una Comunidad con este acrónimo.');
      } else {
        this.comunidadService.agregarComunidad(nuevaComunidadData).subscribe({
          next: (nuevaComunidad) => {
            this.mensajeService.mensajeExito('Comunidad agregada con éxito');
            this.resetForm();
            this.comunidades.push(nuevaComunidad);
          },
          error: (error) => {
            this.mensajeService.mensajeError('Error al agregar comunidad');
            console.error(error);
          }
        });
      }
    }
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
      comunidadId: user.comunidadId,
      nombreComunidad: user.nombreComunidad,
      acronimo: user.acronimo,
      estatus: user.estatus,
      extPet: user.extPet,
      ayuntamientoId: user.ayuntamientoId
    });
    console.log(this.comunidadForm.value);
  }
  setDataModalUpdateAyuntamiento(user: Ayuntamiento) {
    this.isModalAdd = false;
    this.ayuntamientoForm.patchValue({
      ayuntamientoId: user.ayuntamientoId,
      nombreAyuntamiento: user.nombreAyuntamiento,
      acronimo: user.acronimo,
      estatus: user.estatus,
      extPet: user.extPet,
      distritoLocalId: user.distritoLocalId
    });
    console.log(this.ayuntamientoForm.value);
  }
  setDataModalUpdate(user: DistritoLocal) {
    this.isModalAdd = false;
    this.distritoLocalForm.patchValue({
      distritoLocalId: user.distritoLocalId,
      nombreDistritoLocal: user.nombreDistritoLocal,
      acronimo: user.acronimo,
      estatus: user.estatus,
      extPet: user.extPet,
      estadoId: user.estadoId
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
        distritoLocal.nombreDistritoLocal.toLowerCase().includes(searchTermLower) ||
        distritoLocal.acronimo.toLowerCase().includes(searchTermLower)
      );
    });
  };
  filtrarAyuntamientos = () => {
    return this.ayuntamientos.filter(ayuntamientos => {
      const searchTermLower = this.searchTerm.toLowerCase();
      return (
        ayuntamientos.nombreAyuntamiento.toLowerCase().includes(searchTermLower) ||
        ayuntamientos.acronimo.toLowerCase().includes(searchTermLower)
      );
    });
  };
  filtrarComunidades = () => {
    return this.comunidades.filter(comunidades => {
      const searchTermLower = this.searchTerm.toLowerCase();
      return (
        comunidades.nombreComunidad.toLowerCase().includes(searchTermLower) ||
        comunidades.acronimo.toLowerCase().includes(searchTermLower)
      );
    });
  };
}