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

import { setupTestBed } from '@alfresco/adf-core';
import { FileNode, FolderNode } from '../../mock';
import { ContentActionHandler } from '../models/content-action.model';
import { DocumentActionsService } from './document-actions.service';
import { DocumentListService } from './document-list.service';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('DocumentActionsService', () => {

    let service: DocumentActionsService;
    let documentListService: DocumentListService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        documentListService = TestBed.inject(DocumentListService);
        service = TestBed.inject(DocumentActionsService);
    });

    it('should register default download action', () => {
        expect(service.getHandler('download')).not.toBeNull();
    });

    it('should register lock action', () => {
        expect(service.getHandler('lock')).toBeDefined();
    });

    it('should register custom action handler', () => {
        const handler: ContentActionHandler = () => {};
        service.setHandler('<key>', handler);
        expect(service.getHandler('<key>')).toBe(handler);
    });

    it('should not find handler that is not registered', () => {
        expect(service.getHandler('<missing>')).toBeNull();
    });

    it('should be case insensitive for keys', () => {
        const handler: ContentActionHandler = () => {};
        service.setHandler('<key>', handler);
        expect(service.getHandler('<KEY>')).toBe(handler);
    });

    it('should not find handler with invalid key', () => {
        expect(service.getHandler(null)).toBeNull();
        expect(service.getHandler('')).toBeNull();
    });

    it('should allow action execution only when service available', () => {
        const file = new FileNode();
        expect(service.canExecuteAction(file)).toBeTruthy();

        service = new DocumentActionsService(null, null, null);
        expect(service.canExecuteAction(file)).toBeFalsy();
    });

    it('should allow action execution only for file nodes', () => {
        expect(service.canExecuteAction(null)).toBeFalsy();
        expect(service.canExecuteAction(new FileNode())).toBeTruthy();
        expect(service.canExecuteAction(new FolderNode())).toBeFalsy();
    });

    it('should set new handler only by key', () => {
        const handler: ContentActionHandler = () => {};
        expect(service.setHandler(null, handler)).toBeFalsy();
        expect(service.setHandler('', handler)).toBeFalsy();
        expect(service.setHandler('my-handler', handler)).toBeTruthy();
    });

    it('should register delete action', () => {
        expect(service.getHandler('delete')).toBeDefined();
    });

    it('should not delete the file node if there are no permissions', async () => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        await service.permissionEvent.subscribe((permission) => {
            expect(permission).toBeDefined();
            expect(permission.type).toEqual('content');
            expect(permission.action).toEqual('delete');
        });

        const file = new FileNode();
        service.getHandler('delete')(file);
   });

    it('should call the error on the returned Observable if there are no permissions', async () => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        const file = new FileNode();
        const deleteObservable = service.getHandler('delete')(file);

        await deleteObservable.subscribe({
            error: (error) => {
                expect(error.message).toEqual('No permission to delete');
            }
        });
    });

    it('should delete the file node if there is the delete permission', () => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        const permission = 'delete';
        const file = new FileNode();
        const fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = [permission];
        service.getHandler('delete')(fileWithPermission, null, permission);

        expect(documentListService.deleteNode).toHaveBeenCalledWith(file.entry.id);
    });

    it('should not delete the file node if there is no delete permission', async () => {
        spyOn(documentListService, 'deleteNode').and.callThrough();

        await service.permissionEvent.subscribe((permissionBack) => {
            expect(permissionBack).toBeDefined();
            expect(permissionBack.type).toEqual('content');
            expect(permissionBack.action).toEqual('delete');
        });

        const permission = 'delete';
        const file = new FileNode();
        const fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = ['create', 'update'];
        service.getHandler('delete')(fileWithPermission, null, permission);
    });

    it('should delete the file node if there is the delete and others permission ', () => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        const permission = 'delete';
        const file = new FileNode();
        const fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = ['create', 'update', permission];
        service.getHandler('delete')(fileWithPermission, null, permission);

        expect(documentListService.deleteNode).toHaveBeenCalledWith(file.entry.id);
    });

    it('should register download action', () => {
        expect(service.getHandler('download')).toBeDefined();
    });

    it('should delete file node', () => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        const permission = 'delete';
        const file = new FileNode();
        const fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = [permission];
        const deleteObservable = service.getHandler('delete')(fileWithPermission, null, permission);

        expect(documentListService.deleteNode).toHaveBeenCalledWith(file.entry.id);
        expect(deleteObservable.subscribe).toBeDefined();
    });

    it('should support deletion only file node', () => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        const folder = new FolderNode();
        service.getHandler('delete')(folder);
        expect(documentListService.deleteNode).not.toHaveBeenCalled();

        const permission = 'delete';
        const file = new FileNode();
        const fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = [permission];
        service.getHandler('delete')(fileWithPermission, null, permission);
        expect(documentListService.deleteNode).toHaveBeenCalled();
    });

    it('should require node id to delete', () => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        const file = new FileNode();
        file.entry.id = null;
        service.getHandler('delete')(file);

        expect(documentListService.deleteNode).not.toHaveBeenCalled();
    });

    it('should emit success event upon node deletion', async () => {
        await service.success.subscribe((message) => {
            expect(message).toEqual('CORE.DELETE_NODE.SINGULAR');
        });
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        const target = jasmine.createSpyObj('obj', ['reload']);
        const permission = 'delete';
        const file = new FileNode();
        const fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = [permission];
        service.getHandler('delete')(fileWithPermission, target, permission);
   });
});
