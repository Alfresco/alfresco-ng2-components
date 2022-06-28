import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { StorageService } from '../../../services/storage.service';
import { BaseAuthenticationService } from '../base-authentication.service';
import { authConfigFactory, AuthConfigService } from './auth-config.service';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthModuleConfig, AUTH_CONFIG, AUTH_MODULE_CONFIG } from './auth.module.token';
import { AuthService } from './auth.service';
import { OIDCAuthenticationService } from './oidc-authentication.service';
import { RedirectAuthService } from './redirect-auth.service';
import { AuthenticationConfirmationComponent } from './view/authentication-confirmation/authentication-confirmation.component';

export const loginFactory = (service: RedirectAuthService) => () => service.init();

const defaultConfig: AuthModuleConfig = {
    useHash: false
};

@NgModule({
  declarations: [AuthenticationConfirmationComponent],
  imports: [
    AuthRoutingModule,
    OAuthModule.forRoot()
  ],
  providers: [
    {
        provide: AUTH_CONFIG,
        useFactory: authConfigFactory,
        deps: [AuthConfigService]
    },
    { provide: BaseAuthenticationService, useClass: OIDCAuthenticationService },
    { provide: AuthService, useExisting: RedirectAuthService },
    { provide: OAuthStorage, useExisting: StorageService },
    {
      provide: APP_INITIALIZER,
      useFactory: loginFactory,
      deps: [RedirectAuthService],
      multi: true
    }
  ]
})

export class AuthModule {
  static forRoot(config: AuthModuleConfig = defaultConfig): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
        providers: [
            { provide: AUTH_MODULE_CONFIG, useValue: config }
        ]
    };
  }
}
