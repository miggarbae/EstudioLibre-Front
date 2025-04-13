import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para definir la estructura de un archivo para que TypeScript lo reconozca y pueda validar el código
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

  descargarArchivo(archivoId: number, tipo: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  
    return this.http.get(`http://localhost:8080/api/archivos/descarga/${archivoId}`, {
      headers,
      responseType: 'blob' // Mantener la respuesta en binario
    });
  }

  buscarArchivos(termino: string): Observable<Archivo[]> {
    const body = { nombre: termino };
  
    return this.http.post<Archivo[]>(`${this.apiUrl}/buscar`, body, {
      headers: this.obtenerHeaders(),
    });
  }

  eliminarArchivo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.obtenerHeaders()
    });
  }  

  // Método para ver los archivos que ha subido el usuario
  obtenerArchivosUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-archivos`, {
      headers: this.obtenerHeaders()
    });
  }
}
