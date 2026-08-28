import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HuespedesService } from '../../services/huespedes';
import { HuespedRequest, HuespedResponse, getNombreCompleto } from '../../models/Huesped.model';

declare var bootstrap: any;

@Component({
  selector: 'app-huespedes',
  standalone: false,
  templateUrl: './huespedes.html',
  styleUrl: './huespedes.css',
})
export class Huespedes implements OnInit, AfterViewInit {
  huespedes: HuespedResponse[] = [];
  textoModal: string = 'Registrar Huésped';
  huespedForm: FormGroup;

  @ViewChild('huespedModalRef') huespedModalEl!: ElementRef;
  private modalInstance!: any;

  isEditMode: boolean = false;
  selectedHuespedId: number | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private huespedService: HuespedesService
  ) {
    this.huespedForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      documento: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      nacionalidad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    });
  }

  ngOnInit(): void {
    this.listarHuespedes();
  }

  listarHuespedes(): void {
    this.huespedService.getHuespedes().subscribe({
      next: resp => {
        this.huespedes = resp;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
        Swal.fire('Error', 'No se pudieron cargar los huéspedes', 'error');
      }
    });
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.huespedModalEl.nativeElement, { keyboard: false });
    this.huespedModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  resetForm(): void {
    this.huespedForm.reset();
    this.isEditMode = false;
    this.selectedHuespedId = null;
  }

  getNombreCompleto(huesped: HuespedResponse): string {
    return getNombreCompleto(huesped);
  }

  toggleForm(): void {
    this.resetForm();
    this.textoModal = 'Registrar Huésped';
    this.modalInstance.show();
  }

  editarHuesped(huesped: HuespedResponse): void {
    this.isEditMode = true;
    this.selectedHuespedId = huesped.id;
    this.textoModal = 'Actualizando huésped: ' + this.getNombreCompleto(huesped);

    this.huespedForm.patchValue({
      nombre: huesped.nombre,
      apellidoPaterno: huesped.apellidoPaterno,
      apellidoMaterno: huesped.apellidoMaterno,
      email: huesped.email,
      telefono: huesped.telefono,
      documento: huesped.documento,
      nacionalidad: huesped.nacionalidad
    });
    this.modalInstance.show();
  }

  onSubmit(): void {
    if (this.huespedForm.invalid) return;

    const datosHuesped: HuespedRequest = this.huespedForm.value;

    if (this.isEditMode && this.selectedHuespedId !== null) {
      // ACTUALIZANDO
      this.huespedService.putHuesped(datosHuesped, this.selectedHuespedId).subscribe({
        next: huespedActualizado => {
          const index = this.huespedes.findIndex(h => h.id === huespedActualizado.id);
          if (index !== -1) {
            this.huespedes[index] = huespedActualizado;
          }
          this.cdr.detectChanges();
          Swal.fire('Actualizado', 'Huésped actualizado correctamente', 'success');
          this.modalInstance.hide();
        },
        error: (error) => {
          console.error(error);
          Swal.fire('Error', 'No se pudo actualizar el huésped', 'error');
        }
      });
    } else {
      // REGISTRANDO
      this.huespedService.postHuesped(datosHuesped).subscribe({
        next: nuevoHuesped => {
          this.huespedes.push(nuevoHuesped);
          this.cdr.detectChanges();
          Swal.fire('Registrado', 'Huésped registrado correctamente', 'success');
          this.modalInstance.hide();
        },
        error: (error) => {
          console.error(error);
          Swal.fire('Error', 'No se pudo registrar el huésped', 'error');
        }
      });
    }
  }

  eliminarHuesped(id: number): void {
    const huesped = this.huespedes.find(h => h.id === id);
    if (!huesped) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `El huésped ${this.getNombreCompleto(huesped)} será eliminado permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.huespedService.deleteHuesped(id).subscribe({
          next: () => {
            this.huespedes = this.huespedes.filter(h => h.id !== id);
            this.cdr.detectChanges();
            Swal.fire('Eliminado', `Huésped eliminado correctamente`, 'success');
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', 'No se pudo eliminar el huésped', 'error');
          }
        });
      }
    });
  }
}