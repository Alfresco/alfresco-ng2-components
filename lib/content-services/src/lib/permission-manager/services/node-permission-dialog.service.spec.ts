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
import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { NodePermissionDialogService } from './node-permission-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject, throwError } from 'rxjs';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { NodePermissionService } from './node-permission.service';
import { Node } from '@alfresco/js-api';
import { TranslateModule } from '@ngx-translate/core';

describe('NodePermissionDialogService', () => {

    let service: NodePermissionDialogService;
    let materialDialog: MatDialog;
    let spyOnDialogOpen: jasmine.Spy;
    let afterOpenObservable: Subject<any>;
    let nodePermissionService: NodePermissionService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';
        service = TestBed.inject(NodePermissionDialogService);
        materialDialog = TestBed.inject(MatDialog);
        afterOpenObservable = new Subject<any>();
        nodePermissionService = TestBed.inject(NodePermissionService);
        spyOnDialogOpen = spyOn(materialDialog, 'open').and.returnValue({
            afterOpen: () => afterOpenObservable,
            afterClosed: () => of({}),
            componentInstance: {
                error: new Subject<any>()
            }
        } as any);
    });

    describe('when node has permission to update permissions', () => {

        let fakePermissionNode = new Node({});

        beforeEach(() => {
            fakePermissionNode = { id: 'fake-permission-node', allowableOperations: ['updatePermissions']} as Node;
        });

        it('should be able to open the dialog showing node permissions', () => {
            service.openAddPermissionDialog(fakePermissionNode, [], 'fake-title');
            expect(spyOnDialogOpen).toHaveBeenCalled();
        });

        it('should return the updated node', (done) => {
            spyOn(nodePermissionService, 'updateNodePermissions').and.returnValue(of(new Node({id : 'fake-node-updated'})));
            spyOn(service, 'openAddPermissionDialog').and.returnValue(of(null));
            spyOn(nodePermissionService, 'getNodeWithRoles').and.returnValue(of({ node: fakePermissionNode, roles: [] }));
            service.updateNodePermissionByDialog('fake-node-id', 'fake-title').subscribe((node) => {
                expect(node.id).toBe('fake-node-updated');
                done();
            });
        });

        it('should throw an error if the update of the node fails', (done) => {
            spyOn(nodePermissionService, 'updateNodePermissions').and.returnValue(throwError({error : 'error'}));
            spyOn(service, 'openAddPermissionDialog').and.returnValue(of(null));
            spyOn(nodePermissionService, 'getNodeWithRoles').and.returnValue(of({ node: fakePermissionNode, roles: [] }));
            service.updateNodePermissionByDialog('fake-node-id', 'fake-title').subscribe(() => {
                throwError('This call should fail');
            }, (error) => {
                expect(error.error).toBe('error');
                done();
            });
        });
    });

    describe('when node does not have permission to update permissions', () => {

        let fakeForbiddenNode = new Node({});

        beforeEach(() => {
            fakeForbiddenNode = { id: 'fake-permission-node', allowableOperations: ['update']} as Node;
        });

        it('should not be able to open the dialog showing node permissions', () => {
            service.openAddPermissionDialog(fakeForbiddenNode, [], 'fake-title');
            expect(spyOnDialogOpen).not.toHaveBeenCalled();
        });

        it('should return the updated node', (done) => {
            spyOn(nodePermissionService, 'getNodeWithRoles').and.returnValue(of({ node: fakeForbiddenNode, roles: [] }));
            service.updateNodePermissionByDialog('fake-node-id', 'fake-title').subscribe(() => {
                throwError('This call should fail');
            },
            (error) => {
                expect(error.message).toBe('PERMISSION_MANAGER.ERROR.NOT-ALLOWED');
                done();
            });
        });
   });
});
