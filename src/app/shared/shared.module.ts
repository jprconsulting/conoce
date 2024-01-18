import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentComponent } from './components/content/content.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FooterComponent } from './components/footer/footer.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { HasClaimDirective } from './directives/has-claim.directive';
import { PageHeaderComponent } from './components/page-header/page-header.component';

@NgModule({
  declarations: [
    ContentComponent,
    HeaderComponent,
    SidebarComponent,
    NotFoundComponent,
    FooterComponent,
    NoResultsComponent,
    HasClaimDirective,
    PageHeaderComponent
  ],
  exports: [
    ContentComponent,
    HeaderComponent,
    SidebarComponent,
    NotFoundComponent,
    FooterComponent,
    NoResultsComponent,
    HasClaimDirective,
    PageHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
