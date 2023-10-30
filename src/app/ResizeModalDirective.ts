import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[resizeModal]'
})
export class ResizeModalDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Accede al iframe una vez que la vista se haya inicializado
    const iframe: HTMLIFrameElement = this.el.nativeElement;

    iframe.onload = () => {
      if (iframe.contentWindow) {
        this.el.nativeElement.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
      }
    };
  }
}
