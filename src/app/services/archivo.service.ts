import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {
  private apiUrl = 'http://localhost:8080/api/archivos'; // URL del backend

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {
    const token = localStorage.getItem('token'); // Recupera el token del LocalStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  obtenerArchivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`, { headers: this.obtenerHeaders() });
  }

  // Método para obtener un archivo por ID
  obtenerArchivo(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }

  editarArchivo(id: string, archivo: any) {
    const headers = this.obtenerHeaders(); // Esto asegura que incluye el token
    
    return this.http.put(`${this.apiUrl}/editar/${id}`, archivo, { headers });
  }

  subirArchivo(formData: FormData): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  
    return this.http.post(`${this.apiUrl}/subir`, formData, { headers, responseType: 'text' });
  }  
}
