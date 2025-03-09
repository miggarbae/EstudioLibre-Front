import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Verifica si hay token guardado
    if (!token) {
      this.router.navigate(['/login']); // Si no hay token, redirige al login
      return false;
    }
    return true;
  }
}