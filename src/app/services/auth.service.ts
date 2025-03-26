import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  handleLoginResponse(response: any): void {
    const token = response.token;
    localStorage.setItem('token', token);
  
    const userRole = this.tokenService.getUserRole();
    console.log('🧾 ROL OBTENIDO DESDE TOKEN:', userRole);
  
    if (userRole === 'ROLE_ADMIN') {
      this.router.navigate(['/admin']);
    } else if (userRole === 'ROLE_USER') {
      this.router.navigate(['/inicio']);
    } else {
      this.router.navigate(['/login']);
    }
  }  

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
