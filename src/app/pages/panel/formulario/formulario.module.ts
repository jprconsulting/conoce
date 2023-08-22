import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioComponent } from './formulario.component';
import { FormularioRoutingModule } from './formulario-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormularioComponent],
  imports: [CommonModule, FormularioRoutingModule,SharedModule,
    ReactiveFormsModule,
    FormsModule],
})
export class FormularioModule {}
