import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { SubirArchivoComponent } from '../subir-archivo/subir-archivo.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SubirArchivoComponent, MatToolbarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  usuarioLogeado: boolean = false; //variable para verificar si el usuario esta logeado
  rolUsuario: string | null = null; //variable para verificar si el usuario es admin

  mostrarFormulario: boolean = false; // Variable para mostrar/ocultar el formulario de subir archivo
  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit(): void {
    this.usuarioLogeado = !!localStorage.getItem('token');
    this.rolUsuario = this.tokenService.getUserRole(); // Obtenemos el rol del token
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

  logout() {
    localStorage.removeItem('token');
    this.usuarioLogeado = false;
    this.router.navigate(['/']);
  }
}