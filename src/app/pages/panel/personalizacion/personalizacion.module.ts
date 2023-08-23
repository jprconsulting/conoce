import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalizacionComponent } from './personalizacion.component';
import { PersonalizacionRoutingModule } from './personalizacion-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PersonalizacionComponent],
  imports: [CommonModule, PersonalizacionRoutingModule,SharedModule,
    ReactiveFormsModule,
    FormsModule],
})
export class PersonalizacionModule {}
