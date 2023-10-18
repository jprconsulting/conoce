import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './panel.component';

const routes: Routes = [
  {
    path: '',
    component: PanelComponent,
    children: [
      {
        path: '', redirectTo: 'inicio', pathMatch: 'full'
      },
      {
        path: 'inicio',
        loadChildren: () => import('./inicio/inicio.module')
          .then(i => i.InicioModule)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.module')
          .then(u => u.UsuariosModule)
      },
      {
        path: 'candidatos',
        loadChildren:() => import("./candidatos/candidatos.module")
        .then(c => c.CandidatosModule)
      },
      {
        path: 'formulario',
        loadChildren:() => import("./formulario/formulario.module")
        .then(c => c.FormularioModule)
      },
      {
        path: 'personalizacion',
        loadChildren:() => import("./personalizacion/personalizacion.module")
        .then(c => c.PersonalizacionModule)
      },
      {
        path: 'faq',
        loadChildren:() => import("./faq/faq.module")
        .then(c => c.FaqModule)
      },
      {
        path: 'mis-cuestionarios',
        loadChildren: () => import('./mis-cuestionarios/mis-cuestionarios.module')
          .then(m => m.MisCuestionariosModule)
      },
      {
        path: 'faq/usuarios',
        loadChildren:() => import("./usuarios/usuarios.module")
        .then(c => c.UsuariosModule)
      },
      {
        path: 'faq/candidatos',
        loadChildren:() => import("./candidatos/candidatos.module")
        .then(c => c.CandidatosModule)
      },
      {
        path: 'faq/asignacion',
        loadChildren:() => import("./asignacion/asignacion.module")
        .then(c => c.AsignacionModule)
      },
      {
        path: 'faq/demarcaciones',
        loadChildren:() => import("./demarcaciones/demarcaciones.module")
        .then(c => c.DemarcacionesModule)
      },
      {
        path: 'asignacion',
        loadChildren:() => import("./asignacion/asignacion.module")
        .then(c => c.AsignacionModule)
      },
      {
        path: 'demarcaciones',
        loadChildren:() => import("./demarcaciones/demarcaciones.module")
        .then(c => c.DemarcacionesModule)
      },
      {
        path: 'Candidaturas',
        loadChildren:() => import("./candidaturas/candidaturas.module")
        .then(c => c.CandidaturasModule)
      },
      {
        path: 'Email',
        loadChildren:() => import("./email/email.module")
        .then(c => c.EmailModule)
      },
      {
        path: 'cargos',
        loadChildren:() => import("./cargos/cargo.module")
        .then(c => c.CargoModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
