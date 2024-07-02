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
import { AppConfigService } from '../../app-config/app-config.service';
import { AuthGuardEcm } from './auth-guard-ecm.service';
import { AuthenticationService } from '../services/authentication.service';
import { RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { BasicAlfrescoAuthService } from '../basic-auth/basic-alfresco-auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RedirectAuthService } from '../oidc/redirect-auth.service';
import { EMPTY, of } from 'rxjs';
import { OidcAuthenticationService } from '../oidc/oidc-authentication.service';

describe('AuthGuardService ECM', () => {
    let authService: AuthenticationService;
    let basicAlfrescoAuthService: BasicAlfrescoAuthService;
    let oidcAuthenticationService: OidcAuthenticationService;
    let router: Router;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule, MatDialogModule],
            providers: [
                BasicAlfrescoAuthService,
                AppConfigService,
                {
                    provide: OidcAuthenticationService,
                    useValue: {
                        ssoLogin: () => {},
                        isPublicUrl: () => false,
                        hasValidIdToken: () => false,
                        isLoggedIn: () => false
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
    });

    const runAuthGuardWithContext = async (state: RouterStateSnapshot): Promise<boolean | UrlTree> => {
        const result = TestBed.runInInjectionContext(() => AuthGuardEcm(state));
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
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(true);
        const route = { url: 'some-url' } as RouterStateSnapshot;

        expect(await runAuthGuardWithContext(route)).toBeTruthy();
    });

    it('if the alfresco js api is configured with withCredentials true should canActivate be true', async () => {
        spyOn(authService, 'isBpmLoggedIn').and.returnValue(true);
        appConfigService.config.auth.withCredentials = true;

        const route = { url: 'some-url' } as RouterStateSnapshot;

        expect(await runAuthGuardWithContext(route)).toBeTruthy();
    });

    it('if the alfresco js api is NOT logged in should canActivate be false', async () => {
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
        spyOn(router, 'navigateByUrl').and.stub();
        const route = { url: 'some-url' } as RouterStateSnapshot;

        expect(await runAuthGuardWithContext(route)).toBeFalsy();
    });

    it('if the alfresco js api is NOT logged in should trigger a redirect event', async () => {
        appConfigService.config.loginRoute = 'login';

        spyOn(router, 'navigateByUrl');
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
        const route = { url: 'some-url' } as RouterStateSnapshot;

        expect(await runAuthGuardWithContext(route)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl('/login?redirectUrl=some-url'));
    });

    it('should redirect url if the alfresco js api is NOT logged in and isOAuthWithoutSilentLogin', async () => {
        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = false;
        const route = { url: 'some-url' } as RouterStateSnapshot;

        expect(await runAuthGuardWithContext(route)).toBeFalsy();
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

        const route = { url: 'abc' } as RouterStateSnapshot;

        expect(await runAuthGuardWithContext(route)).toBeFalsy();
        expect(oidcAuthenticationService.ssoLogin).toHaveBeenCalledTimes(1);
    });

    it('should not redirect url if NOT logged in and isOAuth but no silentLogin configured', async () => {
        spyOn(router, 'navigateByUrl').and.stub();
        spyOn(authService, 'isEcmLoggedIn').and.returnValue(false);
        spyOn(authService, 'isOauth').and.returnValue(true);
        appConfigService.config.oauth2.silentLogin = undefined;
        const route = { url: 'some-url' } as RouterStateSnapshot;

        expect(await runAuthGuardWithContext(route)).toBeFalsy();
        expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('should set redirect navigation commands', async () => {
        spyOn(basicAlfrescoAuthService, 'setRedirect').and.callThrough();
        spyOn(router, 'navigateByUrl').and.stub();
        const route = { url: 'some-url' } as RouterStateSnapshot;

        await runAuthGuardWithContext(route);

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM',
            url: 'some-url'
        });
        expect(basicAlfrescoAuthService.getRedirect()).toEqual('some-url');
    });

    it('should set redirect navigation commands with query params', async () => {
        spyOn(basicAlfrescoAuthService, 'setRedirect').and.callThrough();
        spyOn(router, 'navigateByUrl').and.stub();
        const route = { url: 'some-url;q=123' } as RouterStateSnapshot;

        await runAuthGuardWithContext(route);

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM',
            url: 'some-url;q=123'
        });
        expect(basicAlfrescoAuthService.getRedirect()).toEqual('some-url;q=123');
    });

    it('should set redirect navigation commands with query params', async () => {
        spyOn(basicAlfrescoAuthService, 'setRedirect').and.callThrough();
        spyOn(router, 'navigateByUrl').and.stub();
        const route = { url: '/' } as RouterStateSnapshot;

        await runAuthGuardWithContext(route);

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM',
            url: '/'
        });
        expect(basicAlfrescoAuthService.getRedirect()).toEqual('/');
    });

    it('should get redirect url from config if there is one configured', async () => {
        appConfigService.config.loginRoute = 'fakeLoginRoute';
        spyOn(basicAlfrescoAuthService, 'setRedirect').and.callThrough();
        spyOn(router, 'navigateByUrl').and.stub();
        const route = { url: 'some-url' } as RouterStateSnapshot;

        await runAuthGuardWithContext(route);

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
        spyOn(router, 'navigateByUrl').and.stub();
        const route = { url: 'some-url' } as RouterStateSnapshot;

        await runAuthGuardWithContext(route);

        expect(basicAlfrescoAuthService.setRedirect).toHaveBeenCalledWith({
            provider: 'ECM',
            url: 'some-url'
        });

        expect(materialDialog.closeAll).toHaveBeenCalled();
    });
});
