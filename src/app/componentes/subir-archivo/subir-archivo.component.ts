import { Component, OnInit } from '@angular/core';
import { ArchivoService } from '../../services/archivo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgFor} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subir-archivo',
  templateUrl: './subir-archivo.component.html',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor],
})
export class SubirArchivoComponent {
  archivoSeleccionado: File | null = null;
  descripcion: string = '';
  vistaPrevia: string | null = null;
  nombreArchivo: string = '';
  asignatura: string = '';
  nivelEstudio: string = '';

  materias = ['Matemáticas', 'Física', 'Química', 'Inglés', 'Historia', 'Biología', 'Lengua', 'Filosofía', 'Informática', 'Otros'];
  niveles = ['Primaria', 'Secundaria', 'Bachillerato', 'Universidad', 'Oposiciones', 'Otros'];

  constructor(private archivoService: ArchivoService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      this.nombreArchivo = file.name;

      // Verificar formato permitido
      const formatosPermitidos = ['application/pdf', 
                                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // PDF y DOCX
      if (!formatosPermitidos.includes(file.type)) {
        alert('Formato no permitido. Solo se aceptan PDF y DOCX.');
        this.archivoSeleccionado = null;
        return;
      }

      // Vista previa (solo nombre del archivo)
      this.vistaPrevia = file.name;
    }
  }

  subirArchivo() {
    if (!this.archivoSeleccionado || !this.asignatura || !this.nivelEstudio) {
      alert('Por favor, complete todos los campos antes de subir el archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', this.archivoSeleccionado);
    formData.append('descripcion', this.descripcion);
    formData.append('asignatura', this.asignatura);
    formData.append('nivelEstudio', this.nivelEstudio);

    this.archivoService.subirArchivo(formData).subscribe(
      () => {
        alert('Archivo subido correctamente.');
        this.vistaPrevia = null;
        this.descripcion = '';
        this.asignatura = '';
        this.nivelEstudio = '';
      },
      (error) => {
        console.error('Error al subir el archivo', error);
        alert('Error al subir el archivo.');
      }
    );
  }  
}
