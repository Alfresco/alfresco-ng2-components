import { APP_INITIALIZER, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BaseAuthenticationService } from '../base-authentication.service';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { OIDCAuthenticationService } from './oidc-authentication.service';
import { RedirectAuthService } from './redirect-auth.service';
import { AuthenticationConfirmationComponent } from './view/authentication-confirmation/authentication-confirmation.component';

export const loginFactory = (service: RedirectAuthService) => () => service.init();

export interface AuthModuleConfig {
    readonly useHash: boolean;
};

const defaultConfig: AuthModuleConfig = {
    useHash: false
};

export const AUTH_MODULE_CONFIG = new InjectionToken<AuthModuleConfig>('AUTH_MODULE_CONFIG');

@NgModule({
  declarations: [AuthenticationConfirmationComponent],
  imports: [
    AuthRoutingModule,
    OAuthModule.forRoot()
  ],
  providers: [
    { provide: BaseAuthenticationService, useClass: OIDCAuthenticationService },
    { provide: AuthService, useExisting: RedirectAuthService },
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
