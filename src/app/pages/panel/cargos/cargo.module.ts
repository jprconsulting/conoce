import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargosComponent } from './cargos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CargosRoutingModule } from './cargo-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


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
  ]
})
export class CargoModule { }
