import { Component} from '@angular/core';
import { ConsentimientoService } from 'src/app/core/services/consentimientos.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { LoadingStates } from 'src/app/global/globals';
import { Consentimiento } from 'src/app/models/consentimientos';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { ElementRef, ViewChild } from '@angular/core';
import { Email } from 'src/app/models/Email';
import { EmailService } from 'src/app/core/services/email.servicio';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
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
  Consentimientos: Consentimiento[] = [];
  consentimiento!: Consentimiento;
  ConsentimientosFilter: Consentimiento[] = [];
  emails: Email[] = [];
  formData: any;
  email!: Email;
  usuarios: Usuario[] = [];
  isLoadingEmails = LoadingStates.neutro;
  isLoadingUsers = LoadingStates.neutro;
  selectedEmails: string[] = [];
  @ViewChild('cuerpocorreo', { static: false }) cuerpoCorreoElement?: ElementRef;
  
  ngOnInit(): void {
    this.ConsentimientoService.refreshLisConsentimiento.subscribe(() => this.getConsentimientos());
    this.getConsentimientos();
    this.getEmails();
    this.getListadoUsuarios();

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
    private usuarioService: UsuarioService
    
    ){
      this.creaFormulario();
      this.ConsentimientoService.refreshLisConsentimiento.subscribe(() => this.getConsentimientos());
      this.getConsentimientos();
      this.creaFormulario1();
  }
  creaFormulario1(){
    this.ConsentimientoForm2 = this.formBuilder.group({
      Emailuser: ['', [Validators.required]]
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
getConsentimientos() {
  this.isLoadingConsentimiento = LoadingStates.trueLoading;
  this.ConsentimientoService.getConsentimiento().subscribe({
    next: (ConsentimientoFromApi) => {
      this.Consentimientos = ConsentimientoFromApi;
      this.ConsentimientosFilter = this.Consentimientos;
      this.isLoadingConsentimiento = LoadingStates.falseLoading;
      console.log(this.Consentimientos);
    }, error: () => {
      this.isLoadingConsentimiento = LoadingStates.errorLoading;
    }
  });
}
ResetForm() {
  this.ConsentimientoForm.reset();
  this.ConsentimientoForm2.reset();
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
      console.log(this.emails);
    },
    error: (error) => {
      console.log('error al obtener los roles', error);
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
  },
  error: () => {
    this.isLoadingUsers = LoadingStates.errorLoading;
  }
});

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
        console.log(this.consentimiento);
        this.getConsentimientos();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar");
        console.error(error);
        console.log(this.consentimiento);
      }
    });
  }
}
getListadoUsuarios() {
  this.isLoadingUsers = LoadingStates.trueLoading;
  this.usuarioService.getUsuarios().subscribe({
    next: (usuariosFromApi) => {
      this.usuarios = usuariosFromApi;
      this.isLoadingUsers = LoadingStates.falseLoading;
    }, error: () => {
      this.isLoadingUsers = LoadingStates.errorLoading;
    }
  });
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


}
