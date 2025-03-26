import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../services/token.service'; // Importar TokenService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService // Inyectar el servicio
  ) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        this.authService.handleLoginResponse(response);
      },
      error => console.error('Error en login', error)
    );
  }  
}
