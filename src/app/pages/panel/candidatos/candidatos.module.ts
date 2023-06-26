import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidatosRoutingModule } from './candidatos-routing.module'
import { CandidatosComponent } from './candidatos.component';


@NgModule({
  declarations: [
    CandidatosComponent
  ],
  imports: [
    CommonModule,
    CandidatosRoutingModule
  ]
})
export class CandidatosModule { }
