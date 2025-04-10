import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormularioService } from '../../services/formulario.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  usuarioAutenticado: boolean = false;
  username: string = '';

  constructor(private formularioService: FormularioService) {
    const token = localStorage.getItem('token');
    this.usuarioAutenticado = !!token;

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.username = payload.sub;
    }
  }

  mostrarFormulario() {
    this.formularioService.mostrar();
  }
}
