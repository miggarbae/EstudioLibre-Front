import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Archivo {
  id: number;
  nombre: string;
  tipo: string;
  asignatura: string;
  nivelEstudio: string;
  descripcion: string;
  fechaSubida: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {
  private apiUrl = `${environment.apiBaseUrl}/api/archivos`;

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  obtenerArchivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`, { headers: this.obtenerHeaders() });
  }

  obtenerArchivo(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }

  editarArchivo(id: string, archivo: any) {
    return this.http.put(`${this.apiUrl}/editar/${id}`, archivo, { headers: this.obtenerHeaders() });
  }

  subirArchivo(formData: FormData): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.post(`${this.apiUrl}/subir`, formData, { headers, responseType: 'text' });
  }

  descargarArchivo(archivoId: number, tipo: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${this.apiUrl}/descarga/${archivoId}`, {
      headers,
      responseType: 'blob'
    });
  }

  buscarArchivos(termino: string): Observable<Archivo[]> {
    const body = { nombre: termino };
    return this.http.post<Archivo[]>(`${this.apiUrl}/buscar`, body, {
      headers: this.obtenerHeaders()
    });
  }

  eliminarArchivo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.obtenerHeaders()
    });
  }

  obtenerArchivosUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-archivos`, {
      headers: this.obtenerHeaders()
    });
  }
}
