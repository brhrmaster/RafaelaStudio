import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    NgbActiveModal,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient()
  ]
};
