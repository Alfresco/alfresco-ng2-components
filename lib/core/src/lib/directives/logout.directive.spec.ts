/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ContentChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';
import { AppConfigService } from '../app-config/app-config.service';
import { setupTestBed } from '../testing/setup-test-bed';
import { LogoutDirective } from './logout.directive';
import { CoreTestingModule } from '../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('LogoutDirective', () => {

    describe('No input', () => {

        @Component({
            selector: 'adf-test-component',
            template: '<button adf-logout></button>'
        })
        class TestComponent {
            @ContentChildren(LogoutDirective)
            logoutDirective: LogoutDirective;
        }

        let fixture: ComponentFixture<TestComponent>;
        let router: Router;
        let authService: AuthenticationService;
        let appConfig: AppConfigService;

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            declarations: [
                TestComponent
            ]
        });

        beforeEach(() => {
            router = TestBed.inject(Router);
            authService = TestBed.inject(AuthenticationService);
            appConfig = TestBed.inject(AppConfigService);
            fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            appConfig.config['loginRoute'] = undefined;
        });

        it('should redirect to login route if basic auth and loginRoute NOT defined', () => {
            spyOn(router, 'navigate');
            spyOn(authService, 'logout').and.returnValue(of(true));

            const button = fixture.nativeElement.querySelector('button');
            button.click();

            expect(authService.logout).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
        });

        it('should redirect to loginRoute if basic auth and loginRoute defined', () => {
            spyOn(router, 'navigate');
            spyOn(authService, 'isOauth').and.returnValue(false);
            appConfig.config['loginRoute'] = 'fake-base-logout';
            spyOn(authService, 'logout').and.returnValue(of(true));

            const button = fixture.nativeElement.querySelector('button');
            button.click();

            expect(authService.logout).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['fake-base-logout']);
        });

        it('should never redirect if SSO auth, because the redirect is done by the js-api', () => {
            spyOn(router, 'navigate');
            spyOn(authService, 'isOauth').and.returnValue(true);
            spyOn(authService, 'logout').and.returnValue(of(true));

            const button = fixture.nativeElement.querySelector('button');
            button.click();

            expect(authService.logout).toHaveBeenCalled();
            expect(router.navigate).not.toHaveBeenCalled();
        });

        it('should redirect to login even on logout error', () => {
            spyOn(router, 'navigate');
            spyOn(authService, 'logout').and.returnValue(throwError('err'));

            const button = fixture.nativeElement.querySelector('button');
            button.click();

            expect(authService.logout).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
        });
   });

    describe('redirectUri', () => {

        @Component({
            selector: 'adf-test-component',
            template: '<button adf-logout redirectUri="/myCustomUri"></button>'
        })
        class TestComponent {
            @ContentChildren(LogoutDirective)
            logoutDirective: LogoutDirective;
        }

        let fixture: ComponentFixture<TestComponent>;
        let router: Router;
        let authService: AuthenticationService;

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            declarations: [
                TestComponent
            ]
        });

        beforeEach(() => {
            router = TestBed.inject(Router);
            authService = TestBed.inject(AuthenticationService);
            fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
        });

        it('should redirect to the the input redirectUri on click if present', () => {
            spyOn(router, 'navigate');
            spyOn(authService, 'logout').and.returnValue(of(true));

            const button = fixture.nativeElement.querySelector('button');
            button.click();

            expect(authService.logout).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['/myCustomUri']);
        });
   });

    describe('enableRedirect', () => {

        @Component({
            selector: 'adf-test-component',
            template: '<button adf-logout [enableRedirect]="false"></button>'
        })
        class TestComponent {
            @ContentChildren(LogoutDirective)
            logoutDirective: LogoutDirective;
        }

        let fixture: ComponentFixture<TestComponent>;
        let router: Router;
        let authService: AuthenticationService;

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            declarations: [
                TestComponent
            ]
        });

        beforeEach(() => {
            router = TestBed.inject(Router);
            authService = TestBed.inject(AuthenticationService);
            fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
        });

        it('should not redirect if enableRedirect is false', () => {
            spyOn(router, 'navigate');
            spyOn(authService, 'logout').and.returnValue(of(true));
            const button = fixture.nativeElement.querySelector('button');
            button.click();

            expect(authService.logout).toHaveBeenCalled();
            expect(router.navigate).not.toHaveBeenCalled();
        });

    });
});
