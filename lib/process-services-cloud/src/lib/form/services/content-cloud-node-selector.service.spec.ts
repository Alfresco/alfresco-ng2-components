/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { AlfrescoApiService, AlfrescoApiServiceMock, NotificationService, setupTestBed } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContentCloudNodeSelectorService } from 'process-services-cloud';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';

describe('ContentCloudNodeSelectorService', () => {
    let service: ContentCloudNodeSelectorService;
    let notificationService: NotificationService;
    let getNodeSpy: jasmine.Spy;
    let dialog: MatDialog;
    let openDialogSpy: jasmine.Spy;
    let showWarningSpy: jasmine.Spy;

    const relativePathNodeResponseBody = {
        entry: {
            id: 'mock-relative-path-node-id'
        }
    };

    const aliasNodeResponseBody = {
        entry: {
            id: 'mock-alias-node-id'
        }
    };

    const folderVariableValueResponseBody = {
        entry: {
            id: 'mock-folder-id'
        }
    };

    setupTestBed({
        imports: [TranslateModule.forRoot(), ProcessServiceCloudTestingModule, MatDialogModule],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(ContentCloudNodeSelectorService);
        notificationService = TestBed.inject(NotificationService);
        dialog = TestBed.inject(MatDialog);

        showWarningSpy = spyOn(notificationService, 'showWarning');
        openDialogSpy = spyOn(dialog, 'open').and.returnValue({
            afterOpened: () => of({}),
            afterClosed: () => of({}),
            componentInstance: {
                error: new Subject<any>()
            }
        });
        getNodeSpy = spyOn(service.nodesApi, 'getNode');
    });

    it('should be able to fetch nodeId from given relative path', async () => {
        getNodeSpy.and.returnValue(Promise.resolve(relativePathNodeResponseBody));
        const relativePathNodeEntry = await service.getNodeIdFromPath({ alias: 'mock-alias', path: 'mock-relativePath' });

        expect(relativePathNodeEntry).toBe(relativePathNodeResponseBody.entry.id);
        expect(getNodeSpy).toHaveBeenCalledWith('mock-alias', {
            relativePath: 'mock-relativePath'
        });
    });

    it('should fetch nodeId based on alias if the relative path undefined', async () => {
        getNodeSpy.and.returnValue(Promise.resolve(aliasNodeResponseBody));
        const aliasNodeId = await service.getNodeIdFromPath({ alias: 'mock-alias', path: undefined });

        expect(getNodeSpy).toHaveBeenCalledWith('mock-alias', undefined);
        expect(aliasNodeId).toEqual('mock-alias-node-id');
    });

    it('should be able to verify and return nodeId from given folderId', async () => {
        getNodeSpy.and.returnValue(Promise.resolve(folderVariableValueResponseBody));
        const relativePathNodeEntry = await service.verifyAndReturnNodeId('mock-folder-id');

        expect(relativePathNodeEntry).toBe('mock-folder-id');
        expect(getNodeSpy).toHaveBeenCalledWith('mock-folder-id', undefined);
    });

    it('should return defined alias nodeId if the relative path does not exists', async () => {
        getNodeSpy.and.returnValues(Promise.reject('Relative does not exists'), Promise.resolve(aliasNodeResponseBody));
        const aliasNodeId = await service.getNodeIdFromPath({ alias: 'mock-alias', path: 'mock-relativePath' });

        expect(getNodeSpy).toHaveBeenCalledTimes(2);
        expect(aliasNodeId).toEqual('mock-alias-node-id');
    });

    it('should fetch default nodeId if the folderId is not defined', async () => {
        getNodeSpy.and.returnValue(Promise.resolve(aliasNodeResponseBody));
        await service.verifyAndReturnNodeId('');

        expect(getNodeSpy).toHaveBeenCalledWith('-my-', undefined);
    });

    it('should return default nodeId if the given folder is not exist', async () => {
        getNodeSpy.and.returnValues(Promise.reject('Folder does not exists'), Promise.resolve(aliasNodeResponseBody));
        const aliasNodeId = await service.verifyAndReturnNodeId('mock-folder-id');

        expect(getNodeSpy).toHaveBeenCalledTimes(2);
        expect(aliasNodeId).toEqual('mock-alias-node-id');
    });

    it('should be able to fetch nodeId from given alias', async () => {
        getNodeSpy.and.returnValue(Promise.resolve(aliasNodeResponseBody));
        const aliasNodeId = await service.getNodeIdFromPath({ alias: 'mock-alias', path: undefined });

        expect(getNodeSpy).toHaveBeenCalledWith('mock-alias', undefined);
        expect(aliasNodeId).toEqual('mock-alias-node-id');
    });

    it('should be able to open the content node select panel dialog', () => {
        service.openUploadFileDialog('nodeId', 'single', true, true);

        expect(openDialogSpy).toHaveBeenCalled();
    });

    it('should show a warning notification if the relative path is invalid/deleted', async () => {
        getNodeSpy.and.returnValue(Promise.reject('Relative path does not exists'));

        try {
            await service.getNodeIdFromPath({ alias: 'mock-alias', path: 'mock-relativePath' });
            fail('An error should have been thrown');
        } catch (error) {
            expect(error).toEqual('Relative path does not exists');
        }

        service.openUploadFileDialog('nodeId', 'single', true, true).subscribe(() => {
            expect(openDialogSpy).toHaveBeenCalled();
            expect(service.sourceNodeNotFound).toBe(true);
            expect(showWarningSpy).toHaveBeenCalledWith('success');
        });
    });

    it('should show a warning notification if the defined folderVariable value invalid/deleted', async () => {
        getNodeSpy.and.returnValue(Promise.reject('Folder does not exists'));

        try {
            await service.verifyAndReturnNodeId('mock-folder-id');
            fail('An error should have been thrown');
        } catch (error) {
            expect(error).toEqual('Folder does not exists');
        }

        service.openUploadFileDialog('nodeId', 'single', true, true).subscribe(() => {
            expect(openDialogSpy).toHaveBeenCalled();
            expect(service.sourceNodeNotFound).toBe(true);
            expect(showWarningSpy).toHaveBeenCalledWith('success');
        });
    });

    it('should not show a notification if the relative path is valid', async () => {
        getNodeSpy.and.returnValue(Promise.resolve(relativePathNodeResponseBody));
        await service.getNodeIdFromPath({ alias: 'mock-alias', path: 'mock-relativePath' });
        service.openUploadFileDialog('nodeId', 'single', true, true);

        expect(openDialogSpy).toHaveBeenCalled();
        expect(service.sourceNodeNotFound).toBe(false);
        expect(showWarningSpy).not.toHaveBeenCalled();
    });

    it('should not show a notification if the given folderVariable value is valid', async () => {
        getNodeSpy.and.returnValue(Promise.resolve(folderVariableValueResponseBody));
        await service.verifyAndReturnNodeId('mock-folder-id');
        service.openUploadFileDialog('nodeId', 'single', true, true);

        expect(openDialogSpy).toHaveBeenCalled();
        expect(service.sourceNodeNotFound).toBe(false);
        expect(showWarningSpy).not.toHaveBeenCalled();
    });
});
