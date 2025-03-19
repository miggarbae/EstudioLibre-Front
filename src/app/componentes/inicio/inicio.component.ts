import { Component, OnInit } from '@angular/core';
import { ArchivoService } from '../../services/archivo.service';
import { CommonModule } from '@angular/common';
import { ComentariosComponent } from '../comentario/comentario.component';
import { FormsModule } from '@angular/forms';

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

  constructor(private archivoService: ArchivoService) {}

  ngOnInit(): void {
    this.obtenerTodosLosArchivos();;
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
        console.log('🔍 Resultados encontrados:', data); // 🛠 Depuración
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