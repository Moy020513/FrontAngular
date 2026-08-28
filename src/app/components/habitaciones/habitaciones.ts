import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HabitacionesService } from '../../services/habitaciones';
import { HabitacionRequest, HabitacionResponse, formatearPrecio } from '../../models/Habitacion.model';

declare var bootstrap: any;

@Component({
  selector: 'app-habitaciones',
  standalone: false,
  templateUrl: './habitaciones.html',
  styleUrl: './habitaciones.css',
})
export class Habitaciones implements OnInit, AfterViewInit {
  habitaciones: HabitacionResponse[] = [];
  textoModal: string = 'Registrar Habitación';
  habitacionForm: FormGroup;

  @ViewChild('habitacionModalRef') habitacionModalEl!: ElementRef;
  private modalInstance!: any;

  isEditMode: boolean = false;
  selectedHabitacionId: number | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private habitacionService: HabitacionesService
  ) {
    this.habitacionForm = this.fb.group({
      numero: ['', [Validators.required, Validators.min(1), Validators.max(999)]],
      tipo: ['', [Validators.required, Validators.maxLength(50)]],
      precio: ['', [Validators.required, Validators.min(0.01), Validators.max(999999.99)]],
      capacidad: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
    });
  }

  ngOnInit(): void {
    this.listarHabitaciones();
  }

  listarHabitaciones(): void {
    this.habitacionService.getHabitaciones().subscribe({
      next: resp => {
        this.habitaciones = resp;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
        Swal.fire('Error', 'No se pudieron cargar las habitaciones', 'error');
      }
    });
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.habitacionModalEl.nativeElement, { keyboard: false });
    this.habitacionModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  resetForm(): void {
    this.habitacionForm.reset();
    this.isEditMode = false;
    this.selectedHabitacionId = null;
  }

  formatearPrecio(precio: number): string {
    return formatearPrecio(precio);
  }

  toggleForm(): void {
    this.resetForm();
    this.textoModal = 'Registrar Habitación';
    this.modalInstance.show();
  }

  editarHabitacion(habitacion: HabitacionResponse): void {
    this.isEditMode = true;
    this.selectedHabitacionId = habitacion.id;
    this.textoModal = `Actualizando habitación #${habitacion.numero}`;

    this.habitacionForm.patchValue({
      numero: habitacion.numero,
      tipo: habitacion.tipo,
      precio: habitacion.precio,
      capacidad: habitacion.capacidad
    });
    this.modalInstance.show();
  }

  onSubmit(): void {
    if (this.habitacionForm.invalid) return;

    const datosHabitacion: HabitacionRequest = this.habitacionForm.value;

    if (this.isEditMode && this.selectedHabitacionId !== null) {
      // ACTUALIZANDO
      this.habitacionService.putHabitacion(datosHabitacion, this.selectedHabitacionId).subscribe({
        next: habitacionActualizada => {
          const index = this.habitaciones.findIndex(h => h.id === habitacionActualizada.id);
          if (index !== -1) {
            this.habitaciones[index] = habitacionActualizada;
          }
          this.cdr.detectChanges();
          Swal.fire('Actualizado', 'Habitación actualizada correctamente', 'success');
          this.modalInstance.hide();
        },
        error: (error) => {
          console.error(error);
          Swal.fire('Error', error.error?.message || 'No se pudo actualizar la habitación', 'error');
        }
      });
    } else {
      // REGISTRANDO
      this.habitacionService.postHabitacion(datosHabitacion).subscribe({
        next: nuevaHabitacion => {
          this.habitaciones.push(nuevaHabitacion);
          this.cdr.detectChanges();
          Swal.fire('Registrado', 'Habitación registrada correctamente', 'success');
          this.modalInstance.hide();
        },
        error: (error) => {
          console.error(error);
          Swal.fire('Error', error.error?.message || 'No se pudo registrar la habitación', 'error');
        }
      });
    }
  }

  eliminarHabitacion(id: number): void {
    const habitacion = this.habitaciones.find(h => h.id === id);
    if (!habitacion) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `La habitación #${habitacion.numero} será eliminada permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.habitacionService.deleteHabitacion(id).subscribe({
          next: () => {
            this.habitaciones = this.habitaciones.filter(h => h.id !== id);
            this.cdr.detectChanges();
            Swal.fire('Eliminado', `Habitación eliminada correctamente`, 'success');
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', error.error?.message || 'No se pudo eliminar la habitación', 'error');
          }
        });
      }
    });
  }
}