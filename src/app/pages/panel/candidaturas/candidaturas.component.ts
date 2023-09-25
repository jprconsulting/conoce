import { Component, ElementRef, ViewChild } from '@angular/core';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { CandidaturasService } from 'src/app/core/services/candidaturas.service';
import { Partidos } from 'src/app/models/partidos';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core'; // Importa Pipe y PipeTransform

@Pipe({
  name: 'filterByTipoCandidatura'
})
export class FilterByTipoCandidaturaPipe implements PipeTransform {
  transform(items: any[], filtro: string): any[] {
    if (!filtro) return items; // Si el filtro está vacío, retorna todos los elementos.

    // Filtra los elementos que coinciden con el tipo de candidatura especificado.
    return items.filter(item => item.nombreTipoCandidatura.toLowerCase().includes(filtro.toLowerCase()));
  }
}

@Component({
  selector: 'app-partidos',
  templateUrl: './candidaturas.component.html',
  styleUrls: ['./candidaturas.component.css']
})


export class CandidaturasComponent {
  previewImage: string | ArrayBuffer | null = null;
  partido!: Partidos;
  partidos: Partidos[] = [];
  selectedPartidos: any[] = [];
  partidosSeleccionados: any[] = [];
  partidoForm!: FormGroup;
  nombrePartido = '';
  nombreCandidatura = '';
  nombreCoalicion = '';
  nombreCanInd = '';
  candidatura = false;
  filtro: string = '';
  itemsPerPage: number = 2;
  currentPage: number = 1;
  mostrarCampoPartidos  = false;
  itemsPerPageOptions: number[] = [2, 4, 6];
  isModalAdd = false;
  datos: Partidos[] = [];
  datosAgrupados: { [key: string]: Partidos[] } = {};

  @ViewChild('imagenInput') imagenInput!: ElementRef;
  @ViewChild('closebutton') closebutton!: ElementRef;

  constructor(
    private candidaturaService: CandidaturasService,
    private formBuilder: FormBuilder,
    private mensajeService: MensajeService,

    ) {
    this.crearFormularioPartido();
    this.agruparDatosPorTipoCandidatura();
  }

  ngOnInit() {
    this.obtenerPartidos();
  }

  private agruparDatosPorTipoCandidatura() {
    this.datosAgrupados['Partido Político'] = this.datos.filter(partido => partido.nombreTipoCandidatura === 'Partido Político');
    this.datosAgrupados['Candidatura Común'] = this.datos.filter(partido => partido.nombreTipoCandidatura === 'Candidatura Común');
    this.datosAgrupados['Coalición'] = this.datos.filter(partido => partido.nombreTipoCandidatura === 'Coalición');
    this.datosAgrupados['Candidatura Independiente'] = this.datos.filter(partido => partido.nombreTipoCandidatura === 'Candidatura Independiente');
  }
  // Método para abrir el modal
  openModal() {
    this.previewImage = null;
  }

  crearFormularioPartido() {
    this.partidoForm = this.formBuilder.group({
      candidatura: ['', Validators.required],
      nombreCandidatura: ['', Validators.required],
      acronimo: [''],
      estatus: [true, Validators.required],
      base64Logo: [''],
      nombreFoto: ['', Validators.required],
    });
  }




  get imagenControl(): FormControl {
    return this.partidoForm.get('imagen') as FormControl;
  }

  handleChangeAdd() {
    this.partidoForm.reset();
    this.isModalAdd = true;
  }

// Método para cerrar el modal y reiniciar completamente el formulario
closeModal() {
  this.crearFormularioPartido(); // Vuelve a crear el formulario
  this.previewImage = null; // Elimina la imagen de vista previa
  this.nombrePartido = '';
  this.nombreCandidatura = '';
  this.nombreCoalicion = '';
  this.nombreCanInd = '';
  this.selectedPartidos = [];
  this.isModalAdd = false;
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
      const base64LogoControl = this.partidoForm.get('base64Logo');
      if (base64LogoControl instanceof FormControl) {
        base64LogoControl.setValue(base64WithoutPrefix);
      }

      this.previewImage = base64WithoutPrefix; // Actualiza la previsualización
    };
  }
}

  // Método para guardar el partido político
  guardarPartido() {
    this.closeModal();
  }

  obtenerPartidos() {
    this.candidaturaService.getCandidaturas().subscribe(
      (partidos: Partidos[]) => {
        this.partidos = partidos;
        this.datos = partidos; // Asigna los datos a la variable datos
        console.log('Candidaturas obtenidas:', this.partidos);
      },
      (error) => {
        console.error('Error al obtener las candidaturas:', error);
      }
    );
  }

  eliminarImagen() {
    this.previewImage = null;
  }

  resetForm() {
    this.closebutton.nativeElement.click();
    this.partidoForm.reset();
  }

  agregarCargo() {
    const candidaturaControl = this.partidoForm.get('candidatura');

    if (candidaturaControl && candidaturaControl.value !== null && this.partidoForm.valid) {
      const tipoAgrupacionId = candidaturaControl.value;
      const tipoAgrupacionTexto = this.getTipoAgrupacionNombre(tipoAgrupacionId); // Obtener el nombre correspondiente

      const nombreCandidatura = this.partidoForm.get('nombreCandidatura')?.value || '';
      const acronimo = this.partidoForm.get('acronimo')?.value || '';
      const estatus = this.partidoForm.get('estatus')?.value || '';

      // Elimina el prefijo "data:image/png;base64," del valor de base64Logo
      const base64LogoControl = this.partidoForm.get('base64Logo');
      let base64Logo = base64LogoControl?.value || '';
      if (base64Logo.startsWith('data:image/png;base64,')) {
        base64Logo = base64Logo.replace('data:image/png;base64,', ''); // Elimina el prefijo
      }

      const nombreFoto = this.partidoForm.get('nombreFoto')?.value || '';

      this.partido = {
        tipoCandidaturaId: tipoAgrupacionId,
        nombreTipoCandidatura: tipoAgrupacionTexto,
        nombreCandidatura,
        acronimo,
        estatus,
        base64Logo, // Ahora base64Logo no tiene el prefijo
        nombreFoto,
      };

      console.log('Datos a enviar:', this.partido);

      this.candidaturaService.postCandidaturas(this.partido).subscribe({
        next: () => {
          this.mensajeService.mensajeExito("Agrupación agregada con éxito");
          this.resetForm();
        },
        error: (error) => {
          this.mensajeService.mensajeError("Error al agregar agrupación");
          console.error(error);
        }
      });
    } else {
      console.log('El formulario no es válido o candidaturaControl es nulo. No se enviarán datos.');
    }
  }

  getDatosAgrupados() {
    const datosAgrupados: { [key: string]: Partidos[] } = {};

    this.datos.forEach(partido => {
      const tipoCandidatura = partido.nombreTipoCandidatura;
      if (!datosAgrupados[tipoCandidatura]) {
        datosAgrupados[tipoCandidatura] = [];
      }
      datosAgrupados[tipoCandidatura].push(partido);
    });

    return datosAgrupados;
  }

  getPartidosPorTipoCandidatura(tipoCandidatura: string): Partidos[] {
    return this.datos.filter(partido => partido.nombreTipoCandidatura === tipoCandidatura);
  }

  getTipoAgrupacionNombre(valor: number): string {
    switch (valor) {
      case 1:
        return "Partido político";
      case 2:
        return "Candidatura común";
      case 3:
        return "Coalición";
      case 4:
        return "Candidatura independiente";
      default:
        return "";
    }
  }

}


