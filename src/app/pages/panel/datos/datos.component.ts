import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Consentimiento } from 'src/app/models/consentimientos';
import { ConsentimientoService } from 'src/app/core/services/consentimientos.service';
import { SecurityService } from 'src/app/core/services/security.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingStates } from 'src/app/global/globals';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { AceptacionService } from 'src/app/core/services/aceptacion.service';
import { Aceptacion } from 'src/app/models/aceptacion';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})
export class DatosComponent {
  isLoadingConsentimiento = LoadingStates.trueLoading;
  consentimiento: Consentimiento | null = null;
  consentimientos!: Consentimiento;
  ConsentimientoForm3!: FormGroup;
  result: any; 
  isChecked: boolean = false;
  check: Date;
  textoSeguro!: SafeHtml;
  usuario!: Usuario;
  constructor(
    private route: ActivatedRoute,
    private consentimientoService: ConsentimientoService,
    private formBuilder: FormBuilder,
    private mensajeService: MensajeService,
    private sanitizer: DomSanitizer,
    private securityService: SecurityService,
    private usuarioService: UsuarioService
  ) {
    this.check = new Date();
    this.creaFormulario();
    
  }
  
  ngOnInit() {
    
    this.obtenerConsentimiento();
    this.obtenerUsuarioPorId();
  }
  obtenerUsuarioPorId() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = this.securityService.getUsuarioId();
      console.log('id', id);
      if (id) {
        const id2 = +id;
        this.usuarioService.getPorId(id).subscribe(
          (result: Usuario) => {
            this.result = result; // Asigna el objeto de usuario a la propiedad this.usuario
            this.usuario = {
              usuarioId: this.result.usuario.usuarioId,
              rolId:this.result.usuario.rolId,
              rol: this.result.usuario.rol,
              email: this.result.usuario.email,
              password: this.result.usuario.password,
              estatus:this.result.usuario.estatus,
              nombre: this.result.usuario.nombre,
              apellidos: this.result.usuario.apellidoss,
            }; 
            console.log(this.result);
            console.log('Nombre del usuario:', this.usuario.nombre);

          },
          error => {
            console.error('Error al obtener el usuario por ID:', error);
          }
        );
      } else {
        console.log('ID parameter not found in the URL');
      }
    });
  }
  
  obtenerConsentimiento() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = +idParam;
        console.log('Captured ID:', id);
        this.consentimientoService.getConsentimientoPorId(id).subscribe(
          (result: Consentimiento) => {
            this.result = result; // Asegúrate de que el objeto result tenga una propiedad "consentimiento".
            console.log('Resultado:', this.result);
  
            this.consentimiento = {
              id: this.result.consentimiento.id,
              nombre: this.result.consentimiento.nombre,
              cuerpocorreo: this.result.consentimiento.cuerpocorreo,
              email: this.result.consentimiento.email,
              estado: this.result.consentimiento.estado,
              fechadenvio: this.result.consentimiento.fechadenvio,
              fechaaceptacion: new Date()
            };
            this.textoSeguro = this.sanitizer.bypassSecurityTrustHtml(this.result.consentimiento.cuerpocorreo); // Asigna el contenido HTML seguro
            
            this.isLoadingConsentimiento = LoadingStates.falseLoading;
          },
          error => {
            console.error('Error al obtener los datos:', error);
            this.isLoadingConsentimiento = LoadingStates.errorLoading;
          }
        );
      } else {
        console.log('ID parameter not found in the URL');
        this.isLoadingConsentimiento = LoadingStates.falseLoading;
      }
    });
    
  }
  creaFormulario(){
    this.ConsentimientoForm3 = this.formBuilder.group({
      fechaaceptacion: ['', [Validators.required]],
    })
  }
  actualizarFechaAceptacion() {
    if (this.consentimiento) {
      // Verifica que 'this.consentimiento' no sea undefined
      this.consentimiento.fechaaceptacion = new Date(); // Asegúrate de usar el nombre correcto de la propiedad
  
      this.consentimientoService.putConsentimiento(this.consentimiento).subscribe({
        next: () => {
          this.mensajeService.mensajeExito('Aceptación enviada');
          setTimeout(() => {
            console.log(this.consentimiento);
            window.location.href = 'http://localhost:4200/login';
          }, 3000);
        },
        error: (error) => {
          this.mensajeService.mensajeError("Error al aceptar");
          console.error(error);
          console.log(this.consentimiento);
        }
      });
      this.mensajeService.mensajeExito('Apectacion enviada');
    }
  }
  
    onCheckboxChange() {
      if (this.isChecked) {
        console.log("Fecha actual:", this.check);
        
      }
    }


    
  }



