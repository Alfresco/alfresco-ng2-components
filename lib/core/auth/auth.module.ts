import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthModuleConfig, AUTH_MODULE_CONFIG } from './auth.module.token';
import { AuthService } from './auth.service';
import { RedirectAuthService } from './redirect-auth.service';
import { AuthenticationConfirmationComponent } from './view/authentication-confirmation/authentication-confirmation.component';

export function loginFactory(service: RedirectAuthService) {
    return service.init();
};

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
