import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/core/services/security.service';
import { AppUserAuth } from 'src/app/models/login';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  dataObject!: AppUserAuth | null;
  nombreCompleto: string | null = null;
  nombreRol: string | null = null;

  constructor(private securityService: SecurityService) {}

  ngOnInit() {
    this.setDataUser();
  }

  setDataUser() {
    this.dataObject = this.securityService.getDataUser();
    this.nombreCompleto = this.dataObject?.nombreCompleto ?? null;
    this.nombreRol = this.dataObject?.rol ?? null;

    console.log('DataObject:', this.dataObject);
    console.log('Nombre Completo:', this.nombreCompleto);
    console.log('Nombre rol:', this.nombreRol);
  }
}
