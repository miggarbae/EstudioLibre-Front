import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LoginComponent } from './componentes/auth/login/login.component';
import { RegistroComponent } from './componentes/auth/registro/registro.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: InicioComponent }, // Página de inicio
  { path: 'login', component: LoginComponent }, // Página de inicio de sesión
  { path: 'register', component: RegistroComponent }, // Página de registro
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] }, // Contenido restringido para usuarios logeados
  { path: '**', redirectTo: '' }, // Redirigir rutas desconocidas a inicio
];
