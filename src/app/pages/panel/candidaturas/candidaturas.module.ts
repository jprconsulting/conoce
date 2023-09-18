import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidaturasRoutingModule } from './candidaturas-routing.module';
import { CandidaturasComponent } from './candidaturas.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    CandidaturasComponent
  ],
  imports: [
    CommonModule,
    CandidaturasRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgSelectModule,
  ]
})
export class CandidaturasModule { }
