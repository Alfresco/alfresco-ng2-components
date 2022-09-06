import { InjectionToken } from '@angular/core';

export interface AuthModuleConfig {
    readonly useHash: boolean;
}

export const AUTH_MODULE_CONFIG = new InjectionToken<AuthModuleConfig>('AUTH_MODULE_CONFIG');
