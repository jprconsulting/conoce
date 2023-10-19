import { Component} from '@angular/core';
import { FormGroup, NgModel,  } from '@angular/forms';
import {FormBuilder, Validators } from '@angular/forms';
import { EmailService } from 'src/app/core/services/email.servicio';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { Email } from 'src/app/models/Email';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {
  emails: Email[] = [];
  emailFilter: Email[] = [];
EmailsForm!:FormGroup;
EmailsForm2!:FormGroup;
isModalAdd = false;
Visivility = false;
mostrarElemento = false;
mostrarElemento1 = false;
email!: Email;
isModalVisible = false;

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
  
}
crearFormularioEmail() {
  this.EmailsForm = this.formBuilder.group({
    EmailOrigen: ['',[Validators.required,Validators.email]],
    Contraseña: ['', [Validators.required]],
    NombreUsuario: ['',[ Validators.required,Validators.pattern('^[a-zA-Z ]+$')]],
    ServidorOrigen: ['', [Validators.required]],
    PuertoOrigen: ['', [Validators.required,Validators.pattern('^[0-9]+$')]],
  });
}
crearFormularioEmail2() {
  this.EmailsForm2 = this.formBuilder.group({
    EmailDestino: ['',[Validators.required,Validators.email]],
    Mensaje: ['', [Validators.required]]
  });
}

Validation(){
  this.isModalAdd = true;
}
ResetForm(){
  this.EmailsForm.reset();
  this.EmailsForm2.reset();
}
agregarEmail() {
  this.EmailService.postEmail(this.email).subscribe({
    next: () => {
      this.mensajeService.mensajeExito("éxito");
      this.ResetForm();
    },
    error: (error) => {
      this.mensajeService.mensajeError("Error");
      console.error(error);
    }
  }
  );
}
getEmails() {
  this.EmailService.getEmail().subscribe(
    (email: Email[]) => {
      this.emails = email; // Asigna el array de partidos a la propiedad 'partidos'
      console.log('Partidos obtenidos:', this.emails);
    },
    (error) => {
      console.error('Error al obtener partidos:', error);
    }
  );
}
abrirModal(){
  this.isModalVisible = true; // Cuando se llama, mostramos el modal
}

}
