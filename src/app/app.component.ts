import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './componentes/header/header.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { SubirArchivoComponent } from './componentes/subir-archivo/subir-archivo.component';
import { FormularioService } from './services/formulario.service';
import { CommonModule } from '@angular/common'; // <--- Aquí

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // <--- Añade esto
    HeaderComponent,
    RouterOutlet,
    NavbarComponent,
    SubirArchivoComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mostrarFormulario: boolean = false;

  constructor(private formularioService: FormularioService) {}

  ngOnInit(): void {
    this.formularioService.mostrarFormulario$.subscribe(
      visible => this.mostrarFormulario = visible
    );
  }

  cerrarFormulario() {
    this.formularioService.ocultar();  // Esto hace que `mostrarFormulario` pase a false
  }  
}