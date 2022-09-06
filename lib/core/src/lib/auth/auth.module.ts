import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { AuthConfig, AUTH_CONFIG, OAuthModule, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { OidcAuthGuard } from './oidc-auth.guard';
import { AlfrescoApiServiceWithAngularBasedHttpClient } from '../api-factories/alfresco-api-service-with-angular-based-http-client';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { AuthGuard } from '../services/auth-guard.service';
import { AuthenticationService } from '../services/authentication.service';
import { StorageService } from '../services/storage.service';
import { AuthModuleConfig, AUTH_MODULE_CONFIG } from './auth-config';
import { authConfigFactory, AuthConfigService } from './auth-config.service';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { OIDCAuthenticationService } from './oidc-authentication.service';
import { RedirectAuthService } from './redirect-auth.service';
import { AuthenticationConfirmationComponent } from './view/authentication-confirmation/authentication-confirmation.component';


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
