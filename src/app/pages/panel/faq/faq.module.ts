import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FaqComponent } from './faq.component';
import { FaqRoutingModule } from './faq-routing.module';


@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule, SharedModule, FaqRoutingModule,
  ]
})
export class FaqModule { }
