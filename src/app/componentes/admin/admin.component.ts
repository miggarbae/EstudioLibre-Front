import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  archivosReportados: any[] = [];
  columnasUsuarios: string[] = ['username', 'roles', 'cantidadArchivos', 'acciones'];
  usuarios: any[] = [];
  usuarioSeleccionado: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8080/api/reportes').subscribe(
      res => this.archivosReportados = res,
      err => console.error("Error al cargar reportes", err)
    );

    this.http.get<any[]>('http://localhost:8080/api/admin/usuarios').subscribe(
      res => this.usuarios = res,
      err => console.error("Error al cargar usuarios", err)
    );
  }

  toggleArchivos(user: any) {
    if (this.usuarioSeleccionado === user) {
      this.usuarioSeleccionado = null;
    } else {
      this.usuarioSeleccionado = user;
    }
  }
  
}
