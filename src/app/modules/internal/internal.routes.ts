import {Routes} from '@angular/router';

export const internalRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'chat',
    loadComponent: () => import('./home/chat/chat.component').then(m => m.ChatComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./home/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./home/notifications/notifications.component').then(m => m.NotificationsComponent)
  }
];
