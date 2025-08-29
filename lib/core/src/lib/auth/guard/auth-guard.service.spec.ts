/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AppConfigService } from '../../app-config/app-config.service';
import { AuthGuard } from './auth-guard';
import { AuthenticationService } from '../services/authentication.service';
import { StorageService } from '../../common/services/storage.service';
import { OidcAuthenticationService } from '../oidc/oidc-authentication.service';
import { BasicAlfrescoAuthService } from '../basic-auth/basic-alfresco-auth.service';
import { RedirectAuthService } from '../oidc/redirect-auth.service';
import { EMPTY, of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { provideCoreAuthTesting } from '../../testing/';

describe('AuthGuardService', () => {
    let state: RouterStateSnapshot;
    let authService: AuthenticationService;
    let router: Router;
    let authGuard: Promise<boolean>;
    let storageService: StorageService;
    let appConfigService: AppConfigService;
    let basicAlfrescoAuthService: BasicAlfrescoAuthService;
    let oidcAuthenticationService: OidcAuthenticationService;
    const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                provideCoreAuthTesting(),
                { provide: RedirectAuthService, useValue: { onLogin: EMPTY, onTokenReceived: of(), init: () => {} } },
                {
                    provide: OidcAuthenticationService,
                    useValue: {
                        ssoLogin: () => {},
                        isPublicUrl: () => false,
                        hasValidIdToken: () => false,
                        shouldPerformSsoLogin$: of(true)
                    }
                }
            ]
        });
        localStorage.clear();
        state = { url: 'some-url' } as RouterStateSnapshot;
        authService = TestBed.inject(AuthenticationService);
        basicAlfrescoAuthService = TestBed.inject(BasicAlfrescoAuthService);
        oidcAuthenticationService = TestBed.inject(OidcAuthenticationService);
        router = TestBed.inject(Router);
        appConfigService = TestBed.inject(AppConfigService);

        appConfigService.config.auth = {};
        appConfigService.config.oauth2 = {};
        storageService = TestBed.inject(StorageService);
        spyOn(router, 'navigateByUrl');
    });

    it('if the alfresco js api is logged in should canActivate be true', async () => {
        spyOn(authService, 'isLoggedIn').and.returnValue(true);

        authGuard = TestBed.runInInjectionContext(() => AuthGuard(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeTruthy();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('if the alfresco js api is NOT logged in should canActivate be false', async () => {
        spyOn(authService, 'isLoggedIn').and.returnValue(false);

        authGuard = TestBed.runInInjectionContext(() => AuthGuard(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('if the alfresco js api is configured with withCredentials true should canActivate be true', async () => {
        spyOn(authService, 'isLoggedIn').and.returnValue(true);
        appConfigService.config.auth.withCredentials = true;

        authGuard = TestBed.runInInjectionContext(() => AuthGuard(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeTruthy();
    });

    it('should not redirect to login', async () => {
        storageService.setItem('loginFragment', 'login');
        spyOn(authService, 'isLoggedIn').and.returnValue(true);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = false;

        authGuard = TestBed.runInInjectionContext(() => AuthGuard(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeTruthy();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should redirect url if the User is NOT logged in and isOAuthWithoutSilentLogin', async () => {
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = false;

        authGuard = TestBed.runInInjectionContext(() => AuthGuard(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('should redirect url if the User is NOT logged in and isOAuth but no silentLogin configured', async () => {
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = undefined;

        authGuard = TestBed.runInInjectionContext(() => AuthGuard(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('should NOT redirect url if the User is NOT logged in and isOAuth but with silentLogin configured', async () => {
        spyOn(oidcAuthenticationService, 'ssoLogin').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = true;

        authGuard = TestBed.runInInjectionContext(() => AuthGuard(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeFalsy();
        expect(oidcAuthenticationService.ssoLogin).toHaveBeenCalledTimes(1);
    });

    it('should NOT call ssoLogin if user is authenticated or discovery document is not loaded', async () => {
        spyOn(oidcAuthenticationService, 'ssoLogin').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = true;
        oidcAuthenticationService.shouldPerformSsoLogin$ = of(false);

        authGuard = TestBed.runInInjectionContext(() => AuthGuard(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeFalsy();
        expect(oidcAuthenticationService.ssoLogin).toHaveBeenCalledTimes(0);
    });

    it('should set redirect url', async () => {
        appConfigService.config.loginRoute = 'login';
        spyOn(basicAlfrescoAuthService, 'setRedirect');

        await TestBed.runInInjectionContext(() => AuthGuard(route, state));

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL',
            url: 'some-url'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl('/login?redirectUrl=some-url'));
    });

    it('should emit onLogout if the user is NOT logged in and basic authentication is used', async () => {
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(false);
        appConfigService.config.loginRoute = 'login';
        spyOn(basicAlfrescoAuthService.onLogout, 'next');

        await TestBed.runInInjectionContext(() => AuthGuard(route, state));

        expect(basicAlfrescoAuthService.onLogout.next).toHaveBeenCalledWith(true);
    });

    it('should set redirect url with query params', async () => {
        state.url = 'some-url;q=query';
        appConfigService.config.loginRoute = 'login';
        appConfigService.config.provider = 'ALL';
        spyOn(basicAlfrescoAuthService, 'setRedirect');

        await TestBed.runInInjectionContext(() => AuthGuard(route, state));

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL',
            url: 'some-url;q=query'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl('/login?redirectUrl=some-url;q=query'));
    });

    it('should get redirect url from config if there is one configured', async () => {
        appConfigService.config.loginRoute = 'fakeLoginRoute';
        spyOn(basicAlfrescoAuthService, 'setRedirect');

        await TestBed.runInInjectionContext(() => AuthGuard(route, state));

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL',
            url: 'some-url'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl('/fakeLoginRoute?redirectUrl=some-url'));
    });

    it('should pass actual redirect when no state segments exists', async () => {
        state.url = '/';
        spyOn(basicAlfrescoAuthService, 'setRedirect');

        await TestBed.runInInjectionContext(() => AuthGuard(route, state));

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL',
            url: '/'
        });
    });
});
