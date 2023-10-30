import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {FormBuilder, Validators } from '@angular/forms';
import { Subject} from 'rxjs';
import { EmailService } from 'src/app/core/services/email.servicio';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { LoadingStates } from 'src/app/global/globals';
import { Email } from 'src/app/models/Email';
import { Mensaje } from 'src/app/models/Mensaje';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {
  emails: Email[] = [];
  emailsFilter: Email[] = [];
  email!: Email;
  mensajeFilter: Mensaje[] = [];
  mensaje!: Mensaje;
EmailsForm!:FormGroup;
EmailsForm2!:FormGroup;
isLoadingEmails = LoadingStates.neutro;
isModalAdd = false;
Visivility = false;
mostrarElemento = false;
mostrarElemento1 = false;
selectedEmail: Email | null = null;
formData: any;
isModalVisible = false;
private _refreshLisemail$ = new Subject<Email | null>();
route = `${environment.apiUrl}/correo`;

  mostrar() {
    this.mostrarElemento = !this.mostrarElemento;
  }
  mostrar1() {
    this.mostrarElemento1 = !this.mostrarElemento1;
  }
constructor(
  private formBuilder: FormBuilder,
  private EmailService: EmailService,
  private mensajeService: MensajeService,
    ) {
  this.crearFormularioEmail();
  this.crearFormularioEmail2();
  this.agregaraEmail();

}
ngOnInit(): void {
  this.EmailService.refreshLisEmail.subscribe(() => this.getEmails());
  this.getEmails();
}
crearFormularioEmail() {
  this.EmailsForm = this.formBuilder.group({
    id:[],
    EmailOrigen: ['',[Validators.required,Validators.email]],
    Contraseña: ['', [Validators.required, Validators.minLength(8)]],
    NombreUsuario: ['',[ Validators.required,Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3)]],
    ServidorOrigen: ['', [Validators.required]],
    PuertoOrigen: ['', [Validators.required,Validators.pattern('^[0-9]+$'),Validators.minLength(2)]],
    credenciales:[ , [Validators.required]],
    confiarCertificado:[ , [Validators.required]],
    PerfilCorreo: ['',[ Validators.required,Validators.pattern('^[a-zA-Z ]+$'),Validators.minLength(2)]]

  });
}
crearFormularioEmail2() {
  this.EmailsForm2 = this.formBuilder.group({
    EmailDestino: ['',[Validators.required,Validators.email]],
    Mensaje: ['', [Validators.required]]
  });
}


ResetForm(){
  this.EmailsForm.reset();
  this.EmailsForm2.reset();
}

getEmails() {
    this.isLoadingEmails = LoadingStates.trueLoading;
    this.EmailService.getEmail().subscribe({
      next: (emailFromApi) => {
        this.emails = emailFromApi;
        this.emailsFilter = this.emails;
        this.isLoadingEmails = LoadingStates.falseLoading;
      }, error: () => {
        this.isLoadingEmails = LoadingStates.errorLoading;
      }
    });

  }



actualizarEmail() {
  this.email = this.EmailsForm.value as Email;
  this.EmailService.putEmail(this.email).subscribe({
    next: () => {
      this.mensajeService.mensajeExito("Correo actualizado con éxito");
      this.ResetForm();
      console.log(this.email);
    },
    error: (error) => {
      this.mensajeService.mensajeError("Error al actualizar correo");
      console.error(error);
      console.log(this.email);
    }
  });
}
agregaraEmail() {
  if (this.EmailsForm.valid) {
    const emailSinId = { ...this.EmailsForm.value };
    delete emailSinId.id;

    this.EmailService.postEmail(emailSinId).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Email configurado con éxito");
        this.ResetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al crear email");
        console.error(error);
      }
    });
  }
}

submitEmail(){
  
  this.isModalAdd ? this.agregaraEmail() : this.actualizarEmail();
}


enviarEmail(id: number, EmailDestino: string, Mensaje: string) {
  const id3 = this.formData.id;
  this.EmailService.enviarEmail(id3, EmailDestino, Mensaje).subscribe({
    next: () => {
        this.mensajeService.mensajeExito('Email enviado');  
    },
    error: (error) => {
      if (error && error.message) {
        const mensajeError = error.message;
        if (mensajeError.includes("The SMTP server requires a secure connection or the client was not authenticated. The server response was: 5.7.0 Authentication Required")) {
          this.mensajeService.mensajeError('El servidor SMTP requiere una conexión segura o el cliente no ha sido autenticado. Respuesta del servidor: 5.7.0 Autenticación requerida.');
        } else {
          this.mensajeService.mensajeError('Error en el puerto');
        }
      }
      console.error('Error en el puerto');
      this.mensajeService.mensajeError('Error inesperado');
      // Aquí puedes manejar el error o mostrar un mensaje al usuario
    }
  });
}


borrarEmail(id: number, Email: string) {
  this.mensajeService.mensajeAdvertencia(
    `¿Estás seguro de eliminar el email: ${Email}?`,
    () => {
      this.EmailService.deleteEmail(id).subscribe({
        next: () => {
          this.mensajeService.mensajeExito('Email borrado correctamente');
          this.getEmails();
        },
        error: (error) => this.mensajeService.mensajeError(error)
      });
    }
  );
}
handleChangeAdd() {
  this.EmailsForm.reset();
  this.isModalAdd = true;
}
setDataModalUpdate(email: Email) {
  this.isModalAdd = false;
  this.EmailsForm.patchValue({
    id: email.id,
    EmailOrigen: email.emailOrigen,
    Contraseña: email.contraseña,
    NombreUsuario: email.nombreUsuario,
    ServidorOrigen: email.servidorOrigen,
    PuertoOrigen: email.puertoOrigen,
    credenciales: email.credenciales,
    confiarCertificado: email.confiarCertificado,
    PerfilCorreo: email.perfilCorreo,
  });
  this.formData = this.EmailsForm.value;
  console.log(this.EmailsForm.value);
}
}
