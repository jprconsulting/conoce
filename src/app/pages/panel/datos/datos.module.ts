import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './datos.component';
import { DatosRoutingModule } from './datos-roting.module';

@NgModule({
  declarations: [
    DatosComponent
  ],
  imports: [
    CommonModule,
    DatosRoutingModule
  ]
})
export class DatosModule { }
