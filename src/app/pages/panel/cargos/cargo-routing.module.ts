import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargosComponent } from './cargos.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CargosComponent,
    canActivate: [AuthGuard], data: { claimType: 'CanAccessCargos'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargosRoutingModule { }
