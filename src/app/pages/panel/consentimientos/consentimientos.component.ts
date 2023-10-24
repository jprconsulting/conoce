import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-consentimientos',
  templateUrl: './consentimientos.component.html',
  styleUrls: ['./consentimientos.component.css']
})
export class ConsentimientosComponent {
  ConsentimientoForm!: FormGroup;
  isModalAdd =  false;

  getCurrentDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }
  constructor(
    private formBuilder: FormBuilder
    ){
      this.creaFormularioEmail();
  }
  creaFormularioEmail(){
    this.ConsentimientoForm = this.formBuilder.group({
      id:[],
      Nombre: ['',[Validators.required,Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3)]],
      Cuerpo_correo: ['', [Validators.required]],
      Correo: ['', [Validators.required]],
      Estado: ['', [Validators.required]],
      Fechadenvio: ['', [Validators.required]],
    })
  }
}
