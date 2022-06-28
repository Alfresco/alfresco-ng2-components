import { InjectionToken } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';

export interface AuthModuleConfig {
    readonly useHash: boolean;
};

export const AUTH_MODULE_CONFIG = new InjectionToken<AuthModuleConfig>('AUTH_MODULE_CONFIG');
export const AUTH_CONFIG = new InjectionToken<AuthConfig | Promise<AuthConfig>>('AUTH_CONFIG');

