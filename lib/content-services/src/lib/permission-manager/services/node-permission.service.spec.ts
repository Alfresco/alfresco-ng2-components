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
import { NodePermissionService } from './node-permission.service';
import { setupTestBed } from '@alfresco/adf-core';
import { SearchService } from '../../search/services/search.service';
import { Node, PermissionElement } from '@alfresco/js-api';
import { of, throwError } from 'rxjs';
import { fakeEmptyResponse, fakeNodeWithOnlyLocally, fakeSiteRoles, fakeSiteNodeResponse,
         fakeNodeToRemovePermission, fakeNodeWithoutPermissions } from '../../mock/permission-list.component.mock';
import { fakeAuthorityResults } from '../../mock/add-permission.component.mock';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NodesApiService } from '../../common/services/nodes-api.service';

describe('NodePermissionService', () => {

    let service: NodePermissionService;
    let nodeService: NodesApiService;
    let searchApiService: SearchService;
    const fakePermissionElements: PermissionElement[] = [
        {
            authorityId: fakeAuthorityResults[0].entry.properties['cm:userName'],
            name: 'Consumer',
            accessStatus: 'ALLOWED'
        },
        {
            authorityId: fakeAuthorityResults[1].entry.properties['cm:userName'],
            name: 'Consumer',
            accessStatus: 'ALLOWED'
        },
        {
            authorityId: fakeAuthorityResults[2].entry.properties['cm:authorityName'],
            name: 'Consumer',
            accessStatus: 'ALLOWED'
        }
    ];

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(NodePermissionService);
        searchApiService = TestBed.inject(SearchService);
        nodeService = TestBed.inject(NodesApiService);
    });

    const returnUpdatedNode = (nodeBody: Node) => of(new Node({
        id: 'fake-updated-node',
        permissions: nodeBody.permissions
    }));

    it('should return a list of roles taken from the site groups', (done) => {
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeSiteNodeResponse));
        spyOn(service, 'getGroupMemberByGroupName').and.returnValue(of(fakeSiteRoles));

        service.getNodeRoles(fakeNodeWithOnlyLocally).subscribe((roleArray: string[]) => {
            expect(roleArray).not.toBeNull();
            expect(roleArray.length).toBe(4);
            expect(roleArray[0]).toBe('SiteCollaborator');
            done();
        });
    });

    it('should return a list of settable if node has no site', (done) => {
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeEmptyResponse));

        service.getNodeRoles(fakeNodeWithOnlyLocally).subscribe((roleArray: string[]) => {
            expect(roleArray).not.toBeNull();
            expect(roleArray.length).toBe(5);
            expect(roleArray[0]).toBe('Contributor');
            done();
        });
    });

    it('should be able to update a locally set permission role', (done) => {
        const fakeAccessStatus: any = 'DENIED';
        const fakePermission: PermissionElement = {
            authorityId: 'GROUP_EVERYONE',
            name: 'Contributor',
            accessStatus : fakeAccessStatus
        };

        spyOn(nodeService, 'updateNode').and.callFake((_, permissionBody) => returnUpdatedNode(permissionBody));

        service.updatePermissionRole(JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally)), fakePermission).subscribe((node: Node) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(1);
            expect(node.permissions.locallySet[0].authorityId).toBe(fakePermission.authorityId);
            expect(node.permissions.locallySet[0].name).toBe(fakePermission.name);
            expect(node.permissions.locallySet[0].accessStatus).toBe(fakePermission.accessStatus);
            done();
        });
    });

    it('should be able to remove a locally set permission', (done) => {
        const fakePermission = {
            authorityId: 'FAKE_PERSON_1',
            name: 'Contributor',
            accessStatus : 'ALLOWED'
        } as PermissionElement;
        spyOn(nodeService, 'updateNode').and.callFake((_, permissionBody) => returnUpdatedNode(permissionBody));
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeToRemovePermission));

        service.removePermission(fakeNodeCopy, fakePermission).subscribe((node: Node) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(2);
            expect(node.permissions.locallySet[0].authorityId).not.toBe(fakePermission.authorityId);
            expect(node.permissions.locallySet[1].authorityId).not.toBe(fakePermission.authorityId);
            done();
        });
    });

    it('should be able to update locally set permissions on the node by node id', (done) => {
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeCopy));
        spyOn(nodeService, 'updateNode').and.callFake((_, permissionBody) => returnUpdatedNode(permissionBody));

        service.updateNodePermissions('fake-node-id', fakePermissionElements).subscribe((node: Node) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(4);
            expect(node.permissions.locallySet[3].authorityId).not.toBe(fakeAuthorityResults[0].entry['cm:userName']);
            expect(node.permissions.locallySet[2].authorityId).not.toBe(fakeAuthorityResults[1].entry['cm:userName']);
            expect(node.permissions.locallySet[1].authorityId).not.toBe(fakeAuthorityResults[2].entry['cm:userName']);
            done();
        });
    });

    it('should be able to update locally permissions on the node', (done) => {
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));
        spyOn(nodeService, 'updateNode').and.callFake((_, permissionBody) => returnUpdatedNode(permissionBody));

        service.updateLocallySetPermissions(fakeNodeCopy, fakePermissionElements).subscribe((node: Node) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(4);
            expect(node.permissions.locallySet[3].authorityId).not.toBe(fakeAuthorityResults[0].entry['cm:userName']);
            expect(node.permissions.locallySet[2].authorityId).not.toBe(fakeAuthorityResults[1].entry['cm:userName']);
            expect(node.permissions.locallySet[1].authorityId).not.toBe(fakeAuthorityResults[2].entry['cm:userName']);
            done();
        });
    });

    it('should be able to update locally permissions on the node without locally set permissions', (done) => {
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeWithoutPermissions));
        fakeNodeCopy.permissions.locallySet = undefined;
        spyOn(nodeService, 'updateNode').and.callFake((_, permissionBody) => returnUpdatedNode(permissionBody));
        service.updateLocallySetPermissions(fakeNodeCopy, fakePermissionElements).subscribe((node: Node) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(3);
            expect(node.permissions.locallySet[2].authorityId).not.toBe(fakeAuthorityResults[0].entry['cm:userName']);
            expect(node.permissions.locallySet[1].authorityId).not.toBe(fakeAuthorityResults[1].entry['cm:userName']);
            expect(node.permissions.locallySet[0].authorityId).not.toBe(fakeAuthorityResults[2].entry['cm:userName']);
            done();
        });
    });

    it('should fail when user select the same authority and role to add', (done) => {
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));

        const fakeDuplicateAuthority: PermissionElement []  = [{
            authorityId: 'GROUP_EVERYONE',
            accessStatus: 'ALLOWED',
            name: 'Contributor'
        }];

        service.updateLocallySetPermissions(fakeNodeCopy, fakeDuplicateAuthority)
            .subscribe(
                () => {
                    fail('should throw exception');
                },
                (errorMessage) => {
                    expect(errorMessage).not.toBeNull();
                    expect(errorMessage).toBeDefined();
                    expect(errorMessage).toBe('PERMISSION_MANAGER.ERROR.DUPLICATE-PERMISSION');
                    done();
                }
            );
    });

    it('should be able to remove the locallyset permission', (done) => {
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeWithoutPermissions));
        fakeNodeCopy.permissions.locallySet = [...fakePermissionElements];
        spyOn(nodeService, 'updateNode').and.callFake((_, permissionBody) => returnUpdatedNode(permissionBody));
        service.removePermissions(fakeNodeCopy, [fakePermissionElements[2]]).subscribe((node) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(2);
            expect(node.permissions.locallySet[0].authorityId).toBe(fakePermissionElements[0].authorityId);
            expect(node.permissions.locallySet[1].authorityId).toBe(fakePermissionElements[1].authorityId);
            done();
        });
    });

    it('should be able to replace the locally set', (done) => {
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));
        fakeNodeCopy.permissions.locallySet = [];
        spyOn(nodeService, 'updateNode').and.callFake((_, permissionBody) => returnUpdatedNode(permissionBody));
        service.updatePermissions(fakeNodeCopy, fakePermissionElements).subscribe((node: Node) => {
            expect(node).not.toBeNull();
            expect(node.id).toBe('fake-updated-node');
            expect(node.permissions.locallySet.length).toBe(3);
            expect(node.permissions.locallySet[0].authorityId).toBe(fakePermissionElements[0].authorityId);
            expect(node.permissions.locallySet[1].authorityId).toBe(fakePermissionElements[1].authorityId);
            expect(node.permissions.locallySet[2].authorityId).toBe(fakePermissionElements[2].authorityId);
            done();
        });
    });

    it('should be able to get node and its roles', (done) => {
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeCopy));
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(of(fakeSiteNodeResponse));
        spyOn(service, 'getGroupMemberByGroupName').and.returnValue(of(fakeSiteRoles));
        service.getNodeWithRoles('node-id').subscribe(({ node, roles }) => {
            expect(node).toBe(fakeNodeCopy);
            expect(roles.length).toBe(4);
            expect(roles[0].role).toBe('SiteCollaborator');
            done();
        });
    });

    it('should provide node and default role if search API failed', (done) => {
        const fakeNodeCopy = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeCopy));
        spyOn(searchApiService, 'searchByQueryBody').and.returnValue(throwError('search service down'));
        service.getNodeWithRoles('node-id').subscribe(({ node, roles }) => {
            expect(node).toBe(fakeNodeCopy);
            expect(roles.length).toBe(5);
            expect(roles[0].role).toBe('Contributor');
            done();
        });
    });
});
