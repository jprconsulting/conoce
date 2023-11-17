import { Component} from '@angular/core';
import { ConsentimientoService } from 'src/app/core/services/consentimientos.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { LoadingStates } from 'src/app/global/globals';
import { Consentimiento } from 'src/app/models/consentimientos';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { ElementRef, ViewChild } from '@angular/core';
import { Email } from 'src/app/models/Email';
import { EmailService } from 'src/app/core/services/email.servicio';
import { CandidatoService } from 'src/app/core/services/candidato.service';
import { Candidato } from 'src/app/models/candidato';
import { HttpClient } from '@angular/common/http';
import { Cargos } from 'src/app/models/cargos';
import { Candidaturas } from 'src/app/models/candidaturas';
import { EstadoService } from 'src/app/core/services/estados.service';
import { Estados } from 'src/app/models/estados';
import { AceptacionService } from 'src/app/core/services/aceptacion.service';
import { Aceptacion } from 'src/app/models/aceptacion';
@Component({
  selector: 'app-consentimientos',
  templateUrl: './consentimientos.component.html',
  styleUrls: ['./consentimientos.component.css']
})
export class ConsentimientosComponent  {
  ConsentimientoForm2!: FormGroup;
  ConsentimientoForm!: FormGroup;
  isModalAdd =  false;
  isLoadingConsentimiento = LoadingStates.neutro;
  isLoadingAceptacion = LoadingStates.neutro;
  isLoadingcandidatoService = LoadingStates.neutro;
  Consentimientos: Consentimiento[] = [];
  consentimiento!: Consentimiento;
  ConsentimientosFilter: Consentimiento[] = [];
  AceptacionFilter: Aceptacion[] = [];
  emails: Email[] = [];
  formData: any;
  email!: Email;
  Candidatos: Candidato[] = [];
  candidaturas: Candidaturas[] = [];
  candidatos!: any[];
  aceptacion!: any[];
  isLoadingEmails = LoadingStates.neutro;
  isLoadingUsers = LoadingStates.neutro;
  isLoadingCandidato = LoadingStates.neutro;
  selectedEmails: string[] = [];
  filterText: string = ''; 
  filterText4: string = ''; 
  filterText2: string = ''; 
  filterText3: string = '';
  filteredCandidates: any[] = []; 
  filteredCandidates2: any[] = []; 
  candidatoFilter: Candidato[] = [];
  estados: Estados[] = [];
  cargos: Cargos[] = [];
  Aceptacion: Aceptacion[] = [];
  itemsPerPageTable1: number = 5;
    currentPageTable1: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 15];
  itemsPerPageOptions2: number[] = [10, 20, 30];
  itemsPerPageTable2: number = 10;
  currentPageTable2: number = 1;

  
  @ViewChild('cuerpocorreo', { static: false }) cuerpoCorreoElement?: ElementRef;

  ngOnInit(): void {
    this.ConsentimientoService.refreshLisConsentimiento.subscribe(() => this.getConsentimientos());
    this.getConsentimientos();
    this.getListadocandidato();
    this.getEmails();
    this.aceptacionService.refreshLisAceptacion.subscribe(() => this.getAceptacion());
    this.getAceptacion();

    this.candidatoService.getCandidatos().subscribe(data => {
      this.candidatos = data; // Asigna los datos a la variable
    });
  }
  getCurrentDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }
  constructor(
    private formBuilder: FormBuilder,
    private ConsentimientoService: ConsentimientoService,
    private mensajeService: MensajeService,
    private EmailService: EmailService,
    private candidatoService: CandidatoService,
    private http: HttpClient,
    private estadoService: EstadoService,
    private aceptacionService: AceptacionService
    
    ){
      this.creaFormulario();
      this.ConsentimientoService.refreshLisConsentimiento.subscribe(() => this.getConsentimientos());
      this.getConsentimientos();
      this.creaFormulario1();
      this.getAceptacion();
  }
  creaFormulario1(){
    this.ConsentimientoForm2 = this.formBuilder.group({
      Emailuser: ['', [Validators.required]],
    })
  }
  creaFormulario(){
    this.ConsentimientoForm = this.formBuilder.group({
      id:[],
      Nombre: ['',[Validators.required,Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3)]],
      cuerpocorreo: [''],
      email: ['', [Validators.required]],
      Estado: ['', [Validators.required]],
      Fechadenvio: ['', [Validators.required]],
      fechaaceptacion: [null]
    })
  }
  submitconsentimiento(){
    this.isModalAdd ? this.agregaraConsentimiento() : this.actualizarConsentimiento();
  }
  handleChangeAdd() {
    this.ConsentimientoForm.reset();
    this.isModalAdd = true;
  }
  // funciones de Rich text
  alignTextLeft(event: Event) {
    event.preventDefault();
    document.execCommand('justifyLeft', false);
  }
  
  alignTextRight(event: Event) {
    event.preventDefault();
    document.execCommand('justifyRight', false);
  }
  alignTextCenter(event: Event) {
    event.preventDefault();
    document.execCommand('justifyCenter', false);
  }
  
  justifyText(event: Event) {
    event.preventDefault();
    document.execCommand('justifyFull', false);
  }
  
  boldText(event: Event) {
    event.preventDefault();
    document.execCommand('bold', false);
  }

  italicText(event: Event) {
    event.preventDefault();
    document.execCommand('italic', false);
  }
  insertBulletList(event: Event) {
    event.preventDefault();
    document.execCommand('insertUnorderedList', false);
  }
  subrayarTexto(event: Event) {
    event.preventDefault();
    document.execCommand('underline', false);
  }
  changeTextColor(color: string) {
    document.execCommand('foreColor', false, color);
}
//fin
prepararModalAgregar() {
  this.isModalAdd = true;
  // También puedes restablecer el formulario u otros valores si es necesario
  this.ResetForm();
}

ResetForm() {
  this.ConsentimientoForm.reset();
  this.ConsentimientoForm2.reset();
  this.filterText = ''; 
  this.filterText2 = ''; 
  this.filterText3 = '';
  const editorElement = document.getElementById('cuerpocorreoEditor');
  if (editorElement) {
    editorElement.innerHTML = '';
  }
}

agregaraConsentimiento() {
    const cuerpocorreo = this.obtenerContenidoEditor();
    if (cuerpocorreo) {
      const consentimientoSinId = { ...this.ConsentimientoForm.value };
      delete consentimientoSinId.id;
      consentimientoSinId.cuerpocorreo = cuerpocorreo;
      this.ConsentimientoService.postConsentimiento(consentimientoSinId).subscribe({
        next: () => {
          this.mensajeService.mensajeExito("Creado exitosamente");
          this.ResetForm();
        },
        error: (error) => {
          this.mensajeService.mensajeError("Error");
          console.error(error);
        }
      });
    }
  
}
getEmails() {
  this.EmailService.getEmail().subscribe({
    next: (emailFromAPI) => {
      this.emails = emailFromAPI;
    },
    error: (error) => {
      console.log('error al obtener', error);
    }
  });
}

obtenerContenidoEditor() {
  const editorElement = document.getElementById('cuerpocorreoEditor');
  if (editorElement) {
    return editorElement.innerHTML;
  } else {
    console.error('El elemento del editor no se encontró o es nulo.');
    return null;
  }
}


deleteConsentimiento(id: number, Consentimiento: string) {
  this.mensajeService.mensajeAdvertencia(
    `¿Estás seguro de eliminar a: ${Consentimiento}?`,
    () => {
      this.ConsentimientoService.deleteConsentimiento(id).subscribe({
        next: () => {
          this.mensajeService.mensajeExito('Eliminado correctamente');
          this.getConsentimientos();
        },
        error: (error) => this.mensajeService.mensajeError(error)
      });
    }
  );
}
enviarConsentimientos(email: string, id: number, selectedEmails: string[]) {
    const email2 = this.formData.email;
    const id2 = this.formData.id;
    const selectedEmails2 = this.selectedEmails;
  this.ConsentimientoService.enviarConsentimientos(email2, id2, selectedEmails2).subscribe({
  next: () => {
    this.mensajeService.mensajeExito('Email enviado');
    this.getAceptacion();
  },
  error: () => {
    this.isLoadingUsers = LoadingStates.errorLoading;
  }
});
this.mensajeService.mensajeExito('Email enviado');
this.getAceptacion();
}


toggleSelection(email: string) {
  if (this.selectedEmails.includes(email)) {
    // Si el correo ya está en la lista, quítalo
    this.selectedEmails = this.selectedEmails.filter(item => item !== email);
    
  } else {
    // Si el correo no está en la lista, agrégalo
    this.selectedEmails.push(email);
  }
}

actualizarConsentimiento() {
  const cuerpocorreo = this.obtenerContenidoEditor();

  if (cuerpocorreo !== null) {
    this.consentimiento = this.ConsentimientoForm.value as Consentimiento;
    this.consentimiento.cuerpocorreo = cuerpocorreo; // Asigna el contenido del editor

    this.ConsentimientoService.putConsentimiento(this.consentimiento).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Actualizado con éxito");
        this.ResetForm();
        this.getConsentimientos();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar");
        console.error(error);
      }
    });
  }
}
getConsentimientos() {
  this.isLoadingConsentimiento = LoadingStates.trueLoading;
  this.ConsentimientoService.getConsentimiento().subscribe({
    next: (ConsentimientoFromApi) => {
      this.Consentimientos = ConsentimientoFromApi;
      this.ConsentimientosFilter = this.Consentimientos;
      this.isLoadingConsentimiento = LoadingStates.falseLoading;
    }, error: () => {
      this.isLoadingConsentimiento = LoadingStates.errorLoading;
    }
  });
}
getAceptacion() {
  this.isLoadingAceptacion = LoadingStates.trueLoading;
  this.aceptacionService.getAceptacion().subscribe({
    next: (AceptacionFromApi) => {
      this.Aceptacion = AceptacionFromApi;
      this.AceptacionFilter = this.Aceptacion;
      this.isLoadingAceptacion = LoadingStates.falseLoading;
      console.log('aaa',this.Aceptacion);
      
    }, error: () => {
      this.isLoadingAceptacion = LoadingStates.errorLoading;
    }
  });
}
getListadocandidato() {
  this.isLoadingcandidatoService = LoadingStates.trueLoading;
  this.candidatoService.getCandidatos().subscribe(
    (candidatosFromApi) => {
        this.Candidatos = candidatosFromApi;
        this.candidatoFilter = this.Candidatos;
        console.log('Candidatos cargados:', this.Candidatos);
        this.isLoadingcandidatoService = LoadingStates.falseLoading;
    },
    (error) => {
        console.log('Error al cargar candidatos:', error);
        this.isLoadingcandidatoService = LoadingStates.errorLoading;
    }
  );
}




setDataModalUpdate(consentimiento: Consentimiento) {
  const cuerpocorreoEditor = document.getElementById('cuerpocorreoEditor');
  this.isModalAdd = false;
  
  // Formatea la fecha de consentimiento.fechadenvio en "YYYY-MM-DD"
  const formattedDate = new Date(consentimiento.fechadenvio).toISOString().split('T')[0];
  
  this.ConsentimientoForm.patchValue({
    id: consentimiento.id,
    Nombre: consentimiento.nombre,
    cuerpocorreo: consentimiento.cuerpocorreo,
    email: consentimiento.email,
    Estado: consentimiento.estado,
    Fechadenvio: formattedDate, // Asigna la fecha formateada aquí
  });
  if (cuerpocorreoEditor) {

    cuerpocorreoEditor.innerHTML = consentimiento.cuerpocorreo;
  } else {
    console.error('Elemento del editor no encontrado.');
  }
  this.formData = this.ConsentimientoForm.value;
  console.log(this.ConsentimientoForm.value);
}

filterCandidates() {
  this.filteredCandidates = this.candidatos.filter((candidato) => {
    const nombreCompleto = `${candidato.nombre} ${candidato.apellidoPaterno} ${candidato.apellidoMaterno}`;
    const textoFiltrado = this.filterText.toLowerCase();

    return nombreCompleto.toLowerCase().includes(textoFiltrado);
  });
}
filterCandidates2() {
  this.AceptacionFilter = this.Aceptacion.filter((aceptacion) => {
    const nombreCompleto = `${aceptacion.nombre} ${aceptacion.apat} ${aceptacion.amat} ${aceptacion.nombreC} ${aceptacion.fechadenvio} ${aceptacion.fechaaceptacion} `;
    const textoFiltrado2 = this.filterText4.trim().toLowerCase();

    return nombreCompleto.toLowerCase().includes(textoFiltrado2);
  });
}



//   this.applyFilters2And3();
// }

// filterCandidates2() {
//   this.applyFilters2And3();
// }

// filterCandidates3() {
//   this.applyFilters2And3();
// }

// applyFilters2And3() {
//   if (this.filterText2 === 'null' && this.filterText3 === 'null') {
//     // No se ha seleccionado ni estado ni cargo, mostrar todos los candidatos
//     this.filteredCandidates = this.candidatos;
//   } else {
//     // Aplicar filtro de estado si se ha seleccionado
//     if (this.filterText2 !== 'null') {
//       this.filteredCandidates = this.filteredCandidates.filter((candidato) => {
//         return candidato.estado.nombreEstado.toLowerCase() === this.filterText2.toLowerCase();
//       });
//     }

//     // Aplicar filtro de cargo si se ha seleccionado
//     if (this.filterText3 !== 'null') {
//       this.filteredCandidates = this.filteredCandidates.filter((candidato) => {
//         return candidato.cargo.nombreCargo.toLowerCase() === this.filterText3.toLowerCase();
//       });
//     }
//   }
// }


Optener(consentimiento: Consentimiento) {
  this.consentimiento = {
    id: consentimiento.id,
    nombre: consentimiento.nombre,
    cuerpocorreo: consentimiento.cuerpocorreo,
    email: consentimiento.email,
    estado: consentimiento.estado,
    fechadenvio: consentimiento.fechadenvio,
    fechaaceptacion: new Date()
  };
}


toggleSelection2(candidato: any) {
  this.consentimiento;
  if (
    candidato &&
    candidato.nombre &&
    candidato.apellidoPaterno &&
    candidato.apellidoMaterno 
    
  ) {
    const consentimientoNombre = this.consentimiento.nombre;
    this.ConsentimientoForm2.get('Nombre')?.setValue(consentimientoNombre);
    const fechaActual = new Date();

    // Crear el objeto Aceptacion con valores por defecto para las fechas
    const Aceptacion = {
      nombreC: consentimientoNombre,
      nombre: candidato.nombre,
      apat: candidato.apellidoPaterno,
      amat: candidato.apellidoMaterno,
      email: candidato.email,
      idCandidato: candidato.candidatoId,
      fechadenvio: fechaActual, // Usar objeto Date en lugar de cadena
      fechaaceptacion: undefined // Usar objeto Date en lugar de cadena
    };
    this.aceptacionService.postAceptacion(Aceptacion).subscribe({
    });
  }
}
deleteAceptar(id: number) {
  this.mensajeService.mensajeAdvertencia(
    `¿Estás seguro de eliminar: ${id}?`,
    () => {
      this.aceptacionService.deleteAceptacion(id).subscribe({
        next: () => {
          this.mensajeService.mensajeExito('Eliminado correctamente');
          this.getAceptacion();
        },
        error: (error) => this.mensajeService.mensajeError(error)
      });
    }
  );
}

}