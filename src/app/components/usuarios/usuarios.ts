import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';

import { OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuariosService } from '../../services/usuarios';
import { DescripcionesRoles, Roles } from '../../constants/Roles';
import { UsuarioRequest, UsuarioResponse } from '../../models/Usuario.models';

declare var bootstrap:any;

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit, AfterViewInit{
  usuarios: UsuarioResponse[] = [];
  textoModal: string = 'Registrar usuario';
  usuarioForm: FormGroup;
  roles: string[] = Object.values(Roles);

  @ViewChild('usuarioModalRef') usuarioModalEl!: ElementRef;
  private modalInstance!:any;

  isEditMode: boolean = false;
  selectedUsuario: UsuarioResponse | null = null;

  constructor(private cdr: ChangeDetectorRef, private fb:FormBuilder, private usuarioService: UsuariosService){
    this.usuarioForm = this.fb.group({
      username: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password: ['',[Validators.required, Validators.minLength(8)]],
      roles: [[],[Validators.required]],
    })
  }
  
  ngOnInit():void{
    this.listarUsuarios();
  }

  listarUsuarios(): void{
    this.usuarioService.getUsuarios().subscribe({
      next: resp => {
        this.usuarios = resp;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.usuarioModalEl.nativeElement, {keyboard:false});
    this.usuarioModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    })
  }

  resetForm(): void{
    this.usuarioForm.reset();
    this.isEditMode = false;
    this.usuarioForm.get('roles')?.setValue([]);
  }

  toggleForm():void{
    this.resetForm();
    this.textoModal = 'Registrar Usuario';
    this.modalInstance.show();
  }

  editarUsuario(usuario: UsuarioResponse):void{
    this.isEditMode = true;
    this.selectedUsuario = usuario;
    this.textoModal = 'Actualizando usuario: ' + usuario.username;

    this.usuarioForm.patchValue({...usuario});
    this.modalInstance.show();
  }

  transformarRol(rol:string): string {
    return DescripcionesRoles[rol as Roles] || 'Desconocido';
  }

  onSubmit():void{
    if(this.usuarioForm.invalid && this.selectedUsuario) return;

    const datosUsuario: UsuarioRequest = this.usuarioForm.value;

    if(this.isEditMode){
      //ACTUALIZANDO
    }else{
      //REGISTRANDO
      this.usuarioService.postUsuario(datosUsuario).subscribe({
        next: nuevoUsuario => {
          this.usuarios.push(nuevoUsuario);
          this.cdr.detectChanges();
          Swal.fire('Registrando', 'Usuario registrado', 'success');
          this.modalInstance.hide();
        }
      });
    }

  }

  eliminarUsuario(username: string):void{
    Swal.fire({
      title: '¿Estas seguro?',
      text: `El usuario ${username} sera eliminado permanentemente`,
      icon: 'warning',
      showCancelButton : true,
      confirmButtonText:'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed){
        this.usuarioService.deleteUsuario(username).subscribe({
          next: () => {this.usuarios.filter(u => u.username !== username);
            Swal.fire('Eliminado', `Usuario ${username} eliminado correctamente`, 'success');
          }
        });
        this.cdr.detectChanges();
      }
    });
  }
}