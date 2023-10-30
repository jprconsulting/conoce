import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormularioAsignadoService } from 'src/app/core/services/formularioAsignado.service';
import { SecurityService } from 'src/app/core/services/security.service';
import { FormulariosAsignados } from 'src/app/models/login';

@Component({
  selector: 'app-mis-cuestionarios',
  templateUrl: './mis-cuestionarios.component.html',
  styleUrls: ['./mis-cuestionarios.component.css']
})
export class MisCuestionariosComponent {
  googleFormId: SafeResourceUrl | undefined;
  googleFormUrl: SafeResourceUrl | undefined;
  formularios: { id: string, urlEdicion: string }[] = [];
  enlaceEdicion: string | null = null;
  enlaceEdicionUsuario: string = '';
  formulariosAsignados: FormulariosAsignados[] = [];
  itemsPerPage: number = 7;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [7, 14, 21];
  formularioUsuarioId: number | undefined;

  @ViewChild('googleFormFrame', { static: false }) googleFormFrame: ElementRef | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private renderer: Renderer2,
    private securityService: SecurityService,
    private formularioService: FormularioAsignadoService
  ) { }

  ngOnInit() {
    // Capturar la URL actual
    this.enlaceEdicionUsuario = window.location.href;

    // Obtener el userId del servicio y mostrarlo en el console.log
    const usuarioId = this.securityService.getUsuarioId();
    console.log('UsuarioId:', usuarioId);

    // Obtener formularios asignados
    this.mostrarFormulariosAsignados();
  }

  ngAfterViewInit() {
    const iframeElement = this.googleFormFrame?.nativeElement;
    if (iframeElement) {
      iframeElement.addEventListener('load', () => {
        this.onIframeLoad();
      });
    }
  }

  onIframeLoad() {
    const iframe = this.googleFormFrame?.nativeElement;
    const iframeContent = iframe?.contentWindow?.document;

    // Ahora puedes buscar y manipular elementos dentro del iframe
    if (iframeContent) {
      const spanElement = iframeContent.querySelector('span');

      if (spanElement) {
        // El span se encontró dentro del iframe
        console.log('El span dentro del iframe está en el DOM');
      } else {
        // El span no se encontró dentro del iframe
        console.log('El span dentro del iframe aún no está en el DOM');
      }
    }
  }

  handleClick(formulario: FormulariosAsignados) {
    console.log('Formulario seleccionado:', formulario);
    console.log('formularioUsuarioId seleccionado:', formulario.formularioUsuarioId); // Agregar esta línea

    // Aquí puedes configurar la URL del iframe con el ID del formulario
    this.googleFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://docs.google.com/forms/d/e/${formulario.googleFormId}/viewform?embedded=true`);
  }



  iniciarEdicion() {
    // Establece el enlace a la página de edición de Google Forms
    this.enlaceEdicion = 'https://docs.google.com/forms/u/0/edit';
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

  openGoogleFormModal(googleFormId: string) {
    this.googleFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://docs.google.com/forms/d/e/${googleFormId}/viewform?embedded=true`
    );
    console.log('Valor de googleFormUrl:', this.googleFormUrl);
  }

  cambiarEstatusFormulario(formularioUsuarioId: number) {
    this.formularioService.cambiarEstatusFormulario(formularioUsuarioId).subscribe(
      (response) => {
        console.log('Estado del formulario actualizado con éxito', response);
        // Actualiza el estado en tu componente si es necesario
      },
      (error) => {
        console.error('Error al actualizar el estado del formulario', error);
        // Maneja el error según tus necesidades
      }
    );
  }

}
