import { Component, EventEmitter, Output, Input } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../services/token.service';

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

  @Input() modal: boolean = false;
  @Output() cerrar = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        this.authService.handleLoginResponse(response);

        if (this.modal) {
          this.cerrar.emit();
          setTimeout(() => location.reload(), 100); // Opcional: recarga
        }
      },
      error => console.error('Error en login', error)
    );
  }
}
