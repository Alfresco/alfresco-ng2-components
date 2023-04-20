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
import { ContentService } from './content.service';
import { AppConfigService, AuthenticationService, StorageService, setupTestBed, CoreTestingModule } from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('ContentService', () => {

    let contentService: ContentService;
    let authService: AuthenticationService;
    let storage: StorageService;
    let node: any;

    const nodeId = 'fake-node-id';

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        authService = TestBed.inject(AuthenticationService);
        contentService = TestBed.inject(ContentService);
        storage = TestBed.inject(StorageService);
        storage.clear();

        node = {
            entry: {
                id: nodeId
            }
        };

        jasmine.Ajax.install();

        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config = {
            ecmHost: 'http://localhost:9876/ecm',
            provider: 'ECM'
        };
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should return a valid content URL', (done) => {
        authService.login('fake-username', 'fake-password').subscribe(() => {
            expect(contentService.getContentUrl(node)).toContain('/ecm/alfresco/api/' +
                '-default-/public/alfresco/versions/1/nodes/fake-node-id/content?attachment=false&alf_ticket=fake-post-ticket');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 201,
            contentType: 'application/json',
            responseText: JSON.stringify({ entry: { id: 'fake-post-ticket', userId: 'admin' } })
        });
    });

    describe('AllowableOperations', () => {

        it('should hasAllowableOperations be false if allowableOperation is not present in the node', () => {
            const permissionNode = new Node({});
            expect(contentService.hasAllowableOperations(permissionNode, 'create')).toBeFalsy();
        });

        it('should hasAllowableOperations be true if allowableOperation is present and you have the permission for the request operation', () => {
            const permissionNode = new Node({ allowableOperations: ['delete', 'update', 'create', 'updatePermissions'] });

            expect(contentService.hasAllowableOperations(permissionNode, 'create')).toBeTruthy();
        });

        it('should hasAllowableOperations be false if allowableOperation is present but you don\'t have the permission for the request operation', () => {
            const permissionNode = new Node({ allowableOperations: ['delete', 'update', 'updatePermissions'] });
            expect(contentService.hasAllowableOperations(permissionNode, 'create')).toBeFalsy();
        });

        it('should hasAllowableOperations works in the opposite way with negate value', () => {
            const permissionNode = new Node({ allowableOperations: ['delete', 'update', 'updatePermissions'] });
            expect(contentService.hasAllowableOperations(permissionNode, '!create')).toBeTruthy();
        });

        it('should hasAllowableOperations return false if no permission parameter are passed', () => {
            const permissionNode = new Node({ allowableOperations: ['delete', 'update', 'updatePermissions'] });
            expect(contentService.hasAllowableOperations(permissionNode, null)).toBeFalsy();
        });

        it('should havePermission return true if permission parameter is copy', () => {
            const permissionNode = null;
            expect(contentService.hasAllowableOperations(permissionNode, 'copy')).toBeTruthy();
        });
    });

    describe('Permissions', () => {

        it('should havePermission be false if allowableOperation is not present in the node', () => {
            const permissionNode = new Node({});
            expect(contentService.hasPermissions(permissionNode, 'manager')).toBeFalsy();
        });

        it('should havePermission be true if permissions is present and you have the permission for the request operation', () => {
            const permissionNode = new Node({ permissions: { locallySet: [{ name: 'manager', authorityId: 'user1' }, { name: 'collaborator', authorityId: 'user2' }, { name: 'consumer', authorityId: 'user3' }] } });

            expect(contentService.hasPermissions(permissionNode, 'manager', 'user1')).toBeTruthy();
        });

        it('should havePermission be false if permissions is present but you don\'t have the permission for the request operation', () => {
            const permissionNode = new Node({ permissions: { locallySet: [{ name: 'collaborator', authorityId: 'user1' }, { name: 'consumer', authorityId: 'user2' }] } });
            expect(contentService.hasPermissions(permissionNode, 'manager', 'user1')).toBeFalsy();
        });

        it('should havePermission works in the opposite way with negate value', () => {
            const permissionNode = new Node({ permissions: { locallySet: [{ name: 'collaborator', authorityId: 'user1' }, { name: 'consumer', authorityId: 'user2' }] } });
            expect(contentService.hasPermissions(permissionNode, '!manager', 'user1')).toBeTruthy();
        });

        it('should havePermission return false if no permission parameter are passed', () => {
            const permissionNode = new Node({ permissions: { locallySet: [{ name: 'collaborator', authorityId: 'user1' }, { name: 'consumer', authorityId: 'user2' }] } });
            expect(contentService.hasPermissions(permissionNode, null, 'user1')).toBeFalsy();
        });

        it('should havePermission return true if the permissions is empty and the permission to check is Consumer', () => {
            const permissionNode = new Node({ permissions: [] });
            expect(contentService.hasPermissions(permissionNode, 'Consumer', 'user1')).toBeTruthy();
        });

        it('should havePermission return false if the permissions is empty and the permission to check is not Consumer', () => {
            const permissionNode = new Node({ permissions: [] });
            expect(contentService.hasPermissions(permissionNode, '!Consumer', 'user1')).toBeFalsy();
        });

        it('should havePermission be true if inherited permissions is present and you have the permission for the request operation', () => {
            const permissionNode = new Node({ permissions: { inherited: [{ name: 'manager', authorityId: 'user1' }, { name: 'collaborator', authorityId: 'user2' } ] } });
            expect(contentService.hasPermissions(permissionNode, 'manager', 'user1')).toBeTruthy();
        });

        it('should take current logged user id if userId undefined ', () => {
            spyOn(authService, 'getEcmUsername').and.returnValue('user1');
            const permissionNode = new Node({ permissions: { inherited: [{ name: 'manager', authorityId: 'user1' }, { name: 'collaborator', authorityId: 'user2' } ] } });
            expect(contentService.hasPermissions(permissionNode, 'manager')).toBeTruthy();
        });
    });
});
