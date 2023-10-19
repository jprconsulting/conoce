import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailRoutingModule } from './email-routing.module';
import { EmailComponent } from './email.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EmailComponent
    
  ],
  imports: [
    CommonModule,
    EmailRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
  ]
})
export class EmailModule { }
