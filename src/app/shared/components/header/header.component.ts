import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/core/services/security.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private securityService: SecurityService, 
    private router: Router
  ) {  }  

  logout() {
    this.securityService.logout();
    this.router.navigateByUrl('');
  }


}
