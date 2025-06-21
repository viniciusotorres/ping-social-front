import { Routes } from '@angular/router';
import {AuthGuard} from './modules/core/guards/AuthGuard.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.routes').then(m => m.authRoutes),
    },
    {

        path: 'internal',
        loadChildren: () => import('./modules/internal/internal.routes').then(m => m.internalRoutes),
        canActivate: [AuthGuard],
    }
];
