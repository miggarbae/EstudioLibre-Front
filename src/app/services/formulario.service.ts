import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormularioService {
  private mostrarFormularioSubject = new BehaviorSubject<boolean>(false);
  mostrarFormulario$ = this.mostrarFormularioSubject.asObservable();

  mostrar() {
    this.mostrarFormularioSubject.next(true);
  }

  ocultar() {
    this.mostrarFormularioSubject.next(false);
  }
}
