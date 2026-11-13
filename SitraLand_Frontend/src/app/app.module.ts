import { FooterModule } from './footer/footer.module';

import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { NavbarModule } from './navbar/navbar.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LightboxComponent } from './share/lightbox.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';


// The blue palette keeps the primary color of the previous PrimeNG "bootstrap4-light-blue" theme.
const SitraLandPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#d1e9fe',
      200: '#a6d4fe',
      300: '#7cb8fd',
      400: '#4da2fb',
      500: '#2689f8',
      600: '#1573dd',
      700: '#1257a4',
      800: '#174b82',
      900: '#19456d',
      950: '#0d2b50'
    }
  }
});

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: "right",
      distance: 12,
    },
    vertical: {
      position: "top",
      distance: 12,
      gap: 10,
    },
  },
  theme: "material",
  behaviour: {
    autoHide: 5000,
    onClick: "hide",
    onMouseover: "pauseAutoHide",
    showDismissButton: false,
    stacking: 4,
  },
  animations: {
    enabled: true,
    show: {
      preset: "slide",
      speed: 300,
      easing: "ease",
    },
    hide: {
      preset: "fade",
      speed: 300,
      easing: "ease",
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: "ease",
    },
    overlap: 150,
  },
};

@NgModule({
  declarations: [
    AppComponent,
    LightboxComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NavbarModule,
    FooterModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [
    // Angular 22 is zoneless by default, the components of this application load their
    // data into plain fields, so the classic zone based change detection is used.
    provideZoneChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: SitraLandPreset
      }
    }),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
