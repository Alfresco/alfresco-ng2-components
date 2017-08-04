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

import { AlfrescoContentService, AlfrescoTranslationService, NotificationService } from 'ng2-alfresco-core';
import { FileNode, FolderNode } from '../assets/document-library.model.mock';
import { DocumentListServiceMock } from '../assets/document-list.service.mock';
import { ContentActionHandler } from '../models/content-action.model';
import { DocumentActionsService } from './document-actions.service';
import { DocumentListService } from './document-list.service';
import { NodeActionsService } from './node-actions.service';

describe('DocumentActionsService', () => {

    let service: DocumentActionsService;
    let documentListService: DocumentListService;
    let contentService: AlfrescoContentService;
    let translateService: AlfrescoTranslationService;
    let notificationService: NotificationService;
    let nodeActionsService: NodeActionsService;

    beforeEach(() => {
        documentListService = new DocumentListServiceMock();
        contentService = new AlfrescoContentService(null, null, null);
        translateService = <AlfrescoTranslationService> { addTranslationFolder: () => {}};
        nodeActionsService = new NodeActionsService(null, translateService, null, null);
        notificationService = new NotificationService(null);
        service = new DocumentActionsService(translateService, notificationService, nodeActionsService, documentListService, contentService);
    });

    it('should register default download action', () => {
        expect(service.getHandler('download')).not.toBeNull();
    });

    it('should register custom action handler', () => {
        let handler: ContentActionHandler = function (obj: any) {};
        service.setHandler('<key>', handler);
        expect(service.getHandler('<key>')).toBe(handler);
    });

    it('should not find handler that is not registered', () => {
        expect(service.getHandler('<missing>')).toBeNull();
    });

    it('should be case insensitive for keys', () => {
        let handler: ContentActionHandler = function (obj: any) {};
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

        service = new DocumentActionsService(translateService, notificationService, nodeActionsService);
        expect(service.canExecuteAction(file)).toBeFalsy();
    });

    it('should allow action execution only for file nodes', () => {
        expect(service.canExecuteAction(null)).toBeFalsy();
        expect(service.canExecuteAction(new FileNode())).toBeTruthy();
        expect(service.canExecuteAction(new FolderNode())).toBeFalsy();
    });

    it('should set new handler only by key', () => {
        let handler: ContentActionHandler = function (obj: any) {};
        expect(service.setHandler(null, handler)).toBeFalsy();
        expect(service.setHandler('', handler)).toBeFalsy();
        expect(service.setHandler('my-handler', handler)).toBeTruthy();
    });

    it('should register delete action', () => {
        expect(service.getHandler('delete')).toBeDefined();
    });

    it('should not delete the file node if there are no permissions', (done) => {
        spyOn(documentListService, 'deleteNode').and.callThrough();

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
        spyOn(documentListService, 'deleteNode').and.callThrough();

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
        spyOn(documentListService, 'deleteNode').and.callThrough();

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
        spyOn(documentListService, 'deleteNode').and.callThrough();

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

    it('should execute download action and cleanup', () => {
        let file = new FileNode();
        let url = 'http://<address>';

        spyOn(contentService, 'getContentUrl').and.returnValue(url);

        let link = jasmine.createSpyObj('a', [
            'setAttribute',
            'click'
        ]);

        spyOn(document, 'createElement').and.returnValue(link);
        spyOn(document.body, 'appendChild').and.stub();
        spyOn(document.body, 'removeChild').and.stub();

        service.getHandler('download')(file);

        expect(contentService.getContentUrl).toHaveBeenCalledWith(file);
        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(link.setAttribute).toHaveBeenCalledWith('download', 'download');
        expect(document.body.appendChild).toHaveBeenCalledWith(link);
        expect(link.click).toHaveBeenCalled();
        expect(document.body.removeChild).toHaveBeenCalledWith(link);
    });

    it('should require internal service for download action', () => {
        let actionService = new DocumentActionsService(translateService, notificationService, nodeActionsService, null, contentService);
        let file = new FileNode();
        let result = actionService.getHandler('download')(file);
        result.subscribe((value) => {
            expect(value).toBeFalsy();
        });
    });

    it('should require content service for download action', () => {
        let actionService = new DocumentActionsService(translateService, notificationService, nodeActionsService, documentListService, null);
        let file = new FileNode();
        let result = actionService.getHandler('download')(file);
        result.subscribe((value) => {
            expect(value).toBeFalsy();
        });
    });

    it('should require file node for download action', () => {
        let folder = new FolderNode();
        let result = service.getHandler('download')(folder);
        result.subscribe((value) => {
            expect(value).toBeFalsy();
        });
    });

    it('should delete file node', () => {
        spyOn(documentListService, 'deleteNode').and.callThrough();

        let permission = 'delete';
        let file = new FileNode();
        let fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = [permission];
        const deleteObservale = service.getHandler('delete')(fileWithPermission, null, permission);

        expect(documentListService.deleteNode).toHaveBeenCalledWith(file.entry.id);
        expect(deleteObservale.subscribe).toBeDefined();
    });

    it('should support deletion only file node', () => {
        spyOn(documentListService, 'deleteNode').and.callThrough();

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
        spyOn(documentListService, 'deleteNode').and.callThrough();

        let file = new FileNode();
        file.entry.id = null;
        service.getHandler('delete')(file);

        expect(documentListService.deleteNode).not.toHaveBeenCalled();
    });

    it('should reload target upon node deletion', () => {
        spyOn(documentListService, 'deleteNode').and.callThrough();

        let target = jasmine.createSpyObj('obj', ['reload']);
        let permission = 'delete';
        let file = new FileNode();
        let fileWithPermission: any = file;
        fileWithPermission.entry.allowableOperations = [permission];
        service.getHandler('delete')(fileWithPermission, target, permission);

        expect(documentListService.deleteNode).toHaveBeenCalled();
        expect(target.reload).toHaveBeenCalled();
    });
});
