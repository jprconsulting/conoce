import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioAsignadoComponent } from './formulario-asignado.component';
import { FormularioAsignadoRoutingModule } from './formulario-asignado-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ResizeModalDirective } from 'src/app/ResizeModalDirective';

@NgModule({
  declarations: [
    FormularioAsignadoComponent,
    
  ],
  imports: [
    CommonModule,
    FormularioAsignadoRoutingModule,
    NgxPaginationModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class FormularioAsignadoModule { }
