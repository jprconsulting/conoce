import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemarcacionesComponent } from './demarcaciones.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DemarcacionesRoutingModule } from './demarcaciones-rouing.module';



@NgModule({
  declarations: [
    DemarcacionesComponent
  ],
  imports: [
    CommonModule, SharedModule, DemarcacionesRoutingModule,
  ]
})
export class DemarcacionesModule { }
