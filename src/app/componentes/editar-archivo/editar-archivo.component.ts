import { Component, OnInit } from '@angular/core';
import { ArchivoService } from '../../services/archivo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-archivo',
  templateUrl: './editar-archivo.component.html',
  standalone: true,
  imports: [NgIf, FormsModule],
})
export class EditarArchivoComponent implements OnInit {
  archivo = { asignatura: '', nivelEstudio: '' };
  archivoId: string = '';

  constructor(
    private archivoService: ArchivoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.archivoId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.archivoId) {
      alert('Error: No se encontró el ID del archivo.');
      return;
    }

    // Cargar datos del archivo antes de editar
    this.archivoService.obtenerArchivo(this.archivoId).subscribe(
      (data) => {
        this.archivo = data;
      },
      (error) => {
        console.error('Error al cargar el archivo', error);
        alert('Error al cargar el archivo.');
      }
    );
  }

  editarArchivo() {
    if (!this.archivoId) {
      alert('Error: No se encontró el ID del archivo.');
      return;
    }
  
    this.archivoService.editarArchivo(this.archivoId, this.archivo).subscribe(
      (response) => {
        console.log("✅ Respuesta del backend:", response);
        alert('Archivo actualizado correctamente.');
        this.router.navigate(['/']); // Redirigir tras editar
      },
      (error) => {
        console.error('❌ Error al editar archivo:', error);
        alert('Error al editar el archivo.');
      }
    );
  }  
}
