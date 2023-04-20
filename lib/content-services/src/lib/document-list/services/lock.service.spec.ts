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

import { TestBed } from '@angular/core/testing';
import { LockService } from './lock.service';
import { CoreTestingModule, setupTestBed, AlfrescoApiService } from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';
import moment from 'moment';
import { TranslateModule } from '@ngx-translate/core';

describe('PeopleProcessService', () => {

    let service: LockService;
    let apiService: AlfrescoApiService;

    const fakeNodeUnlocked: Node = { name: 'unlocked', isLocked: false, isFile: true } as Node;
    const fakeFolderNode: Node = { name: 'unlocked', isLocked: false, isFile: false, isFolder: true } as Node;
    const fakeNodeNoProperty: Node = { name: 'unlocked', isLocked: true, isFile: true, properties: {} } as Node;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(LockService);
        apiService = TestBed.inject(AlfrescoApiService);
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
            properties:
                {
                    'cm:lockType': 'READ_ONLY_LOCK',
                    'cm:lockLifetime': 'PERSISTENT'
                }
        } as Node;

        const nodeReadOnlyWithExpiredDate: Node = {
            name: 'readonly-lock-node',
            isLocked: true,
            isFile: true,
            properties:
                {
                    'cm:lockType': 'WRITE_LOCK',
                    'cm:lockLifetime': 'PERSISTENT',
                    'cm:lockOwner': { id: 'lock-owner-user' },
                    'cm:expiryDate': moment().subtract(4, 'days')
                }
        } as Node;

        const nodeReadOnlyWithActiveExpiration: Node = {
            name: 'readonly-lock-node',
            isLocked: true,
            isFile: true,
            properties:
                {
                    'cm:lockType': 'WRITE_LOCK',
                    'cm:lockLifetime': 'PERSISTENT',
                    'cm:lockOwner': { id: 'lock-owner-user' },
                    'cm:expiryDate': moment().add(4, 'days')
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
            properties:
                {
                    'cm:lockType': 'WRITE_LOCK',
                    'cm:lockLifetime': 'PERSISTENT',
                    'cm:lockOwner': { id: 'lock-owner-user' }
                }
        } as Node;

        const nodeOwnerAllowedLockWithExpiredDate: Node = {
            name: 'readonly-lock-node',
            isLocked: true,
            isFile: true,
            properties:
                {
                    'cm:lockType': 'WRITE_LOCK',
                    'cm:lockLifetime': 'PERSISTENT',
                    'cm:lockOwner': { id: 'lock-owner-user' },
                    'cm:expiryDate': moment().subtract(4, 'days')
                }
        } as Node;

        const nodeOwnerAllowedLockWithActiveExpiration: Node = {
            name: 'readonly-lock-node',
            isLocked: true,
            isFile: true,
            properties:
                {
                    'cm:lockType': 'WRITE_LOCK',
                    'cm:lockLifetime': 'PERSISTENT',
                    'cm:lockOwner': { id: 'lock-owner-user' },
                    'cm:expiryDate': moment().add(4, 'days')
                }
        } as Node;

        it('should return false when the user is the lock owner', () => {
            spyOn(apiService.getInstance(), 'getEcmUsername').and.returnValue('lock-owner-user');
            expect(service.isLocked(nodeOwnerAllowedLock)).toBeFalsy();
        });

        it('should return true when the user is not the lock owner', () => {
            spyOn(apiService.getInstance(), 'getEcmUsername').and.returnValue('banana-user');
            expect(service.isLocked(nodeOwnerAllowedLock)).toBeTruthy();
        });

        it('should return false when the user is not the lock owner but the lock is expired', () => {
            spyOn(apiService.getInstance(), 'getEcmUsername').and.returnValue('banana-user');
            expect(service.isLocked(nodeOwnerAllowedLockWithExpiredDate)).toBeFalsy();
        });

        it('should return true when is not the lock owner and the expiration date is valid', () => {
            spyOn(apiService.getInstance(), 'getEcmUsername').and.returnValue('banana-user');
            expect(service.isLocked(nodeOwnerAllowedLockWithActiveExpiration)).toBeTruthy();
        });
   });
});
