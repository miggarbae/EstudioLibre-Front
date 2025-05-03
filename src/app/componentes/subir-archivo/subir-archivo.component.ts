import { Component, EventEmitter, Output } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArchivoService } from '../../services/archivo.service';

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

  @Output() subidaCompleta = new EventEmitter<void>();

  constructor(private archivoService: ArchivoService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      this.nombreArchivo = file.name;

      const formatosPermitidos = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip'
      ];

      if (!formatosPermitidos.includes(file.type)) {
        alert('Formato no permitido. Solo se aceptan PDF, DOCX y ZIP.');
        this.archivoSeleccionado = null;
        return;
      }

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
        this.resetearFormulario();
        this.subidaCompleta.emit();

        setTimeout(() => location.reload(), 100);
      },
      (error) => {
        console.error('Error al subir el archivo', error);
        alert('Error al subir el archivo.');
        this.subidaCompleta.emit();
      }
    );
  }

  resetearFormulario() {
    this.vistaPrevia = null;
    this.descripcion = '';
    this.asignatura = '';
    this.nivelEstudio = '';
    this.nombreArchivo = '';
    this.archivoSeleccionado = null;
  }
}
