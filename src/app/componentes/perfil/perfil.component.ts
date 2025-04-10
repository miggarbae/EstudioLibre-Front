import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { ArchivoService } from '../../services/archivo.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  usuario: any = {};
  archivos: any[] = [];
  nuevaContrasena = '';
  imagenSeleccionada: File | null = null;
  enEdicion = false;

  @ViewChild('inputImagen') inputImagenRef!: ElementRef;

  constructor(
    private usuarioService: UsuarioService,
    private archivoService: ArchivoService
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarArchivos();
  }

  // Cargar perfil de usuario
  cargarUsuario(): void {
    this.usuarioService.obtenerUsuario().subscribe({
      next: (data) => (this.usuario = data),
      error: (error) => console.error('Error al cargar el usuario', error),
    });
  }

  // Cargar archivos del usuario
  cargarArchivos(): void {
    this.archivoService.obtenerArchivosUsuario().subscribe({
      next: (data) => (this.archivos = data),
      error: (error) => console.error('Error al cargar los archivos', error),
    });
  }

  // Iniciar edición
  habilitarEdicion(): void {
    this.enEdicion = true;
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.resetFormulario();
  }

  // Abrir input de archivo al hacer clic en la imagen o el ícono de lápiz
  abrirInputImagen(): void {
    this.inputImagenRef.nativeElement.value = null; // Restablece el valor del input
    this.inputImagenRef.nativeElement.click(); // Abre el selector de archivos
  }
  

  // Guardar imagen seleccionada
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.usuario?.id) {
      this.imagenSeleccionada = file; //Aquí verificamos que no es null
  
      const formData = new FormData();
      formData.append('imagen', this.imagenSeleccionada!);
  
      this.usuarioService.subirImagen(this.usuario.id, formData).subscribe(
        () => {
          alert('Imagen de perfil actualizada correctamente.');
          this.cargarUsuario(); // Recarga el usuario para mostrar la nueva imagen
        },
        (error) => {
          console.error('Error al subir la imagen', error);
          alert('Error al subir la imagen de perfil.');
        }
      );
    }
  }  

  // Actualizar perfil con posibilidad de subir imagen
  actualizarPerfil(): void {
    if (!this.usuario?.username) {
      console.error('Usuario no válido. Abortando...');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.usuario.username);
    formData.append('email', this.usuario.email);
    if (this.nuevaContrasena) {
      formData.append('password', this.nuevaContrasena);
    }

    this.usuarioService.actualizarUsuario(formData).subscribe({
      next: (usuarioActualizado) => {
        if (this.imagenSeleccionada) {
          const imagenForm = new FormData();
          imagenForm.append('imagen', this.imagenSeleccionada);
          this.usuarioService.subirImagen(usuarioActualizado.id, imagenForm).subscribe({
            next: () => {
              alert('Perfil actualizado correctamente con imagen.');
              this.resetFormulario();
            },
            error: (err) => {
              console.error('Error al subir la imagen', err);
              alert('Perfil actualizado pero falló la imagen.');
            },
          });
        } else {
          alert('Perfil actualizado correctamente.');
          this.resetFormulario();
        }
      },
      error: (error) => {
        console.error('Error al actualizar el perfil', error);
        alert('Error al actualizar el perfil.');
      },
    });
  }

  // Reiniciar estado del formulario
  resetFormulario(): void {
    this.enEdicion = false;
    this.nuevaContrasena = '';
    this.imagenSeleccionada = null;
    this.cargarUsuario();
  }

  // Confirmar eliminación de cuenta
  confirmarEliminacion(): void {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmacion) {
      alert('Funcionalidad de eliminación pendiente de implementación');
    }
  }

  // Descargar archivo
  descargarArchivo(archivo: any): void {
    this.archivoService.descargarArchivo(archivo.id, archivo.tipo).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = archivo.nombre;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar el archivo', err);
        alert('Error al descargar el archivo.');
      },
    });
  }

  // Eliminar archivo (futura implementación)
  eliminarArchivo(archivo: any): void {
    const confirmar = confirm(`¿Estás seguro de eliminar el archivo "${archivo.nombre}"?`);
    if (confirmar) {
      alert('Funcionalidad de eliminación de archivos pendiente de implementación');
    }
  }

  // Obtener ruta de imagen de perfil
  obtenerImagenPerfil(): string {
    if (this.usuario?.rutaImagenPerfil) {
      return `http://localhost:8080${this.usuario.rutaImagenPerfil}`;
    }
    return 'assets/usuario-default.jpg';
  }  
}
