import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { PanelComponent } from './panel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpInterceptorModule } from 'src/app/core/services/http-interceptor.module';


@NgModule({
  declarations: [
    PanelComponent,
  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    SharedModule,
    HttpInterceptorModule
  ]
})
export class PanelModule { }
