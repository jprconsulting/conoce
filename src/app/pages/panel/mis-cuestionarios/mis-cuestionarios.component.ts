import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mis-cuestionarios',
  templateUrl: './mis-cuestionarios.component.html',
  styleUrls: ['./mis-cuestionarios.component.css']
})
export class MisCuestionariosComponent implements OnInit, AfterViewInit {
  googleFormId: string = "1FAIpQLScKWIweNXsT0P6IHSOMuQkpr8x-Rrrfzl5hCKViq270WpB7qQ";
  googleFormUrl: SafeResourceUrl = '';

  @ViewChild('googleFormFrame', { static: false }) googleFormFrame: ElementRef | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    // Usar el sanitizer para hacer que la URL sea segura
    this.googleFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://docs.google.com/forms/d/e/${this.googleFormId}/viewform?embedded=true`
    );
  }

  ngAfterViewInit() {
    // Espera un breve tiempo para asegurarte de que el DOM se ha renderizado completamente.
    setTimeout(() => {
      const iframeElement = this.googleFormFrame?.nativeElement;
      if (iframeElement) {
        // El iframe se ha cargado, ahora puedes buscar el elemento de envío
        const submitButton = iframeElement.contentDocument.querySelector('.Uc2NEf');

        if (submitButton) {
          // El botón de envío está en el iframe, puedes realizar acciones aquí
          console.log('El botón de envío está en el iframe');
        } else {
          console.log('El botón de envío no está en el iframe');
        }
      } else {
        console.log('googleFormFrame es undefined');
      }
    });
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


    this.buscarElementoUc2NEf();
  }

  buscarElementoUc2NEf() {
    setTimeout(() => {
      const divElement = this.el.nativeElement.querySelector('.Uc2NEf');
      if (divElement) {
        console.log('El div con la clase Uc2NEf está en el DOM');
      } else {
        console.log('El div con la clase Uc2NEf aún no está en el DOM');
      }
    });
  }
}
