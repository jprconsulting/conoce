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

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
