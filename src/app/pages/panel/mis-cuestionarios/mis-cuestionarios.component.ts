import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mis-cuestionarios',
  templateUrl: './mis-cuestionarios.component.html',
  styleUrls: ['./mis-cuestionarios.component.css']
})
export class MisCuestionariosComponent {
  googleFormId: string = "1FAIpQLScKWIweNXsT0P6IHSOMuQkpr8x-Rrrfzl5hCKViq270WpB7qQ";
  googleFormUrl: SafeResourceUrl | undefined;
  formularios: { id: string, urlEdicion: string }[] = [];
  enlaceEdicion: string | null = null;
  enlaceEdicionUsuario: string = '';

  @ViewChild('googleFormFrame', { static: false }) googleFormFrame: ElementRef | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    // Usar el sanitizer para hacer que la URL sea segura
    this.googleFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://docs.google.com/forms/d/e/${this.googleFormId}/viewform?embedded=true`
    );

    // Capturar la URL actual
    this.enlaceEdicionUsuario = window.location.href;
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

  handleClick() {
    const spanElement = this.el.nativeElement.querySelector('.NPEfkd');
    console.log(spanElement);

    if (spanElement) {
      this.renderer.listen(spanElement, 'click', () => {
        console.log('spanElement');
      });
    } else {
      console.log('no existe');
    }
  }

  iniciarEdicion() {
    // Establece el enlace a la página de edición de Google Forms
    this.enlaceEdicion = 'https://docs.google.com/forms/u/0/edit';
  }
}
