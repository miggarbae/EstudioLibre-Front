import { Component, OnInit } from '@angular/core';
import { ArchivoService } from '../../services/archivo.service';
import { CommonModule } from '@angular/common';
import { ComentariosComponent } from '../comentario/comentario.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { HttpClient } from '@angular/common/http';
import { SubirArchivoComponent } from "../subir-archivo/subir-archivo.component";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ComentariosComponent, FormsModule, SubirArchivoComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  archivos: any[] = [];
  terminoBusqueda: string = '';
  usuarioLogeado: boolean = false; //variable para verificar si el usuario esta logeado
  rolUsuario: string | null = null; //variable para verificar si el usuario es admin

  // Variables para reportar archivos
  archivoSeleccionadoParaReporte: any = null;
  motivoSeleccionado: string = '';
  otroMotivo: string = '';

  constructor(
    private archivoService: ArchivoService, 
    private router: Router,
    private tokenService: TokenService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.usuarioLogeado = !!localStorage.getItem('token');
    this.rolUsuario = this.tokenService.getUserRole(); // Obtenemos el rol del token
    this.obtenerTodosLosArchivos();
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