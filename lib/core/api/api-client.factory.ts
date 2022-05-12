import { InjectionToken } from '@angular/core';
import { Constructor } from '../interface';
export interface ApiClientFactory {
  create<T>(apiClass: Constructor<T>): T;
}

export const API_CLIENT_FACTORY_TOKEN = new InjectionToken<ApiClientFactory>('api-client-factory');
