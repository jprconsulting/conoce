import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mis-cuestionarios',
  templateUrl: './mis-cuestionarios.component.html',
  styleUrls: ['./mis-cuestionarios.component.css']
})
export class MisCuestionariosComponent implements OnInit {

  googleFormId: string = "1FAIpQLScKWIweNXsT0P6IHSOMuQkpr8x-Rrrfzl5hCKViq270WpB7qQ";
  googleFormUrl: SafeResourceUrl = '';

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


}
