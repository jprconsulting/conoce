import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargosComponent } from './cargos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CargosRoutingModule } from './cargo-routing.module'


@NgModule({
  declarations: [
    CargosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CargosRoutingModule
  ]
})
export class CargoModule { }
