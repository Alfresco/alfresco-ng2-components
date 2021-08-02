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
import { NotificationService, setupTestBed } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContentCloudNodeSelectorService } from 'process-services-cloud';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { ContentNodeSelectorComponent, ContentNodeSelectorComponentData } from '@alfresco/adf-content-services';

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

    setupTestBed({
        imports: [TranslateModule.forRoot(), ProcessServiceCloudTestingModule]
    });

    beforeEach(() => {
        service = TestBed.inject(ContentCloudNodeSelectorService);
        notificationService = TestBed.inject(NotificationService);
        dialog = TestBed.inject(MatDialog);

        showWarningSpy = spyOn(notificationService, 'showWarning');
        openDialogSpy = spyOn(dialog, 'open').and.callFake(() => ({
            afterOpened: () => of({}),
            afterClosed: () => of({}),
            componentInstance: {
                body: '',
                error: new Subject<any>()
            }
        }));
    });

    it('should be able to open the content node select panel dialog', () => {
        const mockData = <ContentNodeSelectorComponentData> {
            title: 'Select a file',
            actionName: 'ATTACH',
            currentFolderId: 'nodeId',
            selectionMode: 'single'
        };

        service.openUploadFileDialog('nodeId', 'single', true, true);

        const args = openDialogSpy.calls.allArgs()[0];

        expect(openDialogSpy).toHaveBeenCalled();
        expect(args[0]).toEqual(ContentNodeSelectorComponent);
        expect(args[1].data.title).toEqual(mockData.title);
        expect(args[1].data.actionName).toEqual(mockData.actionName);
        expect(args[1].panelClass).toEqual('adf-content-node-selector-dialog');
        expect(args[1].data.selectionMode).toEqual(mockData.selectionMode);
        expect(args[1].data.currentFolderId).toEqual('nodeId');
    });

    it('should be able to set sourceNodeNotFound value to true if the relative path is invalid/deleted', async () => {
        expect(service.sourceNodeNotFound).toBe(false);

        getNodeSpy.and.returnValue(Promise.reject('Not exists'));
        await service.fetchNodeIdFromRelativePath('mock-alias', { relativePath: 'mock-wrong-relativePath' });

        expect(getNodeSpy).toHaveBeenCalledWith('mock-alias', {
            relativePath: 'mock-wrong-relativePath'
        });
        expect(service.sourceNodeNotFound).toBe(true);
    });

    it('should be able to set sourceNodeNotFound value to false after the dialog close', async () => {
        service.sourceNodeNotFound = true;
        service.openUploadFileDialog('nodeId', 'single', true, true);

        service.close();

        expect(service.sourceNodeNotFound).toBe(false);
    });

    it('should be able to show a notification if the relative path is invalid/deleted', () => {
        service.sourceNodeNotFound = true;
        service.openUploadFileDialog('nodeId', 'single', true, true);

        expect(showWarningSpy).toHaveBeenCalledWith('ADF_CLOUD_TASK_FORM.ERROR.DESTINATION_FOLDER_PATH_ERROR');
    });

    it('should not show a notification if the relative path is valid', () => {
        service.sourceNodeNotFound = false;
        service.openUploadFileDialog('nodeId', 'single', true, true);

        expect(showWarningSpy).not.toHaveBeenCalled();
    });

    it('should be able to fetch given relative path node id', async () => {
        getNodeSpy.and.returnValue(Promise.resolve(relativePathNodeResponseBody));
        await service.fetchNodeIdFromRelativePath('mock-alias', { relativePath: 'mock-relativePath' });

        expect(getNodeSpy).toHaveBeenCalledWith('mock-alias', {
            relativePath: 'mock-relativePath'
        });
        expect(service.sourceNodeNotFound).toBe(false);
    });

    it('should be able to fetch given alias node id', async () => {
        getNodeSpy.and.returnValue(Promise.resolve(aliasNodeResponseBody));
        await service.fetchAliasNodeId('mock-alias');

        expect(getNodeSpy).toHaveBeenCalledWith('mock-alias');
    });
});
