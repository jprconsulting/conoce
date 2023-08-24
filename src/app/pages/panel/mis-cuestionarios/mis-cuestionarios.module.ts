import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisCuestionariosComponent } from './mis-cuestionarios.component';
import { MisCuestionariosRoutingModule } from './mis-cuestionarios-routing.module';




@NgModule({
  declarations: [
    MisCuestionariosComponent
  ],
  imports: [
    CommonModule,
    MisCuestionariosRoutingModule
  ]
})
export class MisCuestionariosModule { }
