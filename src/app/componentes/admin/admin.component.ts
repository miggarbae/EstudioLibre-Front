import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Archivo } from '../../services/archivo.service';
import { ArchivoService } from '../../services/archivo.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  archivosReportados: any[] = [];
  columnasUsuarios: string[] = ['username', 'roles', 'cantidadArchivos', 'acciones'];
  usuarios: any[] = [];
  usuarioSeleccionado: any = null;
  terminoBusqueda: string = '';

  constructor(private http: HttpClient, private archivoService: ArchivoService) {}

  ngOnInit(): void {
    this.cargarReportes();
    this.cargarUsuarios();
  }

  cargarReportes(): void {
    this.http.get<any[]>('http://localhost:8080/api/reportes').subscribe(
      res => this.archivosReportados = res,
      err => console.error("Error al cargar reportes", err)
    );
  }

  cargarUsuarios(): void {
    this.http.get<any[]>('http://localhost:8080/api/admin/usuarios').subscribe(
      res => this.usuarios = res,
      err => console.error("Error al cargar usuarios", err)
    );
  }

  toggleArchivos(user: any) {
    this.usuarioSeleccionado = this.usuarioSeleccionado === user ? null : user;
  }

  eliminarUsuario(id: number): void {
    if (confirm("¿Eliminar este usuario?")) {
      this.http.delete(`http://localhost:8080/api/admin/usuarios/${id}`).subscribe(
        () => {
          this.cargarUsuarios();
          this.usuarioSeleccionado = null;
        },
        err => console.error("Error al eliminar usuario", err)
      );
    }
  }  

  cambiarVisibilidad(archivo: any): void {
    const nuevoEstado = !archivo.visible;
    this.http.put(`http://localhost:8080/api/admin/archivos/${archivo.id}/visibilidad?visible=${nuevoEstado}`, {}).subscribe(
      () => archivo.visible = nuevoEstado,
      err => console.error("Error al cambiar visibilidad", err)
    );
  }   

  eliminarArchivo(archivo: Archivo): void {
    if (confirm("¿Eliminar este archivo?")) {
      this.http.delete(`http://localhost:8080/api/admin/archivos/${archivo.id}`).subscribe(
        () => {
          this.usuarioSeleccionado.archivos = this.usuarioSeleccionado.archivos.filter((a: Archivo) => a.id !== archivo.id);
        },
        err => console.error("Error al eliminar archivo", err)
      );
    }
  }  

  eliminarReporte(reporteId: number): void {
    if (confirm("¿Eliminar este reporte?")) {
      this.http.delete(`http://localhost:8080/api/admin/reportes/${reporteId}`).subscribe(
        () => this.cargarReportes(),
        err => console.error("Error al eliminar reporte", err)
      );
    }
  }

  buscarArchivos(): void {
    const termino = this.terminoBusqueda.trim().toLowerCase();
  
    if (!termino) {
      this.usuarioSeleccionado = null;
      return;
    }
  
    this.http.get<any[]>(`http://localhost:8080/api/admin/archivos/busqueda?termino=${termino}`).subscribe(
      archivos => {
        // Ver si coincide algún usuario también
        const usuariosCoincidentes = this.usuarios.filter(u =>
          u.username.toLowerCase().includes(termino)
        );
  
        if (archivos.length > 0 || usuariosCoincidentes.length > 0) {
          this.usuarioSeleccionado = {
            username: 'Búsqueda',
            archivos,
            usuariosCoincidentes,
          };
        } else {
          this.usuarioSeleccionado = {
            username: 'Búsqueda',
            archivos: [],
            usuariosCoincidentes: [],
          };
        }
      },
      err => {
        console.error("Error al buscar archivos", err);
      }
    );
  }  

  actualizarRol(user: any): void {
    const nuevoRol = user.roles;
  
    this.http.put(`http://localhost:8080/api/admin/usuarios/${user.id}/rol`, nuevoRol, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe(
      () => {
        console.log(`Rol actualizado correctamente a ${nuevoRol}`);
      },
      (err) => {
        console.error("Error al actualizar rol", err);
        alert("❌ No se pudo actualizar el rol.");
      }
    );
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
}
