import { Injectable, Inject } from '@angular/core';

import { WebModule, WEB_WINDOW } from './web.module';

@Injectable({
  providedIn: WebModule,
})
export class StorageService {
  private _cache = new Map<string | number | symbol, any>();

  constructor(@Inject(WEB_WINDOW) private win: Window) {
    return new Proxy(this, {
      get(target, prop) {
        if (prop === '_cache' || prop === 'clear') return target[prop];

        let val = Map.prototype.get.call(target._cache, prop);
        if (val === null) {
          val = Storage.prototype.getItem.call(
            target.win.localStorage, prop);

            if (val !== null) {
              Map.prototype.set.call(target._cache, prop, val);
            }
        }

        return val;
      },
      set(target, prop, val) {
        if (prop === '_cache' || prop === 'clear') return false;

        Map.prototype.set.call(target._cache, prop, val);
        new Promise(() => Storage.prototype.setItem.call(
          target.win.localStorage, prop, val));
        return true;
      },
      has(target, prop) {
        if (Map.prototype.has.call(target._cache, prop)) return true;
        const val = Storage.prototype.getItem.call(
          target.win.localStorage, prop);
        if (val === null) return false;
        Map.prototype.set.call(target._cache, prop, val);
      },
      deleteProperty(target, prop) {
        if (prop === '_cache' || prop === 'clear') return false;

        Storage.prototype.removeItem.call(
          target.win.localStorage, prop);
        return Map.prototype.delete.call(target._cache, prop);
      },
    });
  }

  clear() {
    this._cache.clear();
    localStorage.clear();
  }

}
