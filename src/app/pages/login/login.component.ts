import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { SecurityService } from 'src/app/core/services/security.service';
import { AppUser, AppUserAuth } from 'src/app/models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formUserLogin!: FormGroup;
  user!: AppUser;
  returnUrl = 'panel/inicio';


  constructor(
    private securityService: SecurityService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private mensajeService: MensajeService,

  ) { }

  ngOnInit(): void {
    this.createFormUserLogin();
  }

  login() {
    this.user = this.formUserLogin.value as AppUser;
    this.spinnerService.show();
    this.securityService.login(this.user).subscribe({
      next: () => {
        setTimeout(() => {
          this.spinnerService.hide();
          this.router.navigateByUrl(this.returnUrl);
        }, 500);
      },
      error: (error) => {
        this.mensajeService.mensajeError(error);
        this.spinnerService.hide();
      }
    });
  }


  createFormUserLogin() {
    this.formUserLogin = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required, Validators.minLength(3)
      ])],
      password: ['', Validators.compose([
        Validators.required, Validators.minLength(3)
      ])]
    });
  }




}
