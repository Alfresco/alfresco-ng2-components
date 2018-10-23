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

import { TestBed } from '@angular/core/testing';
import { AlfrescoApiServiceMock, AppConfigService, StorageService, ContentService, setupTestBed, CoreModule, TranslationMock } from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import { FileNode, FolderNode } from '../../mock';
import { ContentActionHandler } from '../models/content-action.model';
import { DocumentListService } from './document-list.service';
import { FolderActionsService } from './folder-actions.service';

describe('FolderActionsService', () => {

    let service: FolderActionsService;
    let documentListService: DocumentListService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        let appConfig: AppConfigService = TestBed.get(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';

        let contentService = new ContentService(null, null, null, null);
        let alfrescoApiService = new AlfrescoApiServiceMock(new AppConfigService(null), new StorageService());
        documentListService = new DocumentListService(null, contentService, alfrescoApiService, null, null);
        service = new FolderActionsService(null, documentListService, contentService,  new TranslationMock());
    });

    it('should register custom action handler', () => {
        let handler: ContentActionHandler = function () {
        };
        service.setHandler('<key>', handler);
        expect(service.getHandler('<key>')).toBe(handler);
    });

    it('should not find handler that is not registered', () => {
        expect(service.getHandler('<missing>')).toBeNull();
    });

    it('should be case insensitive for keys', () => {
        let handler: ContentActionHandler = function () {
        };
        service.setHandler('<key>', handler);
        expect(service.getHandler('<KEY>')).toBe(handler);
    });

    it('should not find handler with invalid key', () => {
        expect(service.getHandler(null)).toBeNull();
        expect(service.getHandler('')).toBeNull();
    });

    it('should allow action execution only when service available', () => {
        let folder = new FolderNode();
        expect(service.canExecuteAction(folder)).toBeTruthy();
    });

    it('should allow action execution only for folder nodes', () => {
        expect(service.canExecuteAction(null)).toBeFalsy();
        expect(service.canExecuteAction(new FileNode())).toBeFalsy();
        expect(service.canExecuteAction(new FolderNode())).toBeTruthy();
    });

    it('should set new handler only by key', () => {
        let handler: ContentActionHandler = function () {
        };
        expect(service.setHandler(null, handler)).toBeFalsy();
        expect(service.setHandler('', handler)).toBeFalsy();
        expect(service.setHandler('my-handler', handler)).toBeTruthy();
    });

    it('should register delete action', () => {
        expect(service.getHandler('delete')).toBeDefined();
    });

    it('should not delete the folder node if there are no permissions', (done) => {
        spyOn(documentListService, 'deleteNode').and.callThrough();

        service.permissionEvent.subscribe((permission) => {
            expect(permission).toBeDefined();
            expect(permission.type).toEqual('folder');
            expect(permission.action).toEqual('delete');
            done();
        });

        let folder = new FolderNode();
        service.getHandler('delete')(folder);

    });

    it('should delete the folder node if there is the delete permission', () => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => {
            return new Observable<any>(observer => {
                observer.next();
                observer.complete();
            });
        });

        let permission = 'delete';
        let folder = new FolderNode();
        let folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = [permission];
        const deleteObservable = service.getHandler('delete')(folderWithPermission, null, permission);

        expect(documentListService.deleteNode).toHaveBeenCalledWith(folder.entry.id);
        expect(deleteObservable.subscribe).toBeDefined();
    });

    it('should not delete the folder node if there is no delete permission', (done) => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => {
            return new Observable<any>(observer => {
                observer.next();
                observer.complete();
            });
        });

        service.permissionEvent.subscribe((permission) => {
            expect(permission).toBeDefined();
            expect(permission.type).toEqual('folder');
            expect(permission.action).toEqual('delete');
            done();
        });

        let folder = new FolderNode();
        let folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = ['create', 'update'];
        service.getHandler('delete')(folderWithPermission);
    });

    it('should call the error on the returned Observable if there is no delete permission', (done) => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => {
            return new Observable<any>(observer => {
                observer.next();
                observer.complete();
            });
        });

        let folder = new FolderNode();
        let folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = ['create', 'update'];
        const deleteObservable = service.getHandler('delete')(folderWithPermission);

        deleteObservable.subscribe({
            error: (error) => {
                expect(error.message).toEqual('No permission to delete');
                done();
            }
        });

    });

    it('should delete the folder node if there is the delete and others permission ', () => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => {
            return new Observable<any>(observer => {
                observer.next();
                observer.complete();
            });
        });

        let permission = 'delete';
        let folder = new FolderNode();
        let folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = ['create', 'update', permission];
        service.getHandler('delete')(folderWithPermission, null, permission);

        expect(documentListService.deleteNode).toHaveBeenCalledWith(folder.entry.id);
    });

    it('should support deletion only folder node', () => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => {
            return new Observable<any>(observer => {
                observer.next();
                observer.complete();
            });
        });

        let permission = 'delete';
        let file = new FileNode();
        service.getHandler('delete')(file);
        expect(documentListService.deleteNode).not.toHaveBeenCalled();

        let folder = new FolderNode();
        let folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = [permission];
        service.getHandler('delete')(folderWithPermission, null, permission);
        expect(documentListService.deleteNode).toHaveBeenCalled();
    });

    it('should require node id to delete', () => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => {
            return new Observable<any>(observer => {
                observer.next();
                observer.complete();
            });
        });

        let folder = new FolderNode();
        folder.entry.id = null;
        service.getHandler('delete')(folder);

        expect(documentListService.deleteNode).not.toHaveBeenCalled();
    });

    it('should reload target upon node deletion', (done) => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => {
            return new Observable<any>(observer => {
                observer.next();
                observer.complete();
            });
        });

        let permission = 'delete';
        let target = jasmine.createSpyObj('obj', ['reload']);
        let folder = new FolderNode();
        let folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = [permission];

        let deleteHandler = service.getHandler('delete')(folderWithPermission, target, permission);

        deleteHandler.subscribe(() => {
            expect(target.reload).toHaveBeenCalled();
            done();
        });

        expect(documentListService.deleteNode).toHaveBeenCalled();
    });

    it('should emit success event upon node deletion', (done) => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => {
            return new Observable<any>(observer => {
                observer.next();
                observer.complete();
            });
        });

        service.success.subscribe((nodeId) => {
            expect(nodeId).not.toBeNull();
            done();
        });

        let permission = 'delete';
        let target = jasmine.createSpyObj('obj', ['reload']);
        let folder = new FolderNode();
        let folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = [permission];

        service.getHandler('delete')(folderWithPermission, target, permission);
    });
});
