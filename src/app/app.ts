import { AfterViewInit, Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
   

   title = 'citasApp';
   otra = 'Hola mundo';

   /*
   contador: number = 0;
   limite: boolean = false;


   ngOnInit(): void {
     alert ('Se está iniciando el componente');
   }

   ngAfterViewInit(): void {
     alert ('Se ha renderizado la vista del componente');
   }


   aumentarContador(): void {
    this.contador++;
    if (this.contador >= 10) {
      this.limite = true;
    }
   }
  */
}
