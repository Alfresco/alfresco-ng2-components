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
import { BffAuthService, BffUserInfo } from './bff-auth.service';
import { BffUserAccessService } from './bff-user-access.service';

describe('BffUserAccessService', () => {
    let service: BffUserAccessService;
    let bffAuthServiceSpy: jasmine.SpyObj<BffAuthService>;

    /* eslint-disable-next-line */
    function createMockUserInfo(appKey: string, roles: string[]): BffUserInfo {
        return {
            appKey,
            roles,
            sub: '',
            email: '',
            hxp_account: '',
            name: '',
            email_verified: false,
            preferred_username: '',
            given_name: '',
            family_name: ''
        };
    }

    beforeEach(() => {
        const spy = jasmine.createSpyObj('BffAuthService', ['getUser', 'login', 'logout']);
        spy.userInfo = {
            authenticated: true,
            user: createMockUserInfo('test-app', ['ROLE_USER', 'ROLE_ADMIN'])
        };

        TestBed.configureTestingModule({
            providers: [BffUserAccessService, { provide: BffAuthService, useValue: spy }]
        });

        service = TestBed.inject(BffUserAccessService);
        bffAuthServiceSpy = TestBed.inject(BffAuthService) as jasmine.SpyObj<BffAuthService>;
    });

    it('should create the service', () => {
        expect(service).toBeInstanceOf(BffUserAccessService);
    });

    describe('fetchUserAccess', () => {
        it('should set applicationAccess when user has valid appKey and roles', () => {
            bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', ['ROLE_USER', 'ROLE_ADMIN']);

            service.fetchUserAccess();

            expect(service.hasGlobalAccess(['ROLE_USER'])).toBe(true);
            expect(service.hasApplicationAccess('my-app', ['ROLE_USER'])).toBe(true);
        });

        it('should set applicationAccess to null when appKey is empty', () => {
            bffAuthServiceSpy.userInfo.user = createMockUserInfo('', ['ROLE_USER']);

            service.fetchUserAccess();

            expect(service.hasGlobalAccess(['ROLE_USER'])).toBe(false);
        });

        it('should set applicationAccess to null when roles array is empty', () => {
            bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', []);

            service.fetchUserAccess();

            expect(service.hasGlobalAccess(['ROLE_USER'])).toBe(false);
        });

        it('should set applicationAccess to null when roles is undefined', () => {
            bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', undefined as unknown as string[]);

            service.fetchUserAccess();

            expect(service.hasGlobalAccess(['ROLE_USER'])).toBe(false);
        });

        it('should handle multiple calls to fetchUserAccess', () => {
            bffAuthServiceSpy.userInfo.user = createMockUserInfo('app1', ['ROLE1']);
            service.fetchUserAccess();
            expect(service.hasApplicationAccess('app1', ['ROLE1'])).toBe(true);

            bffAuthServiceSpy.userInfo.user = createMockUserInfo('app2', ['ROLE2']);
            service.fetchUserAccess();
            expect(service.hasApplicationAccess('app2', ['ROLE2'])).toBe(true);
            expect(service.hasApplicationAccess('app1', ['ROLE1'])).toBe(false);
        });
    });

    describe('hasGlobalAccess', () => {
        describe('when rolesToCheck is empty or not provided', () => {
            it('should return true when rolesToCheck is empty array', () => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', ['ROLE_USER']);
                service.fetchUserAccess();

                expect(service.hasGlobalAccess([])).toBe(true);
            });

            it('should return true when rolesToCheck is null', () => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', ['ROLE_USER']);
                service.fetchUserAccess();

                expect(service.hasGlobalAccess(null as unknown as string[])).toBe(true);
            });

            it('should return true when rolesToCheck is undefined', () => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', ['ROLE_USER']);
                service.fetchUserAccess();

                expect(service.hasGlobalAccess(undefined as unknown as string[])).toBe(true);
            });
        });

        describe('when user has required roles', () => {
            beforeEach(() => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_VIEWER']);
                service.fetchUserAccess();
            });

            it('should return true when user has one of the required roles', () => {
                expect(service.hasGlobalAccess(['ROLE_USER'])).toBe(true);
            });

            it('should return true when user has all of the required roles', () => {
                expect(service.hasGlobalAccess(['ROLE_USER', 'ROLE_ADMIN'])).toBe(true);
            });

            it('should return true when user has at least one of multiple required roles', () => {
                expect(service.hasGlobalAccess(['ROLE_NONEXISTENT', 'ROLE_ADMIN'])).toBe(true);
            });

            it('should be case-sensitive when checking roles', () => {
                expect(service.hasGlobalAccess(['role_user'])).toBe(false);
                expect(service.hasGlobalAccess(['ROLE_USER'])).toBe(true);
            });
        });

        describe('when user lacks required roles', () => {
            beforeEach(() => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', ['ROLE_USER']);
                service.fetchUserAccess();
            });

            it('should return false when user has none of the required roles', () => {
                expect(service.hasGlobalAccess(['ROLE_ADMIN', 'ROLE_SUPERUSER'])).toBe(false);
            });
        });

        describe('when applicationAccess is not set', () => {
            it('should return false when applicationAccess is null (empty appKey)', () => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('', ['ROLE_USER']);
                service.fetchUserAccess();

                expect(service.hasGlobalAccess(['ROLE_USER'])).toBe(false);
            });

            it('should return false when applicationAccess is null (empty roles)', () => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', []);
                service.fetchUserAccess();

                expect(service.hasGlobalAccess(['ROLE_USER'])).toBe(false);
            });

            it('should return false when fetchUserAccess has not been called', () => {
                expect(service.hasGlobalAccess(['ROLE_USER'])).toBe(false);
            });
        });
    });

    describe('hasApplicationAccess', () => {
        describe('when appName is invalid', () => {
            beforeEach(() => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', ['ROLE_USER']);
                service.fetchUserAccess();
            });

            it('should return false when appName is empty string', () => {
                expect(service.hasApplicationAccess('', ['ROLE_USER'])).toBe(false);
            });

            it('should return false when appName is null', () => {
                expect(service.hasApplicationAccess(null as unknown as string, ['ROLE_USER'])).toBe(false);
            });

            it('should return false when appName is undefined', () => {
                expect(service.hasApplicationAccess(undefined as unknown as string, ['ROLE_USER'])).toBe(false);
            });
        });

        describe('when rolesToCheck is empty or not provided', () => {
            beforeEach(() => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', ['ROLE_USER']);
                service.fetchUserAccess();
            });

            it('should return true when rolesToCheck is empty array', () => {
                expect(service.hasApplicationAccess('my-app', [])).toBe(true);
            });

            it('should return true when rolesToCheck is null', () => {
                expect(service.hasApplicationAccess('my-app', null as unknown as string[])).toBe(true);
            });

            it('should return true when rolesToCheck is undefined', () => {
                expect(service.hasApplicationAccess('my-app', undefined as unknown as string[])).toBe(true);
            });
        });

        describe('when app name matches and user has roles', () => {
            beforeEach(() => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', ['ROLE_USER', 'ROLE_ADMIN']);
                service.fetchUserAccess();
            });

            it('should return true when user has the required role', () => {
                expect(service.hasApplicationAccess('my-app', ['ROLE_USER'])).toBe(true);
            });

            it('should return true when user has at least one of the required roles', () => {
                expect(service.hasApplicationAccess('my-app', ['ROLE_NONEXISTENT', 'ROLE_ADMIN'])).toBe(true);
            });

            it('should be case-sensitive when checking app name', () => {
                expect(service.hasApplicationAccess('MY-APP', ['ROLE_USER'])).toBe(false);
                expect(service.hasApplicationAccess('my-app', ['ROLE_USER'])).toBe(true);
            });

            it('should be case-sensitive when checking roles', () => {
                expect(service.hasApplicationAccess('my-app', ['role_user'])).toBe(false);
                expect(service.hasApplicationAccess('my-app', ['ROLE_USER'])).toBe(true);
            });
        });

        describe('when app name does not match', () => {
            beforeEach(() => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', ['ROLE_USER']);
                service.fetchUserAccess();
            });

            it('should return false even if user has the required roles', () => {
                expect(service.hasApplicationAccess('different-app', ['ROLE_USER'])).toBe(false);
            });
        });

        describe('when user lacks required roles', () => {
            beforeEach(() => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', ['ROLE_USER']);
                service.fetchUserAccess();
            });

            it('should return false when user has none of the required roles', () => {
                expect(service.hasApplicationAccess('my-app', ['ROLE_ADMIN', 'ROLE_SUPERUSER'])).toBe(false);
            });
        });

        describe('when applicationAccess is not set', () => {
            it('should return false when applicationAccess is null (empty appKey)', () => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('', ['ROLE_USER']);
                service.fetchUserAccess();

                expect(service.hasApplicationAccess('my-app', ['ROLE_USER'])).toBe(false);
            });

            it('should return false when applicationAccess is null (empty roles)', () => {
                bffAuthServiceSpy.userInfo.user = createMockUserInfo('my-app', []);
                service.fetchUserAccess();

                expect(service.hasApplicationAccess('my-app', ['ROLE_USER'])).toBe(false);
            });

            it('should return false when fetchUserAccess has not been called', () => {
                expect(service.hasApplicationAccess('my-app', ['ROLE_USER'])).toBe(false);
            });
        });
    });
});
