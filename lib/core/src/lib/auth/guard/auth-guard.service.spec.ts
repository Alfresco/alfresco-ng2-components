/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AppConfigService } from '../../app-config/app-config.service';
import { AuthGuard } from './auth-guard.service';
import { AuthenticationService } from '../services/authentication.service';
import { TranslateModule } from '@ngx-translate/core';
import { StorageService } from '../../common/services/storage.service';
import { OidcAuthenticationService } from '../oidc/oidc-authentication.service';
import { BasicAlfrescoAuthService } from '../basic-auth/basic-alfresco-auth.service';
import { RedirectAuthService } from '../oidc/redirect-auth.service';
import { EMPTY, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuardService', () => {
    let state;
    let authService: AuthenticationService;
    let router: Router;
    let storageService: StorageService;
    let appConfigService: AppConfigService;
    let basicAlfrescoAuthService: BasicAlfrescoAuthService;
    let oidcAuthenticationService: OidcAuthenticationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule, RouterTestingModule],
            providers: [
                AppConfigService,
                StorageService,
                { provide: RedirectAuthService, useValue: { onLogin: EMPTY, onTokenReceived: of() } },
                {
                    provide: OidcAuthenticationService,
                    useValue: {
                        ssoLogin: () => {},
                        isPublicUrl: () => false,
                        hasValidIdToken: () => false
                    }
                }
            ]
        });
        localStorage.clear();
        state = { url: '' };
        authService = TestBed.inject(AuthenticationService);
        basicAlfrescoAuthService = TestBed.inject(BasicAlfrescoAuthService);
        oidcAuthenticationService = TestBed.inject(OidcAuthenticationService);
        router = TestBed.inject(Router);
        appConfigService = TestBed.inject(AppConfigService);

        appConfigService.config.auth = {};
        appConfigService.config.oauth2 = {};
        storageService = TestBed.inject(StorageService);
    });

    const runAuthGuardWithContext = async (routerState: RouterStateSnapshot): Promise<boolean | UrlTree> => {
        const result = TestBed.runInInjectionContext(() => AuthGuard(routerState));
        if (result instanceof Observable) {
            return handleObservableResult(result);
        } else {
            return result;
        }
    };

    const handleObservableResult = (result: Observable<boolean | UrlTree>): Promise<boolean | UrlTree> =>
        new Promise<boolean | UrlTree>((resolve) => {
            result.subscribe((value) => {
                resolve(value);
            });
        });

    it('if the alfresco js api is logged in should canActivate be true', async () => {
        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'isLoggedIn').and.returnValue(true);

        expect(await runAuthGuardWithContext(state)).toBeTruthy();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('if the alfresco js api is NOT logged in should canActivate be false', async () => {
        state.url = 'some-url';
        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'isLoggedIn').and.returnValue(false);

        expect(await runAuthGuardWithContext(state)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('if the alfresco js api is configured with withCredentials true should canActivate be true', async () => {
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
        appConfigService.config.auth.withCredentials = true;

        const route = { url: 'some-url' } as RouterStateSnapshot;

        expect(await runAuthGuardWithContext(route)).toBeTruthy();
    });

    it('should not redirect to login', async () => {
        storageService.setItem('loginFragment', 'login');

        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(true);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = false;

        expect(await runAuthGuardWithContext(state)).toBeTruthy();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should redirect url if the User is NOT logged in and isOAuthWithoutSilentLogin', async () => {
        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = false;

        expect(await runAuthGuardWithContext(state)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('should redirect url if the User is NOT logged in and isOAuth but no silentLogin configured', async () => {
        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = undefined;

        expect(await runAuthGuardWithContext(state)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('should NOT redirect url if the User is NOT logged in and isOAuth but with silentLogin configured', async () => {
        spyOn(oidcAuthenticationService, 'ssoLogin').and.stub();
        spyOn(authService, 'isLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = true;

        expect(await runAuthGuardWithContext(state)).toBeFalsy();
        expect(oidcAuthenticationService.ssoLogin).toHaveBeenCalledTimes(1);
    });

    it('should set redirect url', async () => {
        state.url = 'some-url';
        appConfigService.config.loginRoute = 'login';

        spyOn(router, 'navigateByUrl');
        spyOn(basicAlfrescoAuthService, 'setRedirect');

        await runAuthGuardWithContext(state);

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL',
            url: 'some-url'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl('/login?redirectUrl=some-url'));
    });

    it('should set redirect url with query params', async () => {
        state.url = 'some-url;q=query';
        appConfigService.config.loginRoute = 'login';
        appConfigService.config.provider = 'ALL';

        spyOn(router, 'navigateByUrl');
        spyOn(basicAlfrescoAuthService, 'setRedirect');

        await runAuthGuardWithContext(state);

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL',
            url: 'some-url;q=query'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl('/login?redirectUrl=some-url;q=query'));
    });

    it('should get redirect url from config if there is one configured', async () => {
        state.url = 'some-url';
        appConfigService.config.loginRoute = 'fakeLoginRoute';

        spyOn(router, 'navigateByUrl');
        spyOn(basicAlfrescoAuthService, 'setRedirect');

        await runAuthGuardWithContext(state);

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL',
            url: 'some-url'
        });
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl('/fakeLoginRoute?redirectUrl=some-url'));
    });

    it('should pass actual redirect when no state segments exists', async () => {
        state.url = '/';

        spyOn(router, 'navigateByUrl');
        spyOn(basicAlfrescoAuthService, 'setRedirect');

        await runAuthGuardWithContext(state);

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ALL',
            url: '/'
        });
    });
});
