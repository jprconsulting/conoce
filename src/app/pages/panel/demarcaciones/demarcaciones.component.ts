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
  distritosLocales: DistritoLocal[] = [];
  ayuntamientos: Ayuntamiento[] = [];
  comunidades: Comunidad[] = [];
  estados: Estados[] = [];
  isModalAdd = false;

  itemsPerPage: number = 5;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 15];

  searchTerm: string = '';
  filteredDistritosLocales: DistritoLocal[] = [];

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
      nombreAyuntamiento: ['', [Validators.required]],
      acronimo: ['', [Validators.required]],
      estatus: [true],
      extPet: ['', [Validators.required]],
      distritoLocalId: [null, Validators.required],
    });

    this.comunidadForm = this.formBuilder.group({
      nombreComunidad: ['', [Validators.required]],
      acronimo: ['', [Validators.required]],
      estatus: [true],
      extPet: ['', [Validators.required]],
      ayuntamientoId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarDistritosLocales();
    this.cargarAyuntamientos();
    this.cargarComunidades();
    this.obtenerEstados();
  }

  cargarDistritosLocales() {
    this.distritoLocalService.getDistritosLocales().subscribe((data: DistritoLocal[]) => {
      this.distritosLocales = data;
      console.log('Distritos Locales:', this.distritosLocales);
    });
  }

  cargarAyuntamientos() {
    this.ayuntamientoService.getAyuntamientos().subscribe((data: Ayuntamiento[]) => {
      this.ayuntamientos = data;
      console.log('Ayuntamientos:', this.ayuntamientos);
    });
  }

  cargarComunidades() {
    this.comunidadService.getComunidades().subscribe((data: Comunidad[]) => {
      this.comunidades = data;
      console.log('Comunidades:', this.comunidades);
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

      this.ayuntamientoService.postAyuntamiento(ayuntamientoData).subscribe({
        next: () => {
          this.mensajeService.mensajeExito('Ayuntamiento agregado con éxito');
          this.resetForm();
        },
        error: (error) => {
          this.mensajeService.mensajeError('Error al agregar Ayuntamiento');
          console.error(error);
        }
      });
    } else {
    }
  }

  agregarComunidad(): void {
    if (this.comunidadForm.valid) {
      const comunidadData = this.comunidadForm.value;

      this.comunidadService.agregarComunidad(comunidadData).subscribe({
        next: (nuevaComunidad) => {
          this.mensajeService.mensajeExito('Comunidad agregada con éxito');
          this.resetForm();
        },
        error: (error) => {
          this.mensajeService.mensajeError('Error al agregar comunidad');
          console.error(error);
        }
      });
    }
  }

  resetForm() {
    this.closebutton.nativeElement.click();
    this.distritoLocalForm.reset();
    this.ayuntamientoForm.reset();
    this.comunidadForm.reset();

  }

  handleChangeAdd() {
    this.distritoLocalForm.reset();
    this.ayuntamientoForm.reset();
    this.comunidadForm.reset();
    this.isModalAdd = true;
  }

  eliminarDistritoLocal(distritoLocalId: number, nombreDistritoLocal: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el Distrito Local: ${nombreDistritoLocal}?`,
      () => {
        this.distritoLocalService.eliminarDistritoLocal(distritoLocalId).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Distrito Local eliminado correctamente');
          },
          error: (error) => this.mensajeService.mensajeError(error)
        });
      }
    );
  }

  eliminarAyuntamiento(ayuntamientoId: number, nombreAyuntamiento: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el Ayuntamiento: ${nombreAyuntamiento}?`,
      () => {
        this.ayuntamientoService.eliminarAyuntamiento(ayuntamientoId).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Ayuntamiento eliminado correctamente');
          },
          error: (error) => this.mensajeService.mensajeError(error)
        });
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
    this.distritoLocalService.editarDistritoLocal(this.distritoLocal).subscribe({
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



}
