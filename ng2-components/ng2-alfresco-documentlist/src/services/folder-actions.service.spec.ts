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

import { it, describe, expect, beforeEach } from '@angular/core/testing';
import { FolderActionsService } from './folder-actions.service';
import { ContentActionHandler } from '../models/content-action.model';
import { FileNode, FolderNode } from '../assets/document-library.model.mock';
import { DocumentListService } from './document-list.service';
import { DocumentListServiceMock } from '../assets/document-list.service.mock';

describe('FolderActionsService', () => {

    let service: FolderActionsService;
    let documentListService: DocumentListService;

    beforeEach(() => {
        documentListService = new DocumentListServiceMock();
        service = new FolderActionsService(documentListService);
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
        let folder = new FolderNode();
        expect(service.canExecuteAction(folder)).toBeTruthy();

        service = new FolderActionsService(null);
        expect(service.canExecuteAction(folder)).toBeFalsy();
    });

    it('should allow action execution only for folder nodes', () => {
        expect(service.canExecuteAction(null)).toBeFalsy();
        expect(service.canExecuteAction(new FileNode())).toBeFalsy();
        expect(service.canExecuteAction(new FolderNode())).toBeTruthy();
    });

    it('should set new handler only by key', () => {
        let handler: ContentActionHandler = function (obj: any) {
        };
        expect(service.setHandler(null, handler)).toBeFalsy();
        expect(service.setHandler('', handler)).toBeFalsy();
        expect(service.setHandler('my-handler', handler)).toBeTruthy();
    });

    // TODO: to be removed once demo handlers are removed
    it('should execute demo actions', () => {
        spyOn(window, 'alert').and.stub();

        service.getHandler('system1')(null);
        expect(window.alert).toHaveBeenCalledWith('standard folder action 1');

        service.getHandler('system2')(null);
        expect(window.alert).toHaveBeenCalledWith('standard folder action 2');
    });


    // TODO: to be removed once demo handlers are removed
    it('should register demo handlers', () => {
        expect(service.getHandler('system1')).toBeDefined();
        expect(service.getHandler('system2')).toBeDefined();
    });

    it('should register delete action', () => {
        expect(service.getHandler('delete')).toBeDefined();
    });

    it('should delete folder node', () => {
        spyOn(documentListService, 'deleteNode').and.callThrough();

        let folder = new FolderNode();
        service.getHandler('delete')(folder);

        expect(documentListService.deleteNode).toHaveBeenCalledWith(folder.entry.id);
    });

    it('should support deletion only folder node', () => {
        spyOn(documentListService, 'deleteNode').and.callThrough();

        let file = new FileNode();
        service.getHandler('delete')(file);
        expect(documentListService.deleteNode).not.toHaveBeenCalled();

        let folder = new FolderNode();
        service.getHandler('delete')(folder);
        expect(documentListService.deleteNode).toHaveBeenCalled();
    });

    it('should require node id to delete', () => {
        spyOn(documentListService, 'deleteNode').and.callThrough();

        let folder = new FolderNode();
        folder.entry.id = null;
        service.getHandler('delete')(folder);

        expect(documentListService.deleteNode).not.toHaveBeenCalled();
    });

    it('should reload target upon node deletion', () => {
        spyOn(documentListService, 'deleteNode').and.callThrough();

        let target = jasmine.createSpyObj('obj', ['reload']);
        let folder = new FolderNode();
        service.getHandler('delete')(folder, target);

        expect(documentListService.deleteNode).toHaveBeenCalled();
        expect(target.reload).toHaveBeenCalled();
    });
});
