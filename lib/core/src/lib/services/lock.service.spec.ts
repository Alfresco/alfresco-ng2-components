/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { CoreTestingModule } from '../testing/core.testing.module';
import { setupTestBed } from '../testing/setupTestBed';
import { Node } from '@alfresco/js-api';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';
import { AlfrescoApiService } from './alfresco-api.service';
import moment from 'moment-es6';

describe('PeopleProcessService', () => {

    let service: LockService;
    let apiService: AlfrescoApiService;

    const fakeNodeUnlocked: Node = <Node> { name: 'unlocked', isLocked: false, isFile: true };
    const fakeFolderNode: Node = <Node> { name: 'unlocked', isLocked: false, isFile: false, isFolder: true };
    const fakeNodeNoProperty: Node = <Node> { name: 'unlocked', isLocked: true, isFile: true, properties: {} };

    setupTestBed({
        imports: [CoreTestingModule],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.get(LockService);
        apiService = TestBed.get(AlfrescoApiService);
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
        const nodeReadonly: Node = <Node> {
            name: 'readonly-lock-node',
            isLocked: true,
            isFile: true,
            properties:
                {
                    'cm:lockType': 'READ_ONLY_LOCK',
                    'cm:lockLifetime': 'PERSISTENT'
                }
        };

        const nodeReadOnlyWithExpiredDate: Node = <Node> {
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
        };

        const nodeReadOnlyWithActiveExpiration: Node = <Node> {
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
        };

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
        const nodeOwnerAllowedLock: Node = <Node> {
            name: 'readonly-lock-node',
            isLocked: true,
            isFile: true,
            properties:
                {
                    'cm:lockType': 'WRITE_LOCK',
                    'cm:lockLifetime': 'PERSISTENT',
                    'cm:lockOwner': { id: 'lock-owner-user' }
                }
        };

        const nodeOwnerAllowedLockWithExpiredDate: Node = <Node> {
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
        };

        const nodeOwnerAllowedLockWithActiveExpiration: Node = <Node> {
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
        };

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
