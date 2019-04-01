import { NgModule } from '@angular/core';
import { InjectionToken, FactoryProvider } from '@angular/core';

import { StorageService } from './storage.service';

export const WEB_WINDOW =
  new InjectionToken<Window>('Web browsers window API');
export const WEB_HOST =
  new InjectionToken<string>('Shortcut for window.location.hostname');

export const windowFactory = () => window;
export const hostFactory = () => window.location.hostname;

export const WEB_PROVIDERS = [
  { provide: WEB_WINDOW, useFactory: windowFactory },
  { provide: WEB_HOST, useFactory: hostFactory },
];


@NgModule({
  providers: [
    WEB_PROVIDERS,
    StorageService,
  ],
})
export class WebModule { }
