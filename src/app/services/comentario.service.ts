import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Comentario {
  id?: number;
  usuario: string;
  archivoId: number;
  texto: string;
  valoracion: number;
  fechaCreacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private apiUrl = 'http://localhost:8080/api/comentarios';

  constructor(private http: HttpClient) {}

  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Obtener comentarios de un archivo
  obtenerComentarios(archivoId: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.apiUrl}/${archivoId}`, {
      headers: this.obtenerHeaders(),
    });
  }

  // Agregar un comentario
  agregarComentario(archivoId: number, texto: string, valoracion: number): Observable<Comentario> {
    const body = { texto, valoracion };

    return this.http.post<Comentario>(`${this.apiUrl}/${archivoId}`, body, {
      headers: this.obtenerHeaders(),
    });
  }

  editarComentario(comentarioId: number, nuevoTexto: string, nuevaValoracion: number): Observable<Comentario> {
    const params = new HttpParams()
      .set('nuevoTexto', nuevoTexto)
      .set('nuevaValoracion', nuevaValoracion.toString());
  
    return this.http.put<Comentario>(`${this.apiUrl}/${comentarioId}`, null, {
      headers: this.obtenerHeaders(),
      params,
    });
  }

  // Eliminar un comentario
  eliminarComentario(comentarioId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${comentarioId}`, {
      headers: this.obtenerHeaders(),
    });
  }
}
