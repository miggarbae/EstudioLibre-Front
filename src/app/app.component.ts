import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SubirArchivoComponent } from './componentes/subir-archivo/subir-archivo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SubirArchivoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'EstudioLibre';
}
