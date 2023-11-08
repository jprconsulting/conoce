import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RespuestasComponent } from './respuestas.component';
import { RespuestasRoutingModule } from './respuestas-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RespuestasComponent],
  imports: [CommonModule, RespuestasRoutingModule,SharedModule,
    ReactiveFormsModule,
    FormsModule],
})
export class RespuestasModule {}
