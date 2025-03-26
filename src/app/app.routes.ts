import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LoginComponent } from './componentes/auth/login/login.component';
import { RegistroComponent } from './componentes/auth/registro/registro.component';
import { EditarArchivoComponent } from './componentes/editar-archivo/editar-archivo.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './componentes/admin/admin.component';

export const routes: Routes = [
  { path: '', component: InicioComponent }, // Página de inicio
  { path: 'login', component: LoginComponent }, // Página de inicio de sesión
  { path: 'registro', component: RegistroComponent }, // Página de registro
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] }, // Contenido restringido para usuarios logeados
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }, // Página de administrador
  { path: 'editar-archivo/:id', component: EditarArchivoComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }, // Redirigir rutas desconocidas a inicio
];
