import { APP_INITIALIZER, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { AuthConfig, AUTH_CONFIG, OAuthModule, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { OidcAuthGuard } from '.';
import { AlfrescoApiServiceWithAngularBasedHttpClient } from '../api-factories/alfresco-api-service-with-angular-based-http-client';
import { AlfrescoApiService, AuthenticationService, AuthGuard } from '../services';
import { StorageService } from '../services/storage.service';
import { authConfigFactory, AuthConfigService } from './auth-config.service';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { OIDCAuthenticationService } from './oidc-authentication.service';
import { RedirectAuthService } from './redirect-auth.service';
import { AuthenticationConfirmationComponent } from './view/authentication-confirmation/authentication-confirmation.component';

export interface AuthModuleConfig {
    readonly useHash: boolean;
}

export const AUTH_MODULE_CONFIG = new InjectionToken<AuthModuleConfig>('AUTH_MODULE_CONFIG');

export function loginFactory(oAuthService: OAuthService, storage: OAuthStorage, config: AuthConfig) {
    const service = new RedirectAuthService(oAuthService, storage, config);
    return () => service.init();
}

@NgModule({
    declarations: [AuthenticationConfirmationComponent],
    imports: [AuthRoutingModule, OAuthModule.forRoot()],
    providers: [
        { provide: OAuthStorage, useExisting: StorageService },
        { provide: AuthGuard, useClass: OidcAuthGuard },
        { provide: AuthenticationService, useClass: OIDCAuthenticationService },
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceWithAngularBasedHttpClient },
        {
            provide: AUTH_CONFIG,
            useFactory: authConfigFactory,
            deps: [AuthConfigService]
        },
        RedirectAuthService,
        { provide: AuthService, useExisting: RedirectAuthService },
        {
            provide: APP_INITIALIZER,
            useFactory: loginFactory,
            deps: [OAuthService, OAuthStorage, AUTH_CONFIG],
            multi: true
        }
    ]
})
export class AuthModule {
    static forRoot(config: AuthModuleConfig = { useHash: false }): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [{ provide: AUTH_MODULE_CONFIG, useValue: config }]
        };
    }
}
