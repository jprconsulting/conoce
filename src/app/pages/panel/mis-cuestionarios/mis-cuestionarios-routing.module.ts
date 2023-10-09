import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisCuestionariosComponent } from './mis-cuestionarios.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component:
    MisCuestionariosComponent,
    canActivate: [AuthGuard], data: { claimType: 'CanAccessMisCuestionarios'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisCuestionariosRoutingModule { }
