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
import { LockService } from './lock.service';
import { AuthenticationService, RedirectAuthService } from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';
import { addDays, subDays } from 'date-fns';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EMPTY, of } from 'rxjs';

describe('LockService', () => {
    let service: LockService;
    let authenticationService: AuthenticationService;

    const fakeNodeUnlocked: Node = { name: 'unlocked', isLocked: false, isFile: true } as Node;
    const fakeFolderNode: Node = { name: 'unlocked', isLocked: false, isFile: false, isFolder: true } as Node;
    const fakeNodeNoProperty: Node = { name: 'unlocked', isLocked: true, isFile: true, properties: {} } as Node;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: RedirectAuthService, useValue: { onLogin: EMPTY, onTokenReceived: of() } }]
        });
        service = TestBed.inject(LockService);
        authenticationService = TestBed.inject(AuthenticationService);
    });

    it('should return false when no lock is configured', () => {
        expect(service.isLocked(fakeNodeUnlocked)).toBeFalsy();
    });

    it('should return false when isLocked is true but property `cm:lockType` is not present', () => {
        expect(service.isLocked(fakeNodeNoProperty)).toBeFalsy();
    });

    it('should return false when a node folder', () => {
        expect(service.isLocked(fakeFolderNode)).toBeFalsy();
    });

    describe('When the lock is readonly', () => {
        const nodeReadonly: Node = {
            name: 'readonly-lock-node',
            isLocked: true,
            isFile: true,
            properties: {
                'cm:lockType': 'READ_ONLY_LOCK',
                'cm:lockLifetime': 'PERSISTENT'
            }
        } as Node;

        const nodeReadOnlyWithExpiredDate: Node = {
            name: 'readonly-lock-node',
            isLocked: true,
            isFile: true,
            properties: {
                'cm:lockType': 'WRITE_LOCK',
                'cm:lockLifetime': 'PERSISTENT',
                'cm:lockOwner': { id: 'lock-owner-user' },
                'cm:expiryDate': subDays(new Date(), 4)
            }
        } as Node;

        const nodeReadOnlyWithActiveExpiration: Node = {
            name: 'readonly-lock-node',
            isLocked: true,
            isFile: true,
            properties: {
                'cm:lockType': 'WRITE_LOCK',
                'cm:lockLifetime': 'PERSISTENT',
                'cm:lockOwner': { id: 'lock-owner-user' },
                'cm:expiryDate': addDays(new Date(), 4)
            }
        } as Node;

        it('should return true when readonly lock is active', () => {
            expect(service.isLocked(nodeReadonly)).toBeTruthy();
        });

        it('should return false when readonly lock is expired', () => {
            expect(service.isLocked(nodeReadOnlyWithExpiredDate)).toBeFalsy();
        });

        it('should return true when readonly lock is active and expiration date is active', () => {
            expect(service.isLocked(nodeReadOnlyWithActiveExpiration)).toBeTruthy();
        });
    });

    describe('When only the lock owner is allowed', () => {
        const nodeOwnerAllowedLock: Node = {
            name: 'readonly-lock-node',
            isLocked: true,
            isFile: true,
            properties: {
                'cm:lockType': 'WRITE_LOCK',
                'cm:lockLifetime': 'PERSISTENT',
                'cm:lockOwner': { id: 'lock-owner-user' }
            }
        } as Node;

        const nodeOwnerAllowedLockWithExpiredDate: Node = {
            name: 'readonly-lock-node',
            isLocked: true,
            isFile: true,
            properties: {
                'cm:lockType': 'WRITE_LOCK',
                'cm:lockLifetime': 'PERSISTENT',
                'cm:lockOwner': { id: 'lock-owner-user' },
                'cm:expiryDate': subDays(new Date(), 4)
            }
        } as Node;

        const nodeOwnerAllowedLockWithActiveExpiration: Node = {
            name: 'readonly-lock-node',
            isLocked: true,
            isFile: true,
            properties: {
                'cm:lockType': 'WRITE_LOCK',
                'cm:lockLifetime': 'PERSISTENT',
                'cm:lockOwner': { id: 'lock-owner-user' },
                'cm:expiryDate': addDays(new Date(), 4)
            }
        } as Node;

        it('should return false when the user is the lock owner', () => {
            spyOn(authenticationService, 'getUsername').and.returnValue('lock-owner-user');
            expect(service.isLocked(nodeOwnerAllowedLock)).toBeFalsy();
        });

        it('should return true when the user is not the lock owner', () => {
            spyOn(authenticationService, 'getUsername').and.returnValue('banana-user');
            expect(service.isLocked(nodeOwnerAllowedLock)).toBeTruthy();
        });

        it('should return false when the user is not the lock owner but the lock is expired', () => {
            spyOn(authenticationService, 'getUsername').and.returnValue('banana-user');
            expect(service.isLocked(nodeOwnerAllowedLockWithExpiredDate)).toBeFalsy();
        });

        it('should return true when is not the lock owner and the expiration date is valid', () => {
            spyOn(authenticationService, 'getUsername').and.returnValue('banana-user');
            expect(service.isLocked(nodeOwnerAllowedLockWithActiveExpiration)).toBeTruthy();
        });
    });
});
