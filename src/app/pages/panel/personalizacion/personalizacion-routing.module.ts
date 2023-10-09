import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalizacionComponent } from './personalizacion.component';
import { AuthGuard } from 'src/app/core/services/auth.guard';

const routes: Routes = [
  { path: '',
  component: PersonalizacionComponent,
  canActivate: [AuthGuard], data: { claimType: 'CanAccessPersonalizacion'}
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalizacionRoutingModule {}
