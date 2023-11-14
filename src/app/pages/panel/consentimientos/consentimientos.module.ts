import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsentimientosRoutingModule } from './consentimientos-routing.module';
import { ConsentimientosComponent } from './consentimientos.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ConsentimientosComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    ConsentimientosRoutingModule,
    NgxPaginationModule
  ]
})
export class ConsentimientosModule { }
