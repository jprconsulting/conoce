import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RespuestasComponent } from './respuestas.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';

const routes: Routes = [
  { path: '',
  component: RespuestasComponent,
  canActivate: [AuthGuard], data: { claimType: 'CanAccessRespuestas'}
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RespuestasRoutingModule {}
