import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { LoadingStates } from 'src/app/global/globals';
import { Usuario } from 'src/app/models/usuario';
import { Rol } from 'src/app/models/Rol';
import { PaginationInstance } from 'ngx-pagination';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  @ViewChild('closebutton') closebutton!: ElementRef;

  // Usuarios
  usuario!: Usuario;
  usuarios: Usuario[] = [];
  isLoadingUsers = LoadingStates.neutro;
  usuariosFilter: Usuario[] = [];
  userForm!: FormGroup;
  id!: number;
  roles: Rol[] = [];
  isModalAdd = false;
  itemsPerPage: number = 2;
  currentPage: number = 1;
  itemsPerPageOptions: number[] = [2, 3, 6];
  filtro: string = '';
  verdadero = "Activo";
  falso = "Inactivo";
  estatusBtn = true;
  estatusTag = this.verdadero;

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private usuarioService: UsuarioService,
    private mensajeService: MensajeService,
    private spinnerService: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) {
    this.crearFormularioUsuario();
  }

  ngOnInit(): void {
    this.usuarioService.refreshLisUsers.subscribe(() => this.getListadoUsuarios());
    this.getListadoUsuarios();
    this.getRoles();
  }

  crearFormularioUsuario() {
    this.userForm = this.formBuilder.group({
      Id: [null],
      rol: [null, Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[0-9]/),
        ],
      ],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^([a-zA-ZÀ-ÿ\u00C0-\u00FF]{2})[a-zA-ZÀ-ÿ\u00C0-\u00FF ]+$/)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^([a-zA-ZÀ-ÿ\u00C0-\u00FF]{2})[a-zA-ZÀ-ÿ\u00C0-\u00FF ]+$/)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^([a-zA-ZÀ-ÿ\u00C0-\u00FF]{2})[a-zA-ZÀ-ÿ\u00C0-\u00FF ]+$/)]],
      estatus: [this.estatusBtn],
    });
  }

  getListadoUsuarios() {
    this.isLoadingUsers = LoadingStates.trueLoading;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuariosFromApi) => {
        this.usuarios = usuariosFromApi;
        this.usuariosFilter = this.usuarios;
        this.isLoadingUsers = LoadingStates.falseLoading;
      }, error: () => {
        this.isLoadingUsers = LoadingStates.errorLoading;
      }
    });
  }

  getRoles() {
    this.usuarioService.getRoles().subscribe({
      next: (rolesFromAPI) => {
        this.roles = rolesFromAPI;
      },
      error: (error) => {
        console.log('error al obtener los roles', error);
      }
    });
  }
  setEstatus() {
    this.estatusTag = this.estatusBtn ? this.verdadero : this.falso;
  }

  resetForm() {
    this.closebutton.nativeElement.click();
    this.userForm.reset();
  }

  agregarUsuario() {
    if (this.userForm.valid) {
      const nuevoUsuario = { ...this.userForm.value };

      delete nuevoUsuario.Id;
      this.usuario = this.userForm.value as Usuario;
      const rol = this.userForm.get('rol')?.value;
      nuevoUsuario.rol = { id: rol } as Rol;
      const nombreUsuarioExistente = this.usuarios.some(u => u.nombres === nuevoUsuario.nombres);
      const apellidosUsuarioExistente = this.usuarios.some(u => u.apellidoPaterno === nuevoUsuario.apellidoPaterno);
      const correoExistente = this.usuarios.some(u => u.correo === nuevoUsuario.correo);
      console.log(this.userForm.value);
      if (nombreUsuarioExistente) {
        console.error('Ya existe un usuario con este nombre de usuario.');
        this.mensajeService.mensajeError('Ya existe un usuario con este nombre de usuario.');
      } else if (correoExistente) {
        console.error('Ya existe un usuario con este correo electrónico.');
        this.mensajeService.mensajeError('Ya existe un usuario con este correo electrónico.');
      } else {
        this.usuarioService.postUsuario(nuevoUsuario).subscribe({
          next: () => {
            console.log('Usuario agregado con éxito:', nuevoUsuario);
            this.mensajeService.mensajeExito('Usuario agregado con éxito');
            this.resetForm();
            this.getListadoUsuarios();
            this.usuarios.push(nuevoUsuario);
          },
          error: (error) => {
            console.error('Error al agregar usuario:', error);
            this.mensajeService.mensajeError('Error al agregar usuario');
          }
        });
      }
    } else {
      console.error('El formulario de usuario es inválido. No se puede enviar.');
      this.mensajeService.mensajeError('Formulario de usuario inválido. Revise los campos.');
    }
  }


  actualizarUsuario() {
    this.usuario = this.userForm.value as Usuario;
    const rol = this.userForm.get('rol')?.value;
    this.usuario.rol = { id: rol } as Rol;
    this.usuarioService.putUsuario(this.id, this.usuario).subscribe({
      next: () => {
        this.mensajeService.mensajeExito("Usuario actualizado con éxito");
        this.getListadoUsuarios();
        this.resetForm();
      },
      error: (error) => {
        this.mensajeService.mensajeError("Error al actualizar usuario");
        console.error(error);
      }
    }
    );
  }

  submitUsuario() {
    this.usuario = this.userForm.value as Usuario;
    this.isModalAdd ? this.agregarUsuario() : this.actualizarUsuario();
  }
  onPageChange(number: number) {
    this.configPaginator.currentPage = number;
  }

  borrarUsuario(id: number, nombreUsuario: string) {
    this.mensajeService.mensajeAdvertencia(
      `¿Estás seguro de eliminar el usuario: ${nombreUsuario}?`,
      () => {
        this.usuarioService.deleteUsuario(id).subscribe({
          next: () => {
            this.mensajeService.mensajeExito('Usuario borrado correctamente');
            this.configPaginator.currentPage = 1;
            this.getListadoUsuarios();
            //this.ConfigPaginator.currentPage = 1;
          },
          error: (error) => this.mensajeService.mensajeError(error)
        });
      }
    );
    this.getListadoUsuarios();
  }

  handleChangeAdd() {
    if (this.userForm) {
      this.userForm.reset();
      const estatusControl = this.userForm.get('estatus');
      if (estatusControl) {
        estatusControl.setValue(true);
      }
      this.isModalAdd = true;
    }
  }

  setDataModalUpdate(user: Usuario) {
    this.id = user.id;
    this.isModalAdd = false;
    this.userForm.patchValue({
      Id: user.id,
      rol: user.rol.id,
      correo: user.correo,
      password: user.password,
      nombres: user.nombres,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
      estatus: user.estatus,
    });
    console.log(this.userForm.value);
  }

  filtrarResultados() {
    const filtroLowerCase = this.filtro.toLowerCase().trim();

    return this.usuarios.filter(usuario =>
      usuario.nombres.toLowerCase().includes(filtroLowerCase) ||
      usuario.apellidoPaterno.toLowerCase().includes(filtroLowerCase) ||
      usuario.apellidoMaterno.toLowerCase().includes(filtroLowerCase) ||
      usuario.correo.toLowerCase().includes(filtroLowerCase) ||
      usuario.rol.nombreRol.toLowerCase().includes(filtroLowerCase)
    );
  }
  exportarDatosAExcel() {
    if (this.usuarios.length === 0) {
      console.warn('La lista de usuarios está vacía. No se puede exportar.');
      return;
    }

    const datosParaExportar = this.usuarios.map(usuario => {
      const estatus = usuario.estatus ? 'Activo' : 'Inactivo';
      return {
        'Id': usuario.id,
        'Nombre': usuario.nombres,
        'Apellido paterno': usuario.apellidoMaterno,
        'Apellido materno': usuario.apellidoMaterno,
        'Correo': usuario.correo,
        'Rol': usuario.rol.nombreRol,
        'Estatus': estatus,
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExportar);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.guardarArchivoExcel(excelBuffer, 'usuarios.xlsx');
  }
  guardarArchivoExcel(buffer: any, nombreArchivo: string) {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
