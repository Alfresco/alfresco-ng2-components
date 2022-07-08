import { StorageService } from '@alfresco/adf-core/storage';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { AuthConfig, OAuthModule, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthModuleConfig, AUTH_CONFIG, AUTH_MODULE_CONFIG } from './auth.module.token';
import { AuthService } from './auth.service';
import { RedirectAuthService } from './redirect-auth.service';
import { AuthenticationConfirmationComponent } from './view/authentication-confirmation/authentication-confirmation.component';

export function loginFactory(oAuthService: OAuthService, storage: OAuthStorage, config: AuthConfig) {
    const service = new RedirectAuthService(oAuthService, storage, config);
    return () => service.init();
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
    RedirectAuthService,
    { provide: AuthService, useExisting: RedirectAuthService },
    { provide: OAuthStorage, useExisting: StorageService },
    {
      provide: APP_INITIALIZER,
      useFactory: loginFactory,
      deps: [OAuthService, OAuthStorage, AUTH_CONFIG],
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
