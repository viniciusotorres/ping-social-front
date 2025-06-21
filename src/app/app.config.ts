import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withComponentInputBinding, withHashLocation} from '@angular/router';

import { routes } from './app.routes';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import { providePrimeNG } from 'primeng/config';
import {provideHttpClient} from '@angular/common/http';
import {provideToastr} from 'ngx-toastr';
import {provideAnimations} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes, withComponentInputBinding(), withHashLocation()),
      provideAnimationsAsync(),
      provideAnimations(),
      provideHttpClient(),
      providePrimeNG({
      ripple: true,
      theme: {
        preset: 'aura'
      }
    }),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      newestOnTop: true,
      enableHtml: true,
      tapToDismiss: true,
    }),
  ]
};
