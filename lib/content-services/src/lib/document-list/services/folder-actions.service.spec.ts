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
import { Observable } from 'rxjs';
import { FileNode, FolderNode } from '../../mock';
import { ContentActionHandler } from '../models/content-action.model';
import { DocumentListService } from './document-list.service';
import { FolderActionsService } from './folder-actions.service';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('FolderActionsService', () => {

    let service: FolderActionsService;
    let documentListService: DocumentListService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';

        documentListService = TestBed.inject(DocumentListService);
        service = TestBed.inject(FolderActionsService);
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
        const folder = new FolderNode();
        expect(service.canExecuteAction(folder)).toBeTruthy();
    });

    it('should allow action execution only for folder nodes', () => {
        expect(service.canExecuteAction(null)).toBeFalsy();
        expect(service.canExecuteAction(new FileNode())).toBeFalsy();
        expect(service.canExecuteAction(new FolderNode())).toBeTruthy();
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

    it('should not delete the folder node if there are no permissions', async () => {
        spyOn(documentListService, 'deleteNode').and.callThrough();

        await service.permissionEvent.subscribe((permission) => {
            expect(permission).toBeDefined();
            expect(permission.type).toEqual('folder');
            expect(permission.action).toEqual('delete');
        });

        const folder = new FolderNode();
        service.getHandler('delete')(folder);
   });

    it('should delete the folder node if there is the delete permission', () => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => new Observable<any>((observer) => {
            observer.next();
            observer.complete();
        }));

        const permission = 'delete';
        const folder = new FolderNode();
        const folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = [permission];
        const deleteObservable = service.getHandler('delete')(folderWithPermission, null, permission);

        expect(documentListService.deleteNode).toHaveBeenCalledWith(folder.entry.id);
        expect(deleteObservable.subscribe).toBeDefined();
    });

    it('should not delete the folder node if there is no delete permission', async () => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => new Observable<any>((observer) => {
            observer.next();
            observer.complete();
        }));

        await service.permissionEvent.subscribe((permission) => {
            expect(permission).toBeDefined();
            expect(permission.type).toEqual('folder');
            expect(permission.action).toEqual('delete');
        });

        const folder = new FolderNode();
        const folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = ['create', 'update'];
        service.getHandler('delete')(folderWithPermission);
    });

    it('should call the error on the returned Observable if there is no delete permission', async () => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => new Observable<any>((observer) => {
            observer.next();
            observer.complete();
        }));

        const folder = new FolderNode();
        const folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = ['create', 'update'];
        const deleteObservable = service.getHandler('delete')(folderWithPermission);

        await deleteObservable.subscribe({
            error: (error) => {
                expect(error.message).toEqual('No permission to delete');
            }
        });
   });

    it('should delete the folder node if there is the delete and others permission ', () => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => new Observable<any>((observer) => {
            observer.next();
            observer.complete();
        }));

        const permission = 'delete';
        const folder = new FolderNode();
        const folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = ['create', 'update', permission];
        service.getHandler('delete')(folderWithPermission, null, permission);

        expect(documentListService.deleteNode).toHaveBeenCalledWith(folder.entry.id);
    });

    it('should support deletion only folder node', () => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => new Observable<any>((observer) => {
            observer.next();
            observer.complete();
        }));

        const permission = 'delete';
        const file = new FileNode();
        service.getHandler('delete')(file);
        expect(documentListService.deleteNode).not.toHaveBeenCalled();

        const folder = new FolderNode();
        const folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = [permission];
        service.getHandler('delete')(folderWithPermission, null, permission);
        expect(documentListService.deleteNode).toHaveBeenCalled();
    });

    it('should require node id to delete', () => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => new Observable<any>((observer) => {
            observer.next();
            observer.complete();
        }));

        const folder = new FolderNode();
        folder.entry.id = null;
        service.getHandler('delete')(folder);

        expect(documentListService.deleteNode).not.toHaveBeenCalled();
    });

    it('should reload target upon node deletion', async () => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => new Observable<any>((observer) => {
            observer.next();
            observer.complete();
        }));

        const permission = 'delete';
        const target = jasmine.createSpyObj('obj', ['reload']);
        const folder = new FolderNode();
        const folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = [permission];

        const deleteHandler = service.getHandler('delete')(folderWithPermission, target, permission);

        await deleteHandler.subscribe(() => {
            expect(target.reload).toHaveBeenCalled();
        });

        expect(documentListService.deleteNode).toHaveBeenCalled();
    });

    it('should emit success event upon node deletion', async () => {
        spyOn(documentListService, 'deleteNode').and.callFake(() => new Observable<any>((observer) => {
            observer.next();
            observer.complete();
        }));

        await service.success.subscribe((nodeId) => {
            expect(nodeId).not.toBeNull();
        });

        const permission = 'delete';
        const target = jasmine.createSpyObj('obj', ['reload']);
        const folder = new FolderNode();
        const folderWithPermission: any = folder;
        folderWithPermission.entry.allowableOperations = [permission];

        service.getHandler('delete')(folderWithPermission, target, permission);
    });
});
