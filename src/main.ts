import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/interceptor/auth.interceptor';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(), // Aggiunto il provider per le animazioni
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
  ]
}).catch(err => console.error(err));
