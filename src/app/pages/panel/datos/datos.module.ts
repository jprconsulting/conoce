import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './datos.component';
import { DatosRoutingModule } from './datos-roting.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    DatosComponent
  ],
  imports: [
    CommonModule,
    DatosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DatosModule { }
