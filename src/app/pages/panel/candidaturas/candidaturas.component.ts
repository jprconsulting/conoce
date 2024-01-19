import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { CandidaturasService } from 'src/app/core/services/candidaturas.service';
import { Partidos } from 'src/app/models/partidos';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core'; // Importa Pipe y PipeTransform
import { LoadingStates } from 'src/app/global/globals';
import { TipoCandidatura } from 'src/app/models/tipocandidatura';
import { PaginationInstance } from 'ngx-pagination';
import { Candidaturas } from 'src/app/models/candidaturas';

@Component({
  selector: 'app-partidos',
  templateUrl: './candidaturas.component.html',
  styleUrls: ['./candidaturas.component.css']
})


export class CandidaturasComponent {
  isLoadingUsers = LoadingStates.neutro;
  previewImage: string | ArrayBuffer | null = null;
  candidaturas!:Candidaturas;
  candidaturalist: Candidaturas[] = [];
  TipoCandidaturas: TipoCandidatura [] =[];
  partidoForm!: FormGroup;
  candidatura = false;
  usuariosFilter: Candidaturas[] = [];
  verdadero = "Activo";
  falso = "Inactivo";
  estatusBtn = true;
  estatusTag = this.verdadero;
  filtro: string = '';
  itemsPerPage: number = 2;
  currentPage: number = 1;
  mostrarCampoPartidos  = false;
  showImage: boolean = true;
  imagenAmpliada: string | null = null;
  itemsPerPageOptions: number[] = [2, 4, 6];
  isModalAdd = false;
  datos2: Candidaturas[] = [];
  datosAgrupados: { [key: string]: Partidos[] } = {};
  isLoading = LoadingStates.neutro;
  tipoSelect!: TipoCandidatura | undefined;
  id!: number;
  @ViewChild('imagenInput') imagenInput!: ElementRef;
  @ViewChild('closebutton') closebutton!: ElementRef;

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private candidaturaService: CandidaturasService,
    private formBuilder: FormBuilder,
    private mensajeService: MensajeService,

    ) {
    this.crearFormularioPartido();;
    this.getTipo();
  }

  ngOnInit() {
    this.obtenerCandidaturas()
  }

  getTipo() {
    this.candidaturaService.gettipos().subscribe({
      next: (tipoFromAPI) => {
        this.TipoCandidaturas = tipoFromAPI; console.log('hui',this.TipoCandidaturas)
      },
      error: (error) => {
        console.log('error al obtener los roles', error);
      }
    });
  }
  // Método para abrir el modal
  openModal() {
    this.previewImage = null;
    this.estatusBtn = true;
  }
  onPageChange(number: number) {
    this.configPaginator.currentPage = number;
  }
  crearFormularioPartido() {
    this.partidoForm = this.formBuilder.group({
     

      id: [null],
      nombreOrganizacion:['',[Validators.required, Validators.minLength(2), Validators.pattern(/^([a-zA-ZÀ-ÿ\u00C0-\u00FF]{2})[a-zA-ZÀ-ÿ\u00C0-\u00FF ]+$/)]],
      candidatura: ['', Validators.required],
      acronimo: ['',[Validators.required, Validators.minLength(2), Validators.pattern(/^([a-zA-ZÀ-ÿ\u00C0-\u00FF]{2})[a-zA-ZÀ-ÿ\u00C0-\u00FF ]+$/)]],
      estatus: [this.estatusBtn],
      logo: [''],
      imagenBase64: ['']
      // base64Logo: [''],
      // nombreFoto: ['', Validators.required],
    });
  }


  cerrarModal() {
    this.imagenAmpliada = null;
    const modal = document.getElementById('modal-imagen-ampliada');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  get imagenControl(): FormControl {
    return this.partidoForm.get('imagen') as FormControl;
  }

  handleChangeAdd() {
    if (this.partidoForm) {
      this.partidoForm.reset();
      const estatusControl = this.partidoForm.get('estatus');
      if (estatusControl) {
        estatusControl.setValue(true);
      }
      this.isModalAdd = true;
    }
  }

// Método para manejar el cambio de la imagen
onImageChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // La cadena Base64 incluye el prefijo "data:image/png;base64,"
      const base64String = reader.result as string;

      // Eliminar el prefijo "data:image/png;base64," de la cadena
      const base64WithoutPrefix = base64String.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

      console.log(base64WithoutPrefix); // Verifica que la cadena no incluya el prefijo

      // Asigna la cadena Base64 sin el prefijo al control del formulario base64Logo
      const imagenBase64Control = this.partidoForm.get('imagenBase64');
      if (imagenBase64Control instanceof FormControl) {
        imagenBase64Control.setValue(base64WithoutPrefix);
      }

      this.previewImage = base64String; // Actualiza la previsualización
    };
  }
}
setEstatus() {
  this.estatusTag = this.estatusBtn ? this.verdadero : this.falso;
}

  mostrarImagenAmpliada(rutaImagen: string) {
    this.imagenAmpliada = rutaImagen;
    const modal = document.getElementById('modal-imagen-ampliada');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  obtenerCandidaturas() {
    this.isLoading = LoadingStates.trueLoading;
    this.candidaturaService.getCandidaturas2().subscribe(
      (candidaturalist: Candidaturas[]) => {
        this.candidaturalist = candidaturalist;
        this.datos2 = candidaturalist;
        this.usuariosFilter = this.candidaturalist;
        console.log('Candidaturas obtenidas:', this.candidaturalist);
      },
      (error) => {
        console.error('Error al obtener las candidaturas:', error);
 
      }
    );
  }

  mostrar(){
    this.showImage = true;
  }
  eliminarImagen(event: Event) {
    this.showImage = false;
    this.previewImage = null;
    event.stopPropagation();
  }

  resetForm() {
    this.closebutton.nativeElement.click();
    this.partidoForm.reset();
  }
  submit() {
    if (this.isModalAdd === false) {

      this.actualizarVisita();
    } else {
      this.agregarCargo();

    }
  }

  actualizarVisita(){
    this.candidaturas = this.partidoForm.value as Candidaturas;
    const tipoOrganizacionPoliticaValue = this.partidoForm.get('candidatura')?.value;
    this.candidaturas.tipoOrganizacionPolitica = { id: tipoOrganizacionPoliticaValue } as TipoCandidatura;
    const imagenBase64 = this.partidoForm.get('imagenBase64')?.value;

    if (imagenBase64) {
      const formData = { ...this.candidaturas, imagenBase64 };

      this.candidaturaService.putCandidatura(this.id, formData).subscribe({
        next: () => {
          this.mensajeService.mensajeExito('Agrupacion actualizada correctamente');
          this.resetForm();
          this.configPaginator.currentPage = 1;
          this.obtenerCandidaturas();
        },
        error: (error) => {
          this.mensajeService.mensajeError("Error al actualizar agrupación");
          console.error(error);
        }
      });
    } else {
      console.error('Error: No se encontró una representación válida en base64 de la imagen.');
    }
  }

agregarCargo() {
    this.candidaturas = this.partidoForm.value as Candidaturas;
    const tipoOrganizacionPoliticaValue = this.partidoForm.get('candidatura')?.value;
    this.candidaturas.tipoOrganizacionPolitica = { id: tipoOrganizacionPoliticaValue } as TipoCandidatura;
    const imagenBase64 = this.partidoForm.get('imagenBase64')?.value;
      const formData = { ...this.candidaturas, imagenBase64 };
    this.candidaturaService.postCandidaturas(this.candidaturas).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Agrupación agregada con éxito");
        this.resetForm();
        this.obtenerCandidaturas();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al agregar agrupación");
        console.error(error);
      }
    });
}

  filtrarCandidaturas(tipoCandidatura: string) {
    this.filtro = tipoCandidatura;
  }

  mostrarTodasCandidaturas() {
    this.filtro = '';
  }

  deleteItem(id: number, nameItem: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar la agrupacion: ${nameItem}?`,
      () => {
        this.candidaturaService.delete(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Agrupacion borrada correctamente');
            this.configPaginator.currentPage = 1;
            this.obtenerCandidaturas();
          },
          error: (error) => this.mensajeService.mensajeError(error)
        });
      }
    );
    this.obtenerCandidaturas();
  }

  obtenerRutaImagen(nombreArchivo: string): string {
    const rutaBaseApp = 'https://localhost:7224/';

    if (nombreArchivo) {
      return `${rutaBaseApp}images/${nombreArchivo}`;
    }

    return '/assets/images/';
  }

  onSelectBeneficiario(id: number) {
    if (id) {
      this.tipoSelect = this.TipoCandidaturas.find(b => b.id === id);
    }
  }

  setDataModalUpdate(dto: Candidaturas) {
    this.previewImage = dto.imagenBase64,
    this.id = dto.id;
    const idtipo = dto.tipoOrganizacionPolitica.id;
    this.onSelectBeneficiario(idtipo);
    this.isModalAdd = false;

    this.partidoForm.patchValue({
      id: dto.id,
      nombreOrganizacion: dto.nombreOrganizacion,
      acronimo: dto.acronimo,
      imagenBase64: dto.imagenBase64,
      estatus: dto.estatus,
      candidatura: idtipo,
    });
    console.log(this.partidoForm.value);
  }
}


