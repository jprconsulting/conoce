import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargosComponent } from './cargos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CargosRoutingModule } from './cargo-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    CargosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CargosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxPaginationModule,
  ]
})
export class CargoModule { }
