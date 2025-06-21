import {Routes} from '@angular/router';

export const internalRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  }
];
