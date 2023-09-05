import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartidosComponent } from './partidos.component';

const routes: Routes = [
  {
    path: '',
    component: PartidosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartidosRoutingModule { }
