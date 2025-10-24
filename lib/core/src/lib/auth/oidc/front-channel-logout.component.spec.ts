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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { FrontChannelLogoutComponent } from './front-channel-logout.component';

describe('FrontChannelLogoutComponent', () => {
    let component: FrontChannelLogoutComponent;
    let fixture: ComponentFixture<FrontChannelLogoutComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let activatedRouteMock: any;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'getStoredIssuer', 'getStoredSessionId']);
        activatedRouteMock = {
            snapshot: {
                queryParamMap: {
                    get: jasmine.createSpy('get')
                }
            }
        };

        await TestBed.configureTestingModule({
            imports: [FrontChannelLogoutComponent],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ActivatedRoute, useValue: activatedRouteMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FrontChannelLogoutComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit - logout logic', () => {
        it('should call logout when both stored and URL issuer match AND both stored and URL session ID match', () => {
            const testIssuer = 'test-issuer';
            const testSessionId = 'test-session-id';
            authServiceSpy.getStoredIssuer.and.returnValue(testIssuer);
            authServiceSpy.getStoredSessionId.and.returnValue(testSessionId);
            activatedRouteMock.snapshot.queryParamMap.get.and.callFake((param: string) => {
                if (param === 'iss') return testIssuer;
                if (param === 'sid') return testSessionId;
                return null;
            });
            component.ngOnInit();
            expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
        });

        it('should not call logout when issuer matches but session ID differs between stored and URL values', () => {
            const testIssuer = 'test-issuer';
            const storedSessionId = 'stored-session-id';
            const urlSessionId = 'different-session-id';
            authServiceSpy.getStoredIssuer.and.returnValue(testIssuer);
            authServiceSpy.getStoredSessionId.and.returnValue(storedSessionId);
            activatedRouteMock.snapshot.queryParamMap.get.and.callFake((param: string) => {
                if (param === 'iss') return testIssuer;
                if (param === 'sid') return urlSessionId;
                return null;
            });
            component.ngOnInit();
            expect(authServiceSpy.logout).not.toHaveBeenCalled();
        });

        it('should not call logout when session ID matches but issuer differs between stored and URL values', () => {
            const testSessionId = 'test-session-id';
            const storedIssuer = 'stored-issuer';
            const urlIssuer = 'different-issuer';
            authServiceSpy.getStoredIssuer.and.returnValue(storedIssuer);
            authServiceSpy.getStoredSessionId.and.returnValue(testSessionId);
            activatedRouteMock.snapshot.queryParamMap.get.and.callFake((param: string) => {
                if (param === 'iss') return urlIssuer;
                if (param === 'sid') return testSessionId;
                return null;
            });
            component.ngOnInit();
            expect(authServiceSpy.logout).not.toHaveBeenCalled();
        });

        it('should not call logout when both issuer and session ID differ between stored and URL values', () => {
            const storedIssuer = 'stored-issuer';
            const storedSessionId = 'stored-session-id';
            const urlIssuer = 'different-issuer';
            const urlSessionId = 'different-session-id';
            authServiceSpy.getStoredIssuer.and.returnValue(storedIssuer);
            authServiceSpy.getStoredSessionId.and.returnValue(storedSessionId);
            activatedRouteMock.snapshot.queryParamMap.get.and.callFake((param: string) => {
                if (param === 'iss') return urlIssuer;
                if (param === 'sid') return urlSessionId;
                return null;
            });
            component.ngOnInit();
            expect(authServiceSpy.logout).not.toHaveBeenCalled();
        });

        it('should not call logout when stored issuer is null but URL parameters are valid', () => {
            const testSessionId = 'test-session-id';
            authServiceSpy.getStoredIssuer.and.returnValue(null);
            authServiceSpy.getStoredSessionId.and.returnValue(testSessionId);
            activatedRouteMock.snapshot.queryParamMap.get.and.callFake((param: string) => {
                if (param === 'iss') return 'test-issuer';
                if (param === 'sid') return testSessionId;
                return null;
            });
            component.ngOnInit();
            expect(authServiceSpy.logout).not.toHaveBeenCalled();
        });

        it('should not call logout when stored session ID is null but URL parameters are valid', () => {
            const testIssuer = 'test-issuer';
            authServiceSpy.getStoredIssuer.and.returnValue(testIssuer);
            authServiceSpy.getStoredSessionId.and.returnValue(null);
            activatedRouteMock.snapshot.queryParamMap.get.and.callFake((param: string) => {
                if (param === 'iss') return testIssuer;
                if (param === 'sid') return 'test-session-id';
                return null;
            });
            component.ngOnInit();
            expect(authServiceSpy.logout).not.toHaveBeenCalled();
        });

        it('should not call logout when URL issuer parameter is missing but stored values are valid', () => {
            const testIssuer = 'test-issuer';
            const testSessionId = 'test-session-id';
            authServiceSpy.getStoredIssuer.and.returnValue(testIssuer);
            authServiceSpy.getStoredSessionId.and.returnValue(testSessionId);
            activatedRouteMock.snapshot.queryParamMap.get.and.callFake((param: string) => {
                if (param === 'iss') return null;
                if (param === 'sid') return testSessionId;
                return null;
            });
            component.ngOnInit();
            expect(authServiceSpy.logout).not.toHaveBeenCalled();
        });

        it('should not call logout when URL session ID parameter is missing but stored values are valid', () => {
            const testIssuer = 'test-issuer';
            const testSessionId = 'test-session-id';
            authServiceSpy.getStoredIssuer.and.returnValue(testIssuer);
            authServiceSpy.getStoredSessionId.and.returnValue(testSessionId);
            activatedRouteMock.snapshot.queryParamMap.get.and.callFake((param: string) => {
                if (param === 'iss') return testIssuer;
                if (param === 'sid') return null;
                return null;
            });
            component.ngOnInit();
            expect(authServiceSpy.logout).not.toHaveBeenCalled();
        });

        it('should not call logout when both stored and URL values are empty strings', () => {
            authServiceSpy.getStoredIssuer.and.returnValue('');
            authServiceSpy.getStoredSessionId.and.returnValue('');
            activatedRouteMock.snapshot.queryParamMap.get.and.returnValue('');
            component.ngOnInit();
            expect(authServiceSpy.logout).not.toHaveBeenCalled();
        });

        it('should not call logout when AuthService returns undefined for stored issuer and session ID', () => {
            authServiceSpy.getStoredIssuer.and.returnValue(undefined);
            authServiceSpy.getStoredSessionId.and.returnValue(undefined);
            activatedRouteMock.snapshot.queryParamMap.get.and.callFake((param: string) => {
                if (param === 'iss') return 'test-issuer';
                if (param === 'sid') return 'test-session-id';
                return null;
            });
            expect(() => component.ngOnInit()).not.toThrow();
            expect(authServiceSpy.logout).not.toHaveBeenCalled();
        });
    });
});
