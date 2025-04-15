import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormularioService } from '../../services/formulario.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  usuarioAutenticado: boolean = false;
  username: string = '';
  esAdmin: boolean = false;

  constructor(
    private formularioService: FormularioService,
    private tokenService: TokenService,
    private router: Router
  ) {
    const token = localStorage.getItem('token');
    this.usuarioAutenticado = !!token;

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.username = payload.sub;
      this.esAdmin = payload.role === 'ROLE_ADMIN'; // 👈 comprobar el rol
    }
  }

  mostrarFormulario() {
    this.formularioService.mostrar();
  }

  irAPanelAdmin() {
    this.router.navigate(['/admin']);
  }
}