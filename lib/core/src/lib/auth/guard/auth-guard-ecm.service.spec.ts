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
import { AppConfigService } from '../../app-config/app-config.service';
import { AuthGuardEcm } from './auth-guard-ecm.service';
import { AuthenticationService } from '../services/authentication.service';
import { RouterStateSnapshot, Router, ActivatedRouteSnapshot } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BasicAlfrescoAuthService } from '../basic-auth/basic-alfresco-auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RedirectAuthService } from '../oidc/redirect-auth.service';
import { EMPTY, of } from 'rxjs';
import { OidcAuthenticationService } from '../oidc/oidc-authentication.service';

describe('AuthGuardService ECM', () => {
    let authGuard: Promise<boolean>;
    let authService: AuthenticationService;
    let basicAlfrescoAuthService: BasicAlfrescoAuthService;
    let oidcAuthenticationService: OidcAuthenticationService;
    let router: Router;
    let appConfigService: AppConfigService;
    let state: RouterStateSnapshot;
    const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, MatDialogModule],
            providers: [
                BasicAlfrescoAuthService,
                AppConfigService,
                {
                    provide: OidcAuthenticationService,
                    useValue: {
                        ssoLogin: () => {},
                        isPublicUrl: () => false,
                        hasValidIdToken: () => false,
                        isLoggedIn: () => false,
                        shouldPerformSsoLogin$: of(true)
                    }
                },
                { provide: RedirectAuthService, useValue: { onLogin: EMPTY, onTokenReceived: of() } }
            ]
        });
        localStorage.clear();
        oidcAuthenticationService = TestBed.inject(OidcAuthenticationService);
        basicAlfrescoAuthService = TestBed.inject(BasicAlfrescoAuthService);
        authService = TestBed.inject(AuthenticationService);
        router = TestBed.inject(Router);
        appConfigService = TestBed.inject(AppConfigService);

        appConfigService.config.providers = 'ECM';
        appConfigService.config.auth = {};
        appConfigService.config.oauth2 = {};
        state = { url: 'some-url' } as RouterStateSnapshot;
        spyOn(router, 'navigateByUrl');
    });

    it('if the alfresco js api is logged in should canActivate be true', async () => {
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(true);

        authGuard = TestBed.runInInjectionContext(() => AuthGuardEcm(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeTruthy();
    });

    it('if the alfresco js api is configured with withCredentials true should canActivate be true', async () => {
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
        appConfigService.config.auth.withCredentials = true;

        authGuard = TestBed.runInInjectionContext(() => AuthGuardEcm(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeTruthy();
    });

    it('if the alfresco js api is NOT logged in should canActivate be false', async () => {
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);

        authGuard = TestBed.runInInjectionContext(() => AuthGuardEcm(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeFalsy();
    });

    it('if the alfresco js api is NOT logged in should trigger a redirect event', async () => {
        appConfigService.config.loginRoute = 'login';
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);

        authGuard = TestBed.runInInjectionContext(() => AuthGuardEcm(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl('/login?redirectUrl=some-url'));
    });

    it('should redirect url if the alfresco js api is NOT logged in and isOAuthWithoutSilentLogin', async () => {
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = false;

        authGuard = TestBed.runInInjectionContext(() => AuthGuardEcm(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('should redirect url if the alfresco js api is NOT logged in and isOAuth with silentLogin', async () => {
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        spyOn(oidcAuthenticationService, 'isPublicUrl').and.returnValue(false);
        spyOn(oidcAuthenticationService, 'ssoLogin').and.stub();

        appConfigService.config.oauth2 = {
            silentLogin: true,
            host: 'http://localhost:6543',
            redirectUri: '/',
            clientId: 'activiti',
            publicUrl: 'settings',
            scope: 'openid'
        };
        state = { url: 'abc' } as RouterStateSnapshot;

        authGuard = TestBed.runInInjectionContext(() => AuthGuardEcm(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeFalsy();
        expect(oidcAuthenticationService.ssoLogin).toHaveBeenCalledTimes(1);
    });

    it('should not redirect url if NOT logged in and isOAuth but no silentLogin configured', async () => {
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = undefined;

        authGuard = TestBed.runInInjectionContext(() => AuthGuardEcm(route, state)) as Promise<boolean>;

        expect(await authGuard).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('should set redirect navigation commands', async () => {
        spyOn(basicAlfrescoAuthService, 'setRedirect').and.callThrough();

        await TestBed.runInInjectionContext(() => AuthGuardEcm(route, state));

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM',
            url: 'some-url'
        });
        expect(basicAlfrescoAuthService.getRedirect()).toEqual('some-url');
    });

    it('should set redirect navigation commands with query params', async () => {
        spyOn(basicAlfrescoAuthService, 'setRedirect').and.callThrough();
        state = { url: 'some-url;q=123' } as RouterStateSnapshot;

        await TestBed.runInInjectionContext(() => AuthGuardEcm(route, state));

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM',
            url: 'some-url;q=123'
        });
        expect(basicAlfrescoAuthService.getRedirect()).toEqual('some-url;q=123');
    });

    it('should set redirect navigation commands with query params', async () => {
        spyOn(basicAlfrescoAuthService, 'setRedirect').and.callThrough();
        state = { url: '/' } as RouterStateSnapshot;

        await TestBed.runInInjectionContext(() => AuthGuardEcm(route, state));

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM',
            url: '/'
        });
        expect(basicAlfrescoAuthService.getRedirect()).toEqual('/');
    });

    it('should get redirect url from config if there is one configured', async () => {
        appConfigService.config.loginRoute = 'fakeLoginRoute';
        spyOn(basicAlfrescoAuthService, 'setRedirect').and.callThrough();

        await TestBed.runInInjectionContext(() => AuthGuardEcm(route, state));

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM',
            url: 'some-url'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl('/fakeLoginRoute?redirectUrl=some-url'));
    });

    it('should to close the material dialog if is redirect to the login', async () => {
        const materialDialog = TestBed.inject(MatDialog);
        spyOn(materialDialog, 'closeAll');
        spyOn(basicAlfrescoAuthService, 'setRedirect').and.callThrough();

        await TestBed.runInInjectionContext(() => AuthGuardEcm(route, state));

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM',
            url: 'some-url'
        });

        expect(materialDialog.closeAll).toHaveBeenCalled();
    });
});
