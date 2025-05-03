import { Component, EventEmitter, Output, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  @Input() modal: boolean = false;
  @Output() cerrar = new EventEmitter<void>();

  usuario = { username: '', email: '', password: '' };
  apiUrl = `${environment.apiBaseUrl}/api/auth/register`;
  errorRegistro: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  registrarUsuario() {
    this.http.post<{ mensaje: string }>(this.apiUrl, this.usuario).subscribe(
      response => {
        console.log("✅ Registro exitoso:", response);

        if (this.modal) {
          this.cerrar.emit();
          setTimeout(() => location.reload(), 100); // Recarga tras cerrar modal
        } else {
          this.router.navigate(['/']);
        }
      },
      error => {
        if (error.status === 400 && error.error?.mensaje?.includes('existe')) {
          this.errorRegistro = "⚠️ Ya existe un usuario con ese nombre.";
        } else {
          this.errorRegistro = "❌ Error al registrar usuario.";
          console.error("Error:", error);
        }
      }
    );
  }
}
