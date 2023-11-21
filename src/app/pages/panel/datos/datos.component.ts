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
  Result: any; 
  isChecked: boolean = false;
  check: Date;
  textoSeguro!: SafeHtml;
  usuario!: Usuario;
  aceptacion: Aceptacion | null = null;
  constructor(
    private route: ActivatedRoute,
    private consentimientoService: ConsentimientoService,
    private formBuilder: FormBuilder,
    private mensajeService: MensajeService,
    private sanitizer: DomSanitizer,
    private securityService: SecurityService,
    private usuarioService: UsuarioService,
    private aceptacionService: AceptacionService
  ) {
    this.check = new Date();
    this.creaFormulario();
    
  }
  
  ngOnInit() {    
    this.obtenerConsentimiento();
    this.obtenerUsuarioPorId();
    this.obtener();
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
            this.result = result;
            this.usuario = {
              usuarioId: this.result.usuario.usuarioId,
              rolId: this.result.usuario.rolId,
              rol: this.result.usuario.rol,
              email: this.result.usuario.email,
              password: this.result.usuario.password,
              estatus: this.result.usuario.estatus,
              nombre: this.result.usuario.nombre,
              apellidos: this.result.usuario.apellidoss,
            };
  
            // Llamar a la otra función aquí después de obtener los datos
            this.obtener();
          },
          error => {
            console.error('Error al obtener usuario por ID:', error);
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
  
  
 

  Aceptar() {
    this.aceptacion;
  if(this.aceptacion){
    this.aceptacion.fechaaceptacion = new Date();
        this.aceptacionService.putAceptacion(this.aceptacion).subscribe({
          next: () => {
            console.log('Datos de aceptación antes de la actualización:', this.aceptacion);
            setTimeout(() => {
              console.log('Datos de aceptación después de la actualización:', this.aceptacion);
              window.location.href = 'http://localhost:4200/login';
            }, 9000);
          },
          error: (error) => {
            this.mensajeService.mensajeError('Error al aceptar');
            console.error(error);
          }
        });
        console.log('dcuhdci');
      }
    
  }
  
  creaFormulario(){
    this.ConsentimientoForm3 = this.formBuilder.group({
      fechaaceptacion: ['', [Validators.required]],
      id: [null],
      nombreC: [null],
      idCandidato:[null],
      nombre: [null],
      apat:[null],
      amat: [null],
      email: [null],
      fechadenvio: [null],
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
    obtener() {
      console.log(this.result);
      console.log('Usuario email:', this.usuario.email);
      console.log('Usuario email2:', this.usuario.email);
      const email = this.usuario.email;
      this.route.paramMap.subscribe(params => {
        if (email) {
          console.log('Captured email:', email);
          this.aceptacionService.getAceptacionPorEmail(email).subscribe(
            (aceptacionResultado: Aceptacion) => {
              // Cambia 'this.result' por otro nombre de variable, por ejemplo, 'aceptacionResultado'
              this.Result = aceptacionResultado;
              this.aceptacion = {
                id: this.Result.aceptacion.id,
                nombre: this.Result.aceptacion.nombre,
                nombreC:  this.Result.aceptacion.nombreC,
                idCandidato:  this.Result.aceptacion.idCandidato,
                apat:  this.Result.aceptacion.apat,
                amat:  this.Result.aceptacion.amat,
                email: this.Result.aceptacion.email,
                fechadenvio: this.Result.aceptacion.fechadenvio,
                fechaaceptacion: new Date()
              };
              console.log('cudnc', this.aceptacion);
              console.log('cudnc2', this.Result);
            },
            error => {
              console.error('Error al obtener los datos:', error);
            }
          );
        } else {
          console.log('ID parameter not found in the URL');
        }
      }); 
    }
    

    
  }



