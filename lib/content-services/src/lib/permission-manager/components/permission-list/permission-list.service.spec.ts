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

import { NotificationService, setupTestBed } from '@alfresco/adf-core';
import { NodesApiService } from '../../../common/services/nodes-api.service';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { PermissionListService } from './permission-list.service';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { NodePermissionService } from '../../services/node-permission.service';
import { fakeNodeInheritedOnly, fakeNodeLocalSiteManager, fakeNodeWithOnlyLocally } from '../../../mock/permission-list.component.mock';
import { PermissionDisplayModel } from '../../models/permission.model';

describe('PermissionListService', () => {
    let service: PermissionListService;
    let nodePermissionService: NodePermissionService;
    let notificationService: NotificationService;
    let nodesApiService: NodesApiService;
    const localPermission = [new PermissionDisplayModel({
        authorityId: 'GROUP_EVERYONE',
        name: 'Contributor',
        accessStatus: 'ALLOWED'
    })
    ];

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(PermissionListService);
        nodePermissionService = TestBed.inject(NodePermissionService);
        notificationService = TestBed.inject(NotificationService);
        nodesApiService = TestBed.inject(NodesApiService);
        spyOn(notificationService, 'showInfo').and.stub();
        spyOn(notificationService, 'showWarning').and.stub();
        spyOn(notificationService, 'showError').and.stub();
    });

    it('fetch Permission', (done) => {
        spyOn(nodePermissionService, 'getNodeWithRoles').and.returnValue(of({node: fakeNodeWithOnlyLocally , roles: []}));

        const subscription = service.data$.subscribe(({ node, inheritedPermissions, localPermissions, roles }) => {
            expect(node).toBe(fakeNodeWithOnlyLocally);
            expect(inheritedPermissions).toEqual([]);
            expect(roles).toEqual([]);
            expect(localPermissions).toEqual(localPermission);
            subscription.unsubscribe();
            done();
        });

        service.fetchPermission('fake node');
    });

    describe('toggle permission', () => {

        it('should show error if user does not have permission to update node', () => {
            const node = JSON.parse(JSON.stringify(fakeNodeInheritedOnly));
            const event = { source: { checked: false } };
            node.allowableOperations = [];
            spyOn(nodePermissionService, 'getNodeWithRoles').and.returnValue(of({node , roles: []}));
            spyOn(nodesApiService, 'updateNode').and.stub();
            service.fetchPermission('fetch node');
            service.toggleInherited(event as any);
            expect(nodesApiService.updateNode).not.toHaveBeenCalled();
            expect(notificationService.showError).toHaveBeenCalledWith('PERMISSION_MANAGER.ERROR.NOT-ALLOWED');
        });

        it('should include the local permission before toggle', (done) => {
            const node = JSON.parse(JSON.stringify(fakeNodeInheritedOnly));
            const event = { source: { checked: false } };
            spyOn(nodePermissionService, 'getNodeWithRoles').and.returnValue(of({node , roles: []}));
            spyOn(nodePermissionService, 'updatePermissions').and.returnValue(of(null));
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(JSON.parse(JSON.stringify(fakeNodeLocalSiteManager))));
            service.fetchPermission('fetch node');

            const subscription = service.data$.subscribe(({ localPermissions }) => {
                expect(localPermissions[0].authorityId).toBe('GROUP_site_testsite_SiteManager');
                expect(localPermissions[0].readonly).toBe(true);
                expect(localPermissions[1].authorityId).toBe('superadminuser');
                expect(localPermissions[1].readonly).toBe(undefined);
                expect(nodePermissionService.updatePermissions).toHaveBeenCalled();
                expect(nodesApiService.updateNode).toHaveBeenCalled();
                expect(notificationService.showInfo).toHaveBeenCalledWith('PERMISSION_MANAGER.MESSAGE.INHERIT-DISABLE-SUCCESS');
                subscription.unsubscribe();
                done();
            });
            service.toggleInherited(event as any);
        });

        it('should not update local permission before toggle', () => {
            const node = JSON.parse(JSON.stringify(fakeNodeInheritedOnly));
            const event = { source: { checked: false } };
            const updateNode = JSON.parse(JSON.stringify(fakeNodeInheritedOnly));
            node.permissions.locallySet = [{
                authorityId: 'GROUP_site_testsite_SiteManager',
                name: 'SiteManager',
                accessStatus: 'ALLOWED'
            }];
            updateNode.permissions.isInheritanceEnabled = false;
            spyOn(nodePermissionService, 'getNodeWithRoles').and.returnValue(of({node , roles: []}));
            spyOn(nodePermissionService, 'updatePermissions').and.returnValue(of(null));
            spyOn(nodesApiService, 'updateNode').and.returnValue(of(updateNode));
            service.fetchPermission('fetch node');

            service.toggleInherited(event as any);
            expect(nodePermissionService.updatePermissions).not.toHaveBeenCalled();
            expect(nodesApiService.updateNode).toHaveBeenCalled();
            expect(notificationService.showInfo).toHaveBeenCalledWith('PERMISSION_MANAGER.MESSAGE.INHERIT-DISABLE-SUCCESS');
        });

        it('should show message for errored toggle', () => {
            const node = JSON.parse(JSON.stringify(fakeNodeInheritedOnly));
            const event = { source: { checked: false } };
            node.permissions.isInheritanceEnabled = true;
            spyOn(nodesApiService, 'updateNode').and.returnValue(throwError('Failed to update'));
            spyOn(nodePermissionService, 'getNodeWithRoles').and.returnValue(of({node , roles: []}));
            service.fetchPermission('fetch node');

            service.toggleInherited(event as any);
            expect(nodesApiService.updateNode).toHaveBeenCalled();
            expect(notificationService.showWarning).toHaveBeenCalledWith('PERMISSION_MANAGER.MESSAGE.TOGGLE-PERMISSION-FAILED');
            expect(event.source.checked).toEqual(true);
        });
    });

    describe('delete permission', () => {
        const node = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));
        beforeEach(() => {
            spyOn(nodePermissionService, 'getNodeWithRoles').and.returnValue(of({node , roles: []}));
            service.fetchPermission('fetch node');
        });

        it('should be able to delete a permission', () => {
            spyOn(nodePermissionService, 'removePermissions').and.returnValue(of(node));
            service.deletePermissions(localPermission);
            expect(notificationService.showInfo).toHaveBeenCalledWith('PERMISSION_MANAGER.MESSAGE.PERMISSION-BULK-DELETE-SUCCESS', null, { user: 0, group: 1 });
        });

        it('should show error message for errored delete operation', () => {
            spyOn(nodePermissionService, 'removePermissions').and.returnValue(throwError('Failed operation'));
            service.deletePermissions(localPermission);
            expect(notificationService.showError).toHaveBeenCalledWith('PERMISSION_MANAGER.MESSAGE.PERMISSION-DELETE-FAIL');
        });
    });

    describe('Bulk Role', () => {
        const node = JSON.parse(JSON.stringify(fakeNodeWithOnlyLocally));
        beforeEach(() => {
            spyOn(nodePermissionService, 'getNodeWithRoles').and.returnValue(of({node , roles: []}));
            service.fetchPermission('fetch node');
        });

        it('should be able to update bulk permission', () => {
            spyOn(nodePermissionService, 'updatePermissions').and.returnValue(of(node));
            service.bulkRoleUpdate('fake-role');
            expect(notificationService.showInfo).toHaveBeenCalledWith('PERMISSION_MANAGER.MESSAGE.PERMISSION-BULK-UPDATE-SUCCESS', null, { user: 0, group: 1 });
        });

        it('should show error message for errored operation', () => {
            spyOn(nodePermissionService, 'updatePermissions').and.returnValue(throwError('Error'));
            service.bulkRoleUpdate('fake-role');
            expect(notificationService.showError).toHaveBeenCalledWith('PERMISSION_MANAGER.MESSAGE.PERMISSION-UPDATE-FAIL');
        });
    });
});
