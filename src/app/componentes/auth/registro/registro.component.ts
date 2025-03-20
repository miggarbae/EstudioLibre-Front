import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  usuario = { username: '', email: '', password: '' };
  apiUrl = 'http://localhost:8080/auth/register';

  constructor(private http: HttpClient, private router: Router) {}

  registrarUsuario() {
    this.http.post<{ mensaje: string }>(this.apiUrl, this.usuario).subscribe(
      response => {
        console.log("✅ Registro exitoso:", response);
        this.router.navigate(['/']); // Redirige a la página de inicio
      },
      error => {
        console.error("❌ Error al registrar usuario", error);
      }
    );
  }
}
