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

import { AlfrescoApiServiceMock, AppConfigService, ContentService,
    StorageService, setupTestBed, CoreModule, TranslationMock
} from '@alfresco/adf-core';
import { FileNode, FolderNode } from '../../mock';
import { ContentActionHandler } from '../models/content-action.model';
import { DocumentActionsService } from './document-actions.service';
import { DocumentListService } from './document-list.service';
import { NodeActionsService } from './node-actions.service';
import { of } from 'rxjs';

describe('DocumentActionsService', () => {

    let service: DocumentActionsService;
    let documentListService: DocumentListService;
    let nodeActionsService: NodeActionsService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        let contentService = new ContentService(null, null, null, null);
        let alfrescoApiService = new AlfrescoApiServiceMock(new AppConfigService(null), new StorageService());

        documentListService = new DocumentListService(null, contentService, alfrescoApiService, null, null);
        service = new DocumentActionsService(null, null, new TranslationMock(), documentListService, contentService);
    });

    it('should register default download action', () => {
        expect(service.getHandler('download')).not.toBeNull();
    });

    it('should register lock action', () => {
        expect(service.getHandler('lock')).toBeDefined();
    });

    it('should register custom action handler', () => {
        let handler: ContentActionHandler = function (obj: any) {
        };
        service.setHandler('<key>', handler);
        expect(service.getHandler('<key>')).toBe(handler);
    });

    it('should not find handler that is not registered', () => {
        expect(service.getHandler('<missing>')).toBeNull();
    });

    it('should be case insensitive for keys', () => {
        let handler: ContentActionHandler = function (obj: any) {
        };
        service.setHandler('<key>', handler);
        expect(service.getHandler('<KEY>')).toBe(handler);
    });

    it('should not find handler with invalid key', () => {
        expect(service.getHandler(null)).toBeNull();
        expect(service.getHandler('')).toBeNull();
    });

    it('should allow action execution only when service available', () => {
        let file = new FileNode();
        expect(service.canExecuteAction(file)).toBeTruthy();

        service = new DocumentActionsService(nodeActionsService, null, null);
        expect(service.canExecuteAction(file)).toBeFalsy();
    });

    it('should allow action execution only for file nodes', () => {
        expect(service.canExecuteAction(null)).toBeFalsy();
        expect(service.canExecuteAction(new FileNode())).toBeTruthy();
        expect(service.canExecuteAction(new FolderNode())).toBeFalsy();
    });

    it('should set new handler only by key', () => {
        let handler: ContentActionHandler = function (obj: any) {
        };
        expect(service.setHandler(null, handler)).toBeFalsy();
        expect(service.setHandler('', handler)).toBeFalsy();
        expect(service.setHandler('my-handler', handler)).toBeTruthy();
    });

    it('should register delete action', () => {
        expect(service.getHandler('delete')).toBeDefined();
    });

    it('should not delete the file node if there are no permissions', (done) => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        service.permissionEvent.subscribe((permission) => {
            expect(permission).toBeDefined();
            expect(permission.type).toEqual('content');
            expect(permission.action).toEqual('delete');
            done();
        });

        let file = new FileNode();
        service.getHandler('delete')(file);

    });

    it('should call the error on the returned Observable if there are no permissions', (done) => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        let file = new FileNode();
        const deleteObservable = service.getHandler('delete')(file);

        deleteObservable.subscribe({
            error: (error) => {
                expect(error.message).toEqual('No permission to delete');
                done();
            }
        });
    });

    it('should delete the file node if there is the delete permission', () => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        let permission = 'delete';
        let file = new FileNode();
        let fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = [permission];
        service.getHandler('delete')(fileWithPermission, null, permission);

        expect(documentListService.deleteNode).toHaveBeenCalledWith(file.entry.id);
    });

    it('should not delete the file node if there is no delete permission', (done) => {
        spyOn(documentListService, 'deleteNode').and.callThrough();

        service.permissionEvent.subscribe((permissionBack) => {
            expect(permissionBack).toBeDefined();
            expect(permissionBack.type).toEqual('content');
            expect(permissionBack.action).toEqual('delete');
            done();
        });

        let permission = 'delete';
        let file = new FileNode();
        let fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = ['create', 'update'];
        service.getHandler('delete')(fileWithPermission, null, permission);
    });

    it('should delete the file node if there is the delete and others permission ', () => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        let permission = 'delete';
        let file = new FileNode();
        let fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = ['create', 'update', permission];
        service.getHandler('delete')(fileWithPermission, null, permission);

        expect(documentListService.deleteNode).toHaveBeenCalledWith(file.entry.id);
    });

    it('should register download action', () => {
        expect(service.getHandler('download')).toBeDefined();
    });

    it('should delete file node', () => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        let permission = 'delete';
        let file = new FileNode();
        let fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = [permission];
        const deleteObservable = service.getHandler('delete')(fileWithPermission, null, permission);

        expect(documentListService.deleteNode).toHaveBeenCalledWith(file.entry.id);
        expect(deleteObservable.subscribe).toBeDefined();
    });

    it('should support deletion only file node', () => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        let folder = new FolderNode();
        service.getHandler('delete')(folder);
        expect(documentListService.deleteNode).not.toHaveBeenCalled();

        let permission = 'delete';
        let file = new FileNode();
        let fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = [permission];
        service.getHandler('delete')(fileWithPermission, null, permission);
        expect(documentListService.deleteNode).toHaveBeenCalled();
    });

    it('should require node id to delete', () => {
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        let file = new FileNode();
        file.entry.id = null;
        service.getHandler('delete')(file);

        expect(documentListService.deleteNode).not.toHaveBeenCalled();
    });

    it('should emit success event upon node deletion', (done) => {
        service.success.subscribe((message) => {
            expect(message).toEqual('CORE.DELETE_NODE.SINGULAR');
            done();
        });
        spyOn(documentListService, 'deleteNode').and.returnValue(of(true));

        let target = jasmine.createSpyObj('obj', ['reload']);
        let permission = 'delete';
        let file = new FileNode();
        let fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = [permission];
        service.getHandler('delete')(fileWithPermission, target, permission);

    });
});
