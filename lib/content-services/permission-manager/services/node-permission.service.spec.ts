/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { async, TestBed } from '@angular/core/testing';
import { NodePermissionService } from './node-permission.service';
import { SearchService, NodesApiService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { MinimalNodeEntryEntity, PermissionElement } from 'alfresco-js-api';
import { Observable } from 'rxjs/Observable';
import { fakeEmptyResponse, fakeNodeWithOnlyLocally, fakeSiteRoles, fakeSiteNodeResponse } from '../../mock/permission-list.component.mock';

describe('NodePermissionService', () => {

    let service: NodePermissionService;
    let nodeService: NodesApiService;
    let searchApiService: SearchService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        providers: [
            NodePermissionService
        ]
    });

    beforeEach(() => {
        service = TestBed.get(NodePermissionService);
        searchApiService = TestBed.get(SearchService);
        nodeService = TestBed.get(NodesApiService);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    function returnUpdatedNode(nodeId, nodeBody) {
        let fakeNode: MinimalNodeEntryEntity = {};
        fakeNode.id = 'fake-updated-node';
        fakeNode.permissions = nodeBody.permissions;
        return Observable.of(fakeNode);
    }

    it('should return a list of roles taken from the site groups', async(() => {
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(Observable.of(fakeSiteNodeResponse));
        spyOn(service, 'getGroupMemeberByGroupName').and.returnValue(Observable.of(fakeSiteRoles));

        service.getNodeRoles(fakeNodeWithOnlyLocally).subscribe((roleArray: string[]) => {
            expect(roleArray).not.toBeNull();
            expect(roleArray.length).toBe(4);
            expect(roleArray[0]).toBe('SiteCollaborator');
        });
    }));

    it('should return a list of settable if node has no site', async(() => {
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(Observable.of(fakeEmptyResponse));

        service.getNodeRoles(fakeNodeWithOnlyLocally).subscribe((roleArray: string[]) => {
            expect(roleArray).not.toBeNull();
            expect(roleArray.length).toBe(5);
            expect(roleArray[0]).toBe('Contributor');
        });
    }));

    it('should be able to update a locally set permission role', async(() => {
        const fakeAccessStatus: any = 'DENIED';
        const fakePermission: PermissionElement = {
            'authorityId': 'GROUP_EVERYONE',
            'name': 'Contributor',
            'accessStatus' : fakeAccessStatus
        };

        spyOn(nodeService, 'updateNode').and.callFake((nodeId, permissionBody) => returnUpdatedNode(nodeId, permissionBody));

        service.updatePermissionRoles(fakeNodeWithOnlyLocally, fakePermission).subscribe((node: MinimalNodeEntryEntity) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(1);
            expect(node.permissions.locallySet[0].authorityId).toBe(fakePermission.authorityId);
            expect(node.permissions.locallySet[0].name).toBe(fakePermission.name);
            expect(node.permissions.locallySet[0].accessStatus).toBe(fakePermission.accessStatus);
        });
    }));

});
