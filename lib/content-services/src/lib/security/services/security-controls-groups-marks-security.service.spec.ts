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
import { CoreTestingModule } from '@alfresco/adf-core';
import { SecurityControlsService } from './security-controls-groups-marks-security.service';
import { fakeAuthorityClearanceApiResponse } from './mock/security-authorities.mock';
import {
    fakeGroupsApiResponse,
    createNewSecurityGroupMock
} from './mock/security-groups.mock';
import {
    fakeMarksApiResponse,
    createNewSecurityMarkMock
} from './mock/security-marks.mock';
import {
    SecurityGroupBody,
    SecurityGroupEntry,
    SecurityMarkBody,
    SecurityMarkEntry
} from '@alfresco/js-api';

describe('SecurityControlsService', () => {
    let service: SecurityControlsService;
    let securityGroupId;
    let securityMarkId;
    const securityGroupBody: SecurityGroupBody = {
        groupName: 'TestGroup',
        groupType: 'HIERARCHICAL'
    };
    const securityMarkBody: SecurityMarkBody = {
        name: 'securityMark1'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule]
        });

        service = TestBed.inject(SecurityControlsService);
    });

    it('should be able to get the list of Security groups', async () => {
        const getGroupSpy = spyOn(
            service.groupsApi,
            'getSecurityGroups'
        ).and.returnValue(Promise.resolve(fakeGroupsApiResponse));
        const groupPromise = service.getSecurityGroup( 0, 5, 'inUse');
        const group = await groupPromise;
        expect(getGroupSpy).toHaveBeenCalledWith({
            skipCount: 0,
            maxItems: 5,
            include: 'inUse'
        });

        expect(group.pagination.skipCount).toBe(0);
        expect(group.pagination.maxItems).toBe(5);
        expect(group.entries[0].id).toBe('classification');
        expect(group.entries[0].groupName).toBe('Classification');
        expect(group.entries[0].groupType).toBe('HIERARCHICAL');

        expect(group.entries[1].id).toBe(
            'd2b11d9f-2707-439f-a7c6-e7872f395553'
        );
        expect(group.entries[1].groupName).toBe('SG1');
        expect(group.entries[1].groupType).toBe('USER_REQUIRES_ALL');

        expect(group.entries[2].id).toBe(
            '1b77a32d-6b8b-4a37-b195-7f2ff2fe4ed3'
        );
        expect(group.entries[2].groupName).toBe('SG2');
        expect(group.entries[2].groupType).toBe('USER_REQUIRES_ALL');

        expect(group.entries[3].id).toBe(
            '709791f8-22dc-428a-82dd-daf3e1aa8a60'
        );
        expect(group.entries[3].groupName).toBe('SG3');
        expect(group.entries[3].groupType).toBe('USER_REQUIRES_ALL');
    });

    it('should create new security group', async () => {
        spyOn(service.groupsApi, 'createSecurityGroup').and.returnValue(
            Promise.resolve(
                new SecurityGroupEntry({
                    entry: {
                        groupName: 'TestGroup',
                        groupType: 'HIERARCHICAL',
                        id: 'eddf6269-ceba-42c6-b979-9ac445d29a94'
                    }
                })
            )
        );
        const response = await service
            .createSecurityGroup(createNewSecurityGroupMock)
            .toPromise();

        securityGroupId = response.entry.id;
        expect(response.entry.groupName).toEqual('TestGroup');
        expect(response.entry.groupType).toEqual('HIERARCHICAL');
        expect(response.entry.id).toEqual(
            'eddf6269-ceba-42c6-b979-9ac445d29a94'
        );
    });

    it('should be able to get the list of Security Marks', async () => {
        const getMarkSpy = spyOn(
            service.marksApi,
            'getSecurityMarks'
        ).and.returnValue(Promise.resolve(fakeMarksApiResponse));
        const markPromise = service.getSecurityMark(
            securityGroupId,
            0,
            'inUse'
        );
        const mark = await markPromise;

        expect(getMarkSpy).toHaveBeenCalledWith(securityGroupId, {
            skipCount: 0,
            include: 'inUse'
        });

        expect(mark.pagination.skipCount).toBe(0);
        expect(mark.pagination.maxItems).toBe(10);
        expect(mark.entries[0].groupId).toBe(
            'eddf6269-ceba-42c6-b979-9ac445d29a94'
        );
        expect(mark.entries[0].name).toBe('securityMark1');
        expect(mark.entries[0].id).toBe('ffBOeOJJ');
    });

    it('should create new security mark', async () => {
        spyOn(service.marksApi, 'createSecurityMarks').and.returnValue(
            Promise.resolve(
                new SecurityMarkEntry({
                    entry: {
                        groupId: 'eddf6269-ceba-42c6-b979-9ac445d29a94',
                        name: 'securityMark1',
                        id: 'ffBOeOJJ'
                    }
                })
            )
        );

        const response = await service.createSecurityMarks(securityGroupId, createNewSecurityMarkMock);
        if (response instanceof SecurityMarkEntry) {
            securityMarkId = response.entry.id;
            expect(response.entry.groupId).toEqual('eddf6269-ceba-42c6-b979-9ac445d29a94');
            expect(response.entry.name).toEqual('securityMark1');
            expect(response.entry.id).toEqual('ffBOeOJJ');
        }
    });

    it('should edit a security mark', async () => {
        spyOn(service.marksApi, 'updateSecurityMark').and.returnValue(
            Promise.resolve(
                new SecurityMarkEntry({
                    entry: {
                        groupId: 'eddf6269-ceba-42c6-b979-9ac445d29a94',
                        name: 'securityMark1',
                        id: 'ffBOeOJJ'
                    }
                })
            )
        );
        const response = await service
            .updateSecurityMark(
                securityGroupId,
                securityMarkId,
                securityMarkBody
            );

        securityGroupId = response.entry.groupId;
        securityMarkId = response.entry.id;
        expect(response.entry.groupId).toEqual(securityGroupId);
        expect(response.entry.name).toEqual('securityMark1');
        expect(response.entry.id).toEqual(securityMarkId);
    });

    it('should update a security group', async () => {
        spyOn(service.groupsApi, 'updateSecurityGroup').and.returnValue(
            Promise.resolve(
                new SecurityGroupEntry({
                    entry: {
                        groupName: 'TestGroup',
                        groupType: 'HIERARCHICAL',
                        id: 'eddf6269-ceba-42c6-b979-9ac445d29a94'
                    }
                })
            )
        );
        const opts = {};
        const response = await service.updateSecurityGroup(securityGroupId, securityGroupBody, opts);
        expect(response.entry.groupName).toEqual('TestGroup');
        expect(response.entry.groupType).toEqual('HIERARCHICAL');
        expect(response.entry.id).toEqual(securityGroupId);
    });

    it('should delete a security mark', async () => {
        spyOn(service.marksApi, 'deleteSecurityMark').and.returnValue(
            Promise.resolve(
                new SecurityMarkEntry({
                    entry: {
                        groupId: 'eddf6269-ceba-42c6-b979-9ac445d29a94',
                        name: 'securityMark1',
                        id: 'ffBOeOJJ'
                    }
                })
            )
        );
        const response = await service.deleteSecurityMark(securityGroupId, securityMarkId);
        securityMarkId = response.entry.id;
        securityGroupId = response.entry.groupId;
        expect(response.entry.groupId).toEqual('eddf6269-ceba-42c6-b979-9ac445d29a94');
        expect(response.entry.name).toEqual('securityMark1');
        expect(response.entry.id).toEqual('ffBOeOJJ');
    });

    it('should delete a security group', async () => {
        spyOn(service.groupsApi, 'deleteSecurityGroup').and.returnValue(
            Promise.resolve(
                new SecurityGroupEntry({
                    entry: {
                        groupName: 'TestGroup',
                        groupType: 'HIERARCHICAL',
                        id: 'eddf6269-ceba-42c6-b979-9ac445d29a94'
                    }
                })
            )
        );
        const response = await service
            .deleteSecurityGroup(securityGroupId)
            .toPromise();

        expect(response.entry.groupName).toEqual('TestGroup');
        expect(response.entry.groupType).toEqual('HIERARCHICAL');
        expect(response.entry.id).toEqual('eddf6269-ceba-42c6-b979-9ac445d29a94');
    });

    it('should be able to get clearances for authority', async () => {
        const getClearancesForAuthoritySpy = spyOn(
            service.authorityClearanceApi,
            'getAuthorityClearanceForAuthority'
        ).and.returnValue(Promise.resolve(fakeAuthorityClearanceApiResponse));
        const clearancePromise = service.getClearancesForAuthority('test-id', 0, 10);
        const clearance = await clearancePromise.toPromise();

        expect(getClearancesForAuthoritySpy).toHaveBeenCalledWith('test-id', {
            skipCount: 0,
            maxItems: 10
        });

        expect(clearance.list.pagination.skipCount).toBe(0);
        expect(clearance.list.pagination.maxItems).toBe(10);
        expect(clearance.list.entries[0].entry.id).toBe('test-id');
        expect(clearance.list.entries[0].entry.displayLabel).toBe('test-displayLabel');
        expect(clearance.list.entries[0].entry.systemGroup).toBe(false);
        expect(clearance.list.entries[0].entry.type).toBe('test-type');
    });

    it('should update a clearances for authority', async () => {
        spyOn(service.authorityClearanceApi, 'updateAuthorityClearance').and.returnValue(
            Promise.resolve(
                new SecurityMarkEntry({
                    entry: {
                        id: 'test-id',
                        name: 'test-name',
                        groupId: 'test-groupId'
                    }
                })
            )
        );
        const response = await service.updateClearancesForAuthority('test-id', [{
            groupId: 'test-group-id',
            op: 'test-op',
            id: 'test-id'
        }]).toPromise();

        if (response instanceof SecurityMarkEntry) {
            expect(response.entry.id).toEqual('test-id');
            expect(response.entry.groupId).toEqual('test-groupId');
            expect(response.entry.name).toEqual('test-name');
        }
    });

    it('should reload security groups', doneCallback => {
        service.reloadSecurityControls$.subscribe(res => {
            expect(res).toBeUndefined();
            doneCallback();
        });

        service.reloadSecurityGroups();
    });
});
