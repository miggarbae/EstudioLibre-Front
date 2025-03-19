import { Component, OnInit } from '@angular/core';
import { ArchivoService } from '../../services/archivo.service';
import { CommonModule } from '@angular/common';
import { ComentarioService } from '../../services/comentario.service';
import { ComentariosComponent } from '../comentario/comentario.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule,ComentariosComponent],
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

  descargarArchivo(archivoId: number, nombre: string, tipo: string) {
    this.archivoService.descargarArchivo(archivoId, tipo).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombre; // Usar el nombre original
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error("Error al descargar el archivo", error);
    });
  }
  
}
