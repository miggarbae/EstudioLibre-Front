import { Component, OnInit } from '@angular/core';
import { ArchivoService } from '../../services/archivo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  archivos: any[] = [];

  constructor(private archivoService: ArchivoService) {}

  ngOnInit(): void {
    this.archivoService.obtenerArchivos().subscribe(
      data => this.archivos = data,
      error => console.error('Error al cargar archivos', error)
    );
  }
}
