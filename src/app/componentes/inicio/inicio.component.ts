import { Component, OnInit } from '@angular/core';
import { ArchivoService } from '../../services/archivo.service';
import { CommonModule } from '@angular/common';
import { ComentariosComponent } from '../comentario/comentario.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from '../auth/login/login.component';
import { RegistroComponent } from '../auth/registro/registro.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ComentariosComponent, FormsModule, LoginComponent, RegistroComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  archivos: any[] = [];
  terminoBusqueda: string = '';

  // Login/registro modal
  mostrarLogin: boolean = false;
  mostrarRegistro: boolean = false;

  // Login
  username: string = '';
  password: string = '';

  // Registro
  nuevoUsuario = { username: '', email: '', password: '' };
  errorRegistro: string = '';

  // Reporte
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
      data => {
        this.archivos = data.map(a => ({ ...a, mostrarComentarios: false })); // Ocultar los comentarios al inicio
      },
      error => console.error('Error al cargar archivos', error)
    );
  }  

  buscarEnTiempoReal(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.obtenerTodosLosArchivos();
      return;
    }

    this.archivoService.buscarArchivos(this.terminoBusqueda).subscribe(
      data => {
        this.archivos = data.map(a => ({ ...a, mostrarComentarios: false }));
      },
      error => console.error("❌ Error en la búsqueda:", error)
    );    
  }

  // Mostrar/ocultar comentarios
  toggleComentarios(archivo: any): void {
    archivo.mostrarComentarios = !archivo.mostrarComentarios;
  }

  descargarArchivo(archivoId: number, nombre: string, tipo: string) {
    this.archivoService.descargarArchivo(archivoId, tipo).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombre;
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

  // Login
  login() {
    this.http.post('http://localhost:8080/auth/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.cerrarModales();
        location.reload();
      },
      error: () => alert("❌ Usuario o contraseña incorrectos")
    });
  }

  // Registro
  registrarUsuario() {
    this.http.post('http://localhost:8080/auth/register', this.nuevoUsuario).subscribe({
      next: () => {
        this.cerrarModales();
        location.reload();
      },
      error: err => {
        if (err.status === 400) {
          this.errorRegistro = '⚠️ El nombre de usuario ya está en uso.';
        } else {
          this.errorRegistro = 'Error al registrar usuario.';
        }
      }
    });
  }

  // Mostrar modales
  abrirLogin() {
    this.mostrarLogin = true;
    this.mostrarRegistro = false;
  }

  abrirRegistro() {
    this.mostrarRegistro = true;
    this.mostrarLogin = false;
  }

  cerrarModales() {
    this.mostrarLogin = false;
    this.mostrarRegistro = false;
    this.errorRegistro = '';
    this.username = '';
    this.password = '';
    this.nuevoUsuario = { username: '', email: '', password: '' };
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}