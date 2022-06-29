import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthGuard } from '../../../services/auth-guard.service';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthModuleConfig, AUTH_MODULE_CONFIG } from './auth.module.token';
import { AuthService } from './auth.service';
import { OidcAuthGuard } from './oidc-auth.guard';
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
    { provide: AuthGuard, useClass: OidcAuthGuard },
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
