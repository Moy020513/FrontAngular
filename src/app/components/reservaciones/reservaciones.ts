import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ReservacionesService } from '../../services/reservaciones';
import { HuespedesService } from '../../services/huespedes';
import { HabitacionesService } from '../../services/habitaciones';
import { 
  ReservacionRequest, 
  ReservacionResponse, 
  formatearFecha, 
  getEstadoReservaLabel, 
  getEstadoReservaColor, 
  EstadoReserva 
} from '../../models/Reservacion.model';
import { HuespedResponse, getNombreCompleto } from '../../models/Huesped.model';
import { HabitacionResponse } from '../../models/Habitacion.model';

declare var bootstrap: any;

@Component({
  selector: 'app-reservaciones',
  standalone: false,
  templateUrl: './reservaciones.html',
  styleUrl: './reservaciones.css',
})
export class Reservaciones implements OnInit, AfterViewInit {
  reservaciones: ReservacionResponse[] = [];
  huespedes: HuespedResponse[] = [];
  habitaciones: HabitacionResponse[] = [];
  textoModal: string = 'Registrar Reservación';
  reservacionForm: FormGroup;

  @ViewChild('reservacionModalRef') reservacionModalEl!: ElementRef;
  private modalInstance!: any;

  isEditMode: boolean = false;
  selectedReservacionId: number | null = null;

  estadosReserva: string[] = Object.values(EstadoReserva);

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private reservacionService: ReservacionesService,
    private huespedService: HuespedesService,
    private habitacionService: HabitacionesService
  ) {
    this.reservacionForm = this.fb.group({
      idHuesped: ['', [Validators.required]],
      idHabitacion: ['', [Validators.required]],
      fechaHora: ['', [Validators.required]],
      fechaSalida: ['', [Validators.required]],
    }, {
      validators: this.validarFechas
    });
  }

  validarFechas(group: FormGroup): any {
    const fechaEntrada = group.get('fechaHora')?.value;
    const fechaSalida = group.get('fechaSalida')?.value;
    
    if (fechaEntrada && fechaSalida) {
      const entrada = new Date(fechaEntrada);
      const salida = new Date(fechaSalida);
      
      if (salida <= entrada) {
        return { fechaInvalida: true };
      }
    }
    return null;
  }

  ngOnInit(): void {
    this.listarReservaciones();
    this.listarHuespedes();
    this.listarHabitaciones();
  }

  listarReservaciones(): void {
    this.reservacionService.getReservaciones().subscribe({
      next: resp => {
        this.reservaciones = resp;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
        Swal.fire('Error', 'No se pudieron cargar las reservaciones', 'error');
      }
    });
  }

  listarHuespedes(): void {
    this.huespedService.getHuespedes().subscribe({
      next: resp => {
        this.huespedes = resp;
      },
      error: (error) => {
        console.log('Error al cargar huéspedes:', error);
      }
    });
  }

  listarHabitaciones(): void {
    this.habitacionService.getHabitaciones().subscribe({
      next: resp => {
        this.habitaciones = resp;
      },
      error: (error) => {
        console.log('Error al cargar habitaciones:', error);
      }
    });
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.reservacionModalEl.nativeElement, { keyboard: false });
    this.reservacionModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  resetForm(): void {
    this.reservacionForm.reset();
    this.isEditMode = false;
    this.selectedReservacionId = null;
  }

  formatearFecha(fechaHora: string): string {
    return formatearFecha(fechaHora);
  }

  getEstadoLabel(estado: string): string {
    return getEstadoReservaLabel(estado);
  }

  getEstadoColor(estado: string): string {
    return getEstadoReservaColor(estado);
  }

  getNombreCompletoHuesped(huesped: HuespedResponse): string {
    return getNombreCompleto(huesped);
  }

  getNombreHuesped(reservacion: ReservacionResponse): string {
    if (reservacion.huesped) {
      return this.getNombreCompletoHuesped(reservacion.huesped);
    }
    return `ID: ${reservacion.id}`;
  }

  getNumeroHabitacion(reservacion: ReservacionResponse): string {
    if (reservacion.habitacion) {
      return `#${reservacion.habitacion.numero}`;
    }
    return `ID: ${reservacion.id}`;
  }

  toggleForm(): void {
    this.resetForm();
    this.textoModal = 'Registrar Reservación';
    this.modalInstance.show();
  }

  editarReservacion(reservacion: ReservacionResponse): void {
    this.isEditMode = true;
    this.selectedReservacionId = reservacion.id;
    this.textoModal = `Actualizando reservación #${reservacion.id}`;

    const fechaEntrada = new Date(reservacion.fechaHora);
    const fechaSalida = new Date(reservacion.fechaSalida);
    const fechaEntradaFormateada = fechaEntrada.toISOString().slice(0, 16);
    const fechaSalidaFormateada = fechaSalida.toISOString().slice(0, 16);

    this.reservacionForm.patchValue({
      idHuesped: reservacion.huesped?.id || reservacion.id,
      idHabitacion: reservacion.habitacion?.id || reservacion.id,
      fechaHora: fechaEntradaFormateada,
      fechaSalida: fechaSalidaFormateada
    });
    this.modalInstance.show();
  }

  onSubmit(): void {
    if (this.reservacionForm.invalid) {
      if (this.reservacionForm.errors?.['fechaInvalida']) {
        Swal.fire('Error', 'La fecha de salida debe ser posterior a la fecha de entrada', 'warning');
      }
      return;
    }

    const formValue = this.reservacionForm.value;
    
    const fechaEntrada = new Date(formValue.fechaHora);
    const fechaSalida = new Date(formValue.fechaSalida);
    
    const fechaEntradaFormateada = this.formatearFechaParaBackend(fechaEntrada);
    const fechaSalidaFormateada = this.formatearFechaParaBackend(fechaSalida);

    const datosReservacion: ReservacionRequest = {
      idHuesped: formValue.idHuesped,
      idHabitacion: formValue.idHabitacion,
      fechaHora: fechaEntradaFormateada,
      fechaSalida: fechaSalidaFormateada
    };

    if (this.isEditMode && this.selectedReservacionId !== null) {
      this.reservacionService.putReservacion(datosReservacion, this.selectedReservacionId).subscribe({
        next: reservacionActualizada => {
          const index = this.reservaciones.findIndex(r => r.id === reservacionActualizada.id);
          if (index !== -1) {
            this.reservaciones[index] = reservacionActualizada;
          }
          this.cdr.detectChanges();
          Swal.fire('Actualizado', 'Reservación actualizada correctamente', 'success');
          this.modalInstance.hide();
        },
        error: (error) => {
          console.error(error);
          const mensaje = error.error?.message || 'No se pudo actualizar la reservación';
          Swal.fire('Error', mensaje, 'error');
        }
      });
    } else {
      this.reservacionService.postReservacion(datosReservacion).subscribe({
        next: nuevaReservacion => {
          this.reservaciones.push(nuevaReservacion);
          this.cdr.detectChanges();
          Swal.fire('Registrado', 'Reservación registrada correctamente', 'success');
          this.modalInstance.hide();
        },
        error: (error) => {
          console.error(error);
          const mensaje = error.error?.message || 'No se pudo registrar la reservación';
          Swal.fire('Error', mensaje, 'error');
        }
      });
    }
  }

  // Método auxiliar para formatear fecha al formato del backend
  private formatearFechaParaBackend(fecha: Date): string {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }

  eliminarReservacion(id: number): void {
    const reservacion = this.reservaciones.find(r => r.id === id);
    if (!reservacion) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `La reservación #${reservacion.id} será eliminada permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservacionService.deleteReservacion(id).subscribe({
          next: () => {
            this.reservaciones = this.reservaciones.filter(r => r.id !== id);
            this.cdr.detectChanges();
            Swal.fire('Eliminado', `Reservación eliminada correctamente`, 'success');
          },
          error: (error) => {
            console.error(error);
            const mensaje = error.error?.message || 'No se pudo eliminar la reservación';
            Swal.fire('Error', mensaje, 'error');
          }
        });
      }
    });
  }

  // El método cambiarEstado ya está bien
cambiarEstado(reservacion: ReservacionResponse, nuevoEstado: string): void {
    if (reservacion.estadoReserva === nuevoEstado) return;

    Swal.fire({
        title: '¿Cambiar estado?',
        text: `¿Deseas cambiar el estado a "${this.getEstadoLabel(nuevoEstado)}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí se envía el string, el servicio lo convierte a número
            this.reservacionService.actualizarEstadoReservacion(reservacion.id, nuevoEstado).subscribe({
                next: reservacionActualizada => {
                    const index = this.reservaciones.findIndex(r => r.id === reservacionActualizada.id);
                    if (index !== -1) {
                        this.reservaciones[index] = reservacionActualizada;
                    }
                    this.cdr.detectChanges();
                    Swal.fire('Estado actualizado', `Estado cambiado a "${this.getEstadoLabel(nuevoEstado)}"`, 'success');
                },
                error: (error) => {
                    console.error(error);
                    const mensaje = error.error?.message || 'No se pudo cambiar el estado';
                    Swal.fire('Error', mensaje, 'error');
                }
            });
        }
    });
}
}