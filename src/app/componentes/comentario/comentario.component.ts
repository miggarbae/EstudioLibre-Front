import { Component, Input, OnInit } from '@angular/core';
import { ComentarioService } from '../../services/comentario.service';
import { NgIf, NgFor} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

interface Comentario {
  id?: number;
  usuario: string;
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
  @Input() archivoId!: number;  // Recibe el ID del archivo desde otro componente

  comentarios: Comentario[] = [];
  nuevoComentario: string = '';
  nuevaValoracion: number = 5;

  constructor(private comentarioService: ComentarioService) {}

  ngOnInit() {
    this.cargarComentarios();
  }

  // Cargar comentarios al iniciar
  cargarComentarios() {
    this.comentarioService.obtenerComentarios(this.archivoId).subscribe(
      (data) => (this.comentarios = data),
      (error) => console.error('Error al cargar comentarios:', error)
    );
  }

  // Agregar un comentario
  agregarComentario() {
    if (!this.nuevoComentario.trim()) return;

    this.comentarioService.agregarComentario(this.archivoId, this.nuevoComentario, this.nuevaValoracion).subscribe(
      (comentario) => {
        this.comentarios.push(comentario);
        this.nuevoComentario = '';
        this.nuevaValoracion = 5;
      },
      (error) => console.error('Error al agregar comentario:', error)
    );
  }

  // Editar comentario
  editarComentario(comentario: Comentario) {
    const nuevoTexto = prompt("Editar comentario:", comentario.texto);
    const nuevaValoracion = Number(prompt("Editar valoración (1-5):", comentario.valoracion.toString()));
  
    if (nuevoTexto !== null && nuevaValoracion >= 1 && nuevaValoracion <= 5) {
      this.comentarioService.editarComentario(comentario.id!, nuevoTexto, nuevaValoracion)
        .subscribe(
          (comentarioEditado) => {
            comentario.texto = comentarioEditado.texto;
            comentario.valoracion = comentarioEditado.valoracion;
            alert("Comentario actualizado correctamente.");
          },
          (error) => {
            console.error("Error al editar comentario", error);
            alert("No se pudo actualizar el comentario.");
          }
        );
    }
  }
  
  // Eliminar comentario
  eliminarComentario(comentarioId: number) {
    this.comentarioService.eliminarComentario(comentarioId).subscribe(
      () => (this.comentarios = this.comentarios.filter(c => c.id !== comentarioId)),
      (error) => console.error('Error al eliminar comentario:', error)
    );
  }
}
