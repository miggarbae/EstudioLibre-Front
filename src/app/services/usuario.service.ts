import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  obtenerTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`, { headers: this.obtenerHeaders() });
  }

  obtenerReportes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reportes`, { headers: this.obtenerHeaders() });
  }

  obtenerUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/perfil`, {
      headers: this.obtenerHeaders()
    });
  }

  actualizarUsuario(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar`, formData, {
      headers: this.obtenerHeaders()
    });
  }

  subirImagen(id: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/imagen`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      })
    });
  }  
}
