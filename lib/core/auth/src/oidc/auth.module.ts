import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BaseAuthenticationService } from '../base-authentication.service';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { OIDCAuthenticationService } from './oidc-authentication.service';
import { RedirectAuthService } from './redirect-auth.service';
import { AuthenticationConfirmationComponent } from './view/authentication-confirmation/authentication-confirmation.component';

export const loginFactory = (service: RedirectAuthService) => () => service.init();

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
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule
    };
  }
}
