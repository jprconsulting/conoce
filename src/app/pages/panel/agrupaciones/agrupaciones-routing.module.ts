import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgrupacionesComponent } from './agrupaciones.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AgrupacionesComponent,
    canActivate: [AuthGuard], data: { claimType: 'CanAccessAgrupaciones'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgrupacionesRoutingModule { }

