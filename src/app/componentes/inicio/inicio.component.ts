import { Component, OnInit } from '@angular/core';
import { ArchivoService } from '../../services/archivo.service';
import { CommonModule } from '@angular/common';
import { ComentariosComponent } from '../comentario/comentario.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { HttpClient } from '@angular/common/http';

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

  // Variables para reportar archivos
  archivoSeleccionadoParaReporte: any = null;
  motivoSeleccionado: string = '';
  otroMotivo: string = '';

  constructor(
    private archivoService: ArchivoService, 
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosArchivos();
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
  
  reportarArchivo(archivo: any) {
    this.archivoSeleccionadoParaReporte = archivo;
    this.motivoSeleccionado = '';
    this.otroMotivo = '';
  }

  enviarReporte() {
    const motivoFinal = this.motivoSeleccionado === 'otros' ? this.otroMotivo : this.motivoSeleccionado;
    if (!motivoFinal.trim()) {
      alert('⚠️ Debes especificar un motivo.');
      return;
    }
  
    const reporte = {
      motivo: motivoFinal,
      archivo: { id: this.archivoSeleccionadoParaReporte.id }
    };
  
    this.http.post('http://localhost:8080/api/reportes', reporte, { responseType: 'text' }).subscribe({
      next: () => {
        alert("📩 Reporte enviado correctamente.");
        this.archivoSeleccionadoParaReporte = null;
        this.motivoSeleccionado = '';
        this.otroMotivo = '';
      },
      error: () => {
        alert("❌ Error al enviar el reporte.");
      }
    });
    
  }  
}