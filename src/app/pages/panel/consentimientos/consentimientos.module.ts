import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsentimientosRoutingModule } from './consentimientos-routing.module';
import { ConsentimientosComponent } from './consentimientos.component';


@NgModule({
  declarations: [
    ConsentimientosComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    ConsentimientosRoutingModule
  ]
})
export class ConsentimientosModule { }
