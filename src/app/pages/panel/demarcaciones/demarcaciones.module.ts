import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemarcacionesComponent } from './demarcaciones.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DemarcacionesRoutingModule } from './demarcaciones-rouing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    DemarcacionesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DemarcacionesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
  ],

    exports: [
      DemarcacionesComponent
    ]
})
export class DemarcacionesModule { }
