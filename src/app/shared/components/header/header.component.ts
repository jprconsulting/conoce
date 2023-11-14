import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/core/services/security.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  nombre!: string|null;

  constructor(
    private securityService: SecurityService, 
    private router: Router
  ) {  }  

  ngOnInit() {
    this.nombre = this.securityService.getNombre();
    console.log('Nombre:', this.nombre);
  }

  logout() {
    this.securityService.logout();
    this.router.navigateByUrl('');
  }



}
