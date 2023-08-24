import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisCuestionariosComponent } from './mis-cuestionarios.component';

const routes: Routes = [
  {
    path: '',
    component: MisCuestionariosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisCuestionariosRoutingModule { }
