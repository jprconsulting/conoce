import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsentimientosComponent } from './consentimientos.component';
const routes: Routes = [
  {
    path: '',
    component: ConsentimientosComponent,
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class ConsentimientosRoutingModule { }


