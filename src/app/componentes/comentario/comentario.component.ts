import { Component, Input, OnInit } from '@angular/core';
import { ComentarioService } from '../../services/comentario.service';
import { NgIf, NgFor} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';


interface Comentario {
  id?: number;
  usuario: string;
  imagenUsuario?: string;
  archivoId: number;
  texto: string;
  valoracion: number;
  fechaCreacion?: string;
}

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentario.component.html',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor, DatePipe],
})
export class ComentariosComponent implements OnInit {
  apiBaseUrl = environment.apiBaseUrl;
  
  @Input() archivoId!: number;

  comentarios: Comentario[] = [];
  nuevoComentario: string = '';
  nuevaValoracion: number | null = null;
  usuarioActual: string = '';
  valoracionUsuario: number | null = null;
  valoracionMedia: number | null = null;
  valoracionDirecta: number = 5;

  constructor(private comentarioService: ComentarioService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.usuarioActual = payload.sub;
    }

    this.cargarComentarios();
    this.obtenerValoracionUsuario();
    this.obtenerValoracionMedia();
  }

  cargarComentarios() {
    this.comentarioService.obtenerComentarios(this.archivoId).subscribe(
      (data) => {
        this.comentarios = data.filter(c => c.texto.trim() !== ''); //evitar mostrar comentarios vacíos porque cuando solo se valora se crea un comentario vacío
      },
      (error) => console.error('Error al cargar comentarios:', error)
    );
  }

  agregarComentario() {
    const comentarioTexto = this.nuevoComentario.trim();
    const hayTexto = comentarioTexto.length > 0;
    const hayValoracion = this.nuevaValoracion !== null && this.nuevaValoracion >= 1 && this.nuevaValoracion <= 5;
  
    // Solo valorar (sin comentario)
    if (!hayTexto && hayValoracion) {
      this.comentarioService.valorarArchivo(this.archivoId, this.nuevaValoracion!).subscribe(
        () => {
          this.obtenerValoracionUsuario();
          this.obtenerValoracionMedia();
          this.nuevaValoracion = null; // Reset
        },
        (error) => console.error('Error al valorar:', error)
      );
      return;
    }
  
    // Comentar (con o sin valoración)
    if (hayTexto) {
      this.comentarioService.agregarComentario(this.archivoId, comentarioTexto, hayValoracion ? this.nuevaValoracion! : 0).subscribe(
        (comentario) => {
          this.comentarios.push(comentario);
          this.nuevoComentario = '';
          this.nuevaValoracion = null;
          this.obtenerValoracionUsuario();
          this.obtenerValoracionMedia();
        },
        (error) => console.error('Error al agregar comentario:', error)
      );
    }
  }
  
  enviarSoloValoracion() {
    this.comentarioService.agregarComentario(this.archivoId, '', this.valoracionDirecta).subscribe(
      (comentario) => {
        this.obtenerValoracionUsuario();
        this.obtenerValoracionMedia();
        alert('Valoración registrada correctamente.');
      },
      (error) => console.error('Error al valorar el archivo:', error)
    );
  }

  editarComentario(comentario: Comentario) {
    const nuevoTexto = prompt('Editar comentario:', comentario.texto);
    const nuevaValoracion = Number(prompt('Editar valoración (1-5):', comentario.valoracion.toString()));

    if (nuevoTexto !== null && nuevaValoracion >= 1 && nuevaValoracion <= 5) {
      this.comentarioService.editarComentario(comentario.id!, nuevoTexto, nuevaValoracion).subscribe(
        (comentarioEditado) => {
          comentario.texto = comentarioEditado.texto;
          comentario.valoracion = comentarioEditado.valoracion;
          this.obtenerValoracionUsuario();
          this.obtenerValoracionMedia();
          alert('Comentario actualizado correctamente.');
        },
        (error) => {
          console.error('Error al editar comentario', error);
          alert('No se pudo actualizar el comentario.');
        }
      );
    }
  }

  eliminarComentario(comentarioId: number) {
    this.comentarioService.eliminarComentario(comentarioId).subscribe(
      () => {
        this.comentarios = this.comentarios.filter((c) => c.id !== comentarioId);
        this.obtenerValoracionUsuario();
        this.obtenerValoracionMedia();
      },
      (error) => console.error('Error al eliminar comentario:', error)
    );
  }

  obtenerValoracionUsuario() {
    this.comentarioService.obtenerValoracionUsuario(this.archivoId).subscribe(
      (valor) => (this.valoracionUsuario = valor),
      (error) => console.error('No se pudo obtener valoración del usuario', error)
    );
  }

  obtenerValoracionMedia() {
    this.comentarioService.obtenerValoracionMedia(this.archivoId).subscribe(
      (valor) => (this.valoracionMedia = valor),
      (error) => console.error('No se pudo obtener valoración media', error)
    );
  }
}
