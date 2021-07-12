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
import { AlfrescoApiService, NotificationService, setupTestBed } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContentCloudNodeSelectorService } from 'process-services-cloud';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';

describe('ContentCloudNodeSelectorService', () => {
    let service: ContentCloudNodeSelectorService;
    let apiService: AlfrescoApiService;
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
        imports: [TranslateModule.forRoot(), ProcessServiceCloudTestingModule, MatDialogModule]
    });

    beforeEach(() => {
        service = TestBed.inject(ContentCloudNodeSelectorService);
        notificationService = TestBed.inject(NotificationService);
        apiService = TestBed.inject(AlfrescoApiService);
        dialog = TestBed.inject(MatDialog);

        showWarningSpy = spyOn(notificationService, 'showWarning');
        openDialogSpy = spyOn(dialog, 'open').and.returnValue({
            afterOpened: () => of({}),
            afterClosed: () => of({}),
            componentInstance: {
                error: new Subject<any>()
            }
        });
        getNodeSpy = spyOn(apiService.nodesApi, 'getNode');
    });

    it('should be able to open the content node select panel dialog', () => {
        service.openUploadFileDialog('nodeId', 'single', true, true);
        expect(openDialogSpy).toHaveBeenCalled();
    });

    it('should be able to show an notification if the relative path is invalid/deleted', async () => {
        getNodeSpy.and.returnValue(Promise.reject('Not exists'));
        const relativePathNodeEntry = await service.fetchNodeFromRelativePath('mock-alias', { relativePath: 'mock-relativePath' });
        service.openUploadFileDialog('nodeId', 'single', true, true).subscribe(() => {
            expect(openDialogSpy).toHaveBeenCalled();
            expect(service.sourceNodeNotFound).toBe(true);
            expect(showWarningSpy).toHaveBeenCalledWith('success');
            expect(relativePathNodeEntry).toBeNull();
        });
    });

    it('should not be able to show an notification if the relative path is valid', () => {
        getNodeSpy.and.returnValue(Promise.resolve(relativePathNodeResponseBody));
        service.openUploadFileDialog('nodeId', 'single', true, true);

        expect(openDialogSpy).toHaveBeenCalled();
        expect(service.sourceNodeNotFound).toBe(false);
        expect(showWarningSpy).not.toHaveBeenCalled();
    });

    it('should be able to fetch given relative path node id', async () => {
        getNodeSpy.and.returnValue(Promise.resolve(relativePathNodeResponseBody));
        await service.fetchNodeFromRelativePath('mock-alias', { relativePath: 'mock-relativePath' });

        expect(getNodeSpy).toHaveBeenCalledWith('mock-alias', {
            relativePath: 'mock-relativePath'
        });
    });

    it('should be able to fetch given alias node id', async () => {
        getNodeSpy.and.returnValue(Promise.resolve(aliasNodeResponseBody));
        await service.fetchAliasNode('mock-alias');
        expect(getNodeSpy).toHaveBeenCalledWith('mock-alias');
    });
});
