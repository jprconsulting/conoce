import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionComponent } from './asignacion.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component:
    AsignacionComponent,
    canActivate: [AuthGuard], data: { claimType: 'CanAccessAsignacionFormulario'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionRoutingModule { }
