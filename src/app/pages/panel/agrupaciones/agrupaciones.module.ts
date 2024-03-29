import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgrupacionesComponent } from './agrupaciones.component';
import { AgrupacionesRoutingModule } from './agrupaciones-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterByTipoCandidaturaPipe } from './filter-by-tipo-candidatura.pipe';

@NgModule({
  declarations: [
    AgrupacionesComponent,
    FilterByTipoCandidaturaPipe,
  ],
  imports: [
    CommonModule,
    AgrupacionesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxPaginationModule,
  ]
})
export class AgrupacionesModule { }