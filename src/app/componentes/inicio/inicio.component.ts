import { Component, OnInit } from '@angular/core';
import { ArchivoService } from '../../services/archivo.service';
import { CommonModule } from '@angular/common';
import { ComentariosComponent } from '../comentario/comentario.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ComentariosComponent, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  archivos: any[] = [];
  terminoBusqueda: string = '';
  usuarioLogeado: boolean = false; //variable para verificar si el usuario esta logeado

  constructor(private archivoService: ArchivoService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerTodosLosArchivos();
    // Verifica si hay un token en el localStorage
    this.usuarioLogeado = !!localStorage.getItem('token');
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

  logout() {
    localStorage.removeItem('token');
    this.usuarioLogeado = false; // Oculta el botón de logout
    this.router.navigate(['/']); // Redirige a la página de inicio
  }

  obtenerTodosLosArchivos(): void {
    this.archivoService.obtenerArchivos().subscribe(
      data => this.archivos = data,
      error => console.error('Error al cargar archivos', error)
    );
  }

  buscarEnTiempoReal(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.obtenerTodosLosArchivos(); // Si no hay término, cargar todos los archivos
      return;
    }
  
    this.archivoService.buscarArchivos(this.terminoBusqueda).subscribe(
      data => {
        this.archivos = data;
        console.log('🔍 Resultados encontrados:', data); // Depuración
      },
      error => console.error("❌ Error en la búsqueda:", error)
    );
  }  

  descargarArchivo(archivoId: number, nombre: string, tipo: string) {
    this.archivoService.descargarArchivo(archivoId, tipo).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombre; // Usar el nombre original
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error("Error al descargar el archivo", error);
    });
  }
}