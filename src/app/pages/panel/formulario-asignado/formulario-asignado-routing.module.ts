import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioAsignadoComponent } from './formulario-asignado.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';

const routes: Routes = [
  { path: '',
  component: FormularioAsignadoComponent,
  canActivate: [AuthGuard], data: { claimType: 'CanAccessUserCuestionarios'}
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioAsignadoRoutingModule {}
