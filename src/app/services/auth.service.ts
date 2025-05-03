import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api/auth`;

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
    if (userRole === 'ROLE_ADMIN') {
      this.router.navigate(['/admin']).then(() => location.reload());
    } else if (userRole === 'ROLE_USER') {
      this.router.navigate(['/inicio']).then(() => location.reload());
    } else {
      this.router.navigate(['/login']);
    }
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/login']).then(() => location.reload());
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
