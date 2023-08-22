import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalizacionComponent } from './personalizacion.component';

const routes: Routes = [
  { path: '', component: PersonalizacionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalizacionRoutingModule {}
