import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioComponent } from './formulario.component';
import { FormularioRoutingModule } from './formulario-routing.module';

@NgModule({
  declarations: [FormularioComponent],
  imports: [CommonModule, FormularioRoutingModule],
})
export class FormularioModule {}
