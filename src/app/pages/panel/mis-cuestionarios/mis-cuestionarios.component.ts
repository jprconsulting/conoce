import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PaginationInstance } from 'ngx-pagination';
import { FormularioAsignadoService } from 'src/app/core/services/formularioAsignado.service';
import { SecurityService } from 'src/app/core/services/security.service';
import { AsignacionFormulario } from 'src/app/models/asignacion-formulario';
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
  formulariosAsignados: AsignacionFormulario[] = [];
  itemsPerPage: number = 7;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [7, 14, 21];
  formularioUsuarioId: number | undefined;
  asignacionFilter: AsignacionFormulario[] = [];

  @ViewChild('googleFormFrame', { static: false }) googleFormFrame: ElementRef | undefined;

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
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

    const email = this.securityService.getEmail();
    console.log('email:', email);

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
    const candidatoEmail = this.securityService.getEmail();

    if (candidatoEmail) {

      this.securityService.getFormulariosAsignados(candidatoEmail).subscribe(
        (asignacionFormularios) => {
          this.formulariosAsignados = asignacionFormularios;
          console.log('Formularios Asignados:', this.formulariosAsignados);
        },
        (error) => {
          console.error('Error al obtener formularios asignados:', error);
        }
      );
    } else {
      console.log('No se encontró un correo electrónico para el candidato.');
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

  onPageChange(number: number) {
    this.configPaginator.currentPage = number;
  }
}
