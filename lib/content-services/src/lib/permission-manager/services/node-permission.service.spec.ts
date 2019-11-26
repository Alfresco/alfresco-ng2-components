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

import { async, TestBed } from '@angular/core/testing';
import { NodePermissionService } from './node-permission.service';
import { SearchService, NodesApiService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { Node, PermissionElement } from '@alfresco/js-api';
import { of } from 'rxjs';
import { fakeEmptyResponse, fakeNodeWithOnlyLocally, fakeSiteRoles, fakeSiteNodeResponse,
         fakeNodeToRemovePermission, fakeNodeWithoutPermissions } from '../../mock/permission-list.component.mock';
import { fakeAuthorityResults } from '../../mock/add-permission.component.mock';

describe('NodePermissionService', () => {

    let service: NodePermissionService;
    let nodeService: NodesApiService;
    let searchApiService: SearchService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
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

    function returnUpdatedNode(_, nodeBody) {
        const fakeNode: Node = new Node({});
        fakeNode.id = 'fake-updated-node';
        fakeNode.permissions = nodeBody.permissions;
        return of(fakeNode);
    }

    it('should return a list of roles taken from the site groups', async(() => {
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeSiteNodeResponse));
        spyOn(service, 'getGroupMemberByGroupName').and.returnValue(of(fakeSiteRoles));

        service.getNodeRoles(fakeNodeWithOnlyLocally).subscribe((roleArray: string[]) => {
            expect(roleArray).not.toBeNull();
            expect(roleArray.length).toBe(4);
            expect(roleArray[0]).toBe('SiteCollaborator');
        });
    }));

    it('should return a list of settable if node has no site', async(() => {
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeEmptyResponse));

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

        service.updatePermissionRole(fakeNodeWithOnlyLocally, fakePermission).subscribe((node: Node) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(1);
            expect(node.permissions.locallySet[0].authorityId).toBe(fakePermission.authorityId);
            expect(node.permissions.locallySet[0].name).toBe(fakePermission.name);
            expect(node.permissions.locallySet[0].accessStatus).toBe(fakePermission.accessStatus);
        });
    }));

    it('should be able to remove a locally set permission', async(() => {
        const fakePermission: PermissionElement = <PermissionElement> {
            'authorityId': 'FAKE_PERSON_1',
            'name': 'Contributor',
            'accessStatus' : 'ALLOWED'
        };
        spyOn(nodeService, 'updateNode').and.callFake((nodeId, permissionBody) => returnUpdatedNode(nodeId, permissionBody));
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeToRemovePermission));

        service.removePermission(fakeNodeCopy, fakePermission).subscribe((node: Node) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(2);
            expect(node.permissions.locallySet[0].authorityId).not.toBe(fakePermission.authorityId);
            expect(node.permissions.locallySet[1].authorityId).not.toBe(fakePermission.authorityId);
        });
    }));

    it('should be able to update locally set permissions on the node by node id', async(() => {
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeCopy));
        spyOn(nodeService, 'updateNode').and.callFake((nodeId, permissionBody) => returnUpdatedNode(nodeId, permissionBody));
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeSiteNodeResponse));
        spyOn(service, 'getGroupMemberByGroupName').and.returnValue(of(fakeSiteRoles));

        service.updateNodePermissions('fake-node-id', fakeAuthorityResults).subscribe((node: Node) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(4);
            expect(node.permissions.locallySet[3].authorityId).not.toBe(fakeAuthorityResults[0].entry['cm:userName']);
            expect(node.permissions.locallySet[2].authorityId).not.toBe(fakeAuthorityResults[1].entry['cm:userName']);
            expect(node.permissions.locallySet[1].authorityId).not.toBe(fakeAuthorityResults[2].entry['cm:userName']);
        });
    }));

    it('should be able to update locally permissions on the node', async(() => {
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));
        spyOn(nodeService, 'updateNode').and.callFake((nodeId, permissionBody) => returnUpdatedNode(nodeId, permissionBody));

        service.updateLocallySetPermissions(fakeNodeCopy, fakeAuthorityResults, fakeSiteRoles).subscribe((node: Node) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(4);
            expect(node.permissions.locallySet[3].authorityId).not.toBe(fakeAuthorityResults[0].entry['cm:userName']);
            expect(node.permissions.locallySet[2].authorityId).not.toBe(fakeAuthorityResults[1].entry['cm:userName']);
            expect(node.permissions.locallySet[1].authorityId).not.toBe(fakeAuthorityResults[2].entry['cm:userName']);
        });
    }));

    it('should be able to update locally permissions on the node without locally set permissions', async(() => {
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeWithoutPermissions));
        fakeNodeCopy.permissions.locallySet = undefined;
        spyOn(nodeService, 'updateNode').and.callFake((nodeId, permissionBody) => returnUpdatedNode(nodeId, permissionBody));

        service.updateLocallySetPermissions(fakeNodeCopy, fakeAuthorityResults, fakeSiteRoles).subscribe((node: Node) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(3);
            expect(node.permissions.locallySet[2].authorityId).not.toBe(fakeAuthorityResults[0].entry['cm:userName']);
            expect(node.permissions.locallySet[1].authorityId).not.toBe(fakeAuthorityResults[1].entry['cm:userName']);
            expect(node.permissions.locallySet[0].authorityId).not.toBe(fakeAuthorityResults[2].entry['cm:userName']);
        });
    }));

    it('should fail when user select the same authority and role to add', async(() => {
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));

        const fakeDuplicateAuthority: any = [{
            'entry': {
                'isFolder': false,
                'search': {
                    'score': 0.3541112
                },
                'isFile': false,
                'name': 'GROUP_EVERYONE',
                'location': 'nodes',
                'id': 'GROUP_EVERYONE',
                'nodeType': 'cm:authorityContainer',
                'properties': {
                    'cm:authorityName': 'GROUP_EVERYONE'
                },
                'parentId': '030d833e-da8e-4f5c-8ef9-d809638bd04b'
            }
        }];

        service.updateLocallySetPermissions(fakeNodeCopy, fakeDuplicateAuthority, ['Contributor'])
            .subscribe(() => {

            }, (errorMessage) => {
                expect(errorMessage).not.toBeNull();
                expect(errorMessage).toBeDefined();
                expect(errorMessage).toBe('PERMISSION_MANAGER.ERROR.DUPLICATE-PERMISSION');
            });
    }));

});
