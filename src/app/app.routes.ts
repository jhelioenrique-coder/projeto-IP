import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FuncionarioComponent } from './funcionario/funcionario.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminPainelComponent } from './admin-painel/admin-painel.component';
import { SupabaseService } from './supabase.service';

const soAdmin = async () => {
    const sb = inject(SupabaseService);
    const router = inject(Router);
    if (!sb.isBrowser) return true; // no servidor (SSR), o navegador decide
    return (await sb.ehAdmin()) ? true : router.createUrlTree(['/admin/login']);
};

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },

    // Canal anônimo do funcionário e área do admin
    { path: 'canal-anonimo', component: FuncionarioComponent },
    { path: 'admin/login', component: AdminLoginComponent },
    { path: 'admin', component: AdminPainelComponent, canActivate: [soAdmin] },

    // Suas páginas existentes
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    {
        path: 'cadastro',
        loadComponent: () => import('./pages/cadastro/cadastro').then(m => m.Cadastro)
    },
    {
        path: 'chat',
        loadComponent: () => import('./pages/chat/chat').then(m => m.Chat)
    },

    { path: '**', redirectTo: '' }
];