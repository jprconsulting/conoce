import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/core/services/security.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-formulario-asignado',
  templateUrl: './formulario-asignado.component.html',
  styleUrls: ['./formulario-asignado.component.css']
})
export class FormularioAsignadoComponent implements OnInit {
  formulariosAsignados: any[] = [];
  formularioId: number = 0;
  usuariosConFormulario: any[] = [];
  googleFormUrl: SafeResourceUrl | undefined;

  constructor(
    private securityService: SecurityService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.mostrarFormulariosAsignados();
  }

  mostrarFormulariosAsignados() {
    const formulariosAsignados = this.securityService.getFormulariosAsignados();
    if (formulariosAsignados) {
      this.formulariosAsignados = formulariosAsignados;
      console.log('Formularios Asignados:', this.formulariosAsignados);
    } else {
      console.log('No se encontraron formularios asignados.');
    }
  }

  cargarUsuariosConFormulario() {
    if (this.formularioId === 0) {
      return;
    }

    this.securityService.getUsuariosConFormulario(this.formularioId).subscribe(
      (data: any[]) => {
        this.usuariosConFormulario = data;
        console.log('Usuarios con el formulario seleccionado:', this.usuariosConFormulario);
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
        this.usuariosConFormulario = [];
      }
    );
  }

  handleClick(formulario: any) {
    console.log('Formulario seleccionado:', formulario);
    console.log('formularioUsuarioId seleccionado:', formulario.formularioUsuarioId);

    // Configura la URL del formulario de Google con el ID del formulario
    this.googleFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://docs.google.com/forms/d/e/${formulario.googleFormId}/viewform?embedded=true`);
  }
}
