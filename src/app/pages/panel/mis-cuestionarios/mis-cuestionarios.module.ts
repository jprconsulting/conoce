import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisCuestionariosComponent } from './mis-cuestionarios.component';
import { MisCuestionariosRoutingModule } from './mis-cuestionarios-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    MisCuestionariosComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MisCuestionariosRoutingModule,
    NgxPaginationModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class MisCuestionariosModule { }
