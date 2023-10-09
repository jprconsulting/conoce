import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemarcacionesComponent } from './demarcaciones.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DemarcacionesComponent,
    canActivate: [AuthGuard], data: { claimType: 'CanAccessDemarcaciones'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemarcacionesRoutingModule { }
