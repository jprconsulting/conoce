import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioComponent } from './formulario.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';

const routes: Routes = [
  { path: '',
  component: FormularioComponent,
  canActivate: [AuthGuard], data: { claimType: 'CanAccessFormularios'}
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioRoutingModule {}
