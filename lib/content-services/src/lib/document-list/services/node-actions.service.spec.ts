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

import { async, TestBed } from '@angular/core/testing';
import { Node } from '@alfresco/js-api';
import { AppConfigService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { DocumentListService } from './document-list.service';
import { NodeActionsService } from './node-actions.service';
import { ContentNodeDialogService } from '../../content-node-selector/content-node-dialog.service';
import { of, throwError } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogModule } from '../../dialogs/dialog.module';

const fakeNode: Node = <Node> {
    id: 'fake'
};

describe('NodeActionsService', () => {

    let service: NodeActionsService;
    let documentListService: DocumentListService;
    let contentDialogService: ContentNodeDialogService;
    const dialogRef = {
        open: jasmine.createSpy('open')
    };

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            DialogModule
        ],
        providers: [
            { provide: MatDialogRef, useValue: dialogRef }
        ]
    });

    beforeEach(() => {
        const appConfig: AppConfigService = TestBed.get(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';

        service = TestBed.get(NodeActionsService);
        documentListService = TestBed.get(DocumentListService);
        contentDialogService = TestBed.get(ContentNodeDialogService);
    });

    it('should be able to create the service', () => {
        expect(service).not.toBeNull();
    });

    it('should be able to copy content', async(() => {
        spyOn(documentListService, 'copyNode').and.returnValue(of('FAKE-OK'));
        spyOn(contentDialogService, 'openCopyMoveDialog').and.returnValue(of([fakeNode]));

        service.copyContent(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCESS.CONTENT.COPY');
        });
    }));

    it('should be able to move content', async(() => {
        spyOn(documentListService, 'moveNode').and.returnValue(of('FAKE-OK'));
        spyOn(contentDialogService, 'openCopyMoveDialog').and.returnValue(of([fakeNode]));

        service.moveContent(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCESS.CONTENT.MOVE');
        });
    }));

    it('should be able to move folder', async(() => {
        spyOn(documentListService, 'moveNode').and.returnValue(of('FAKE-OK'));
        spyOn(contentDialogService, 'openCopyMoveDialog').and.returnValue(of([fakeNode]));

        service.moveFolder(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCESS.FOLDER.MOVE');
        });
    }));

    it('should be able to copy folder', async(() => {
        spyOn(documentListService, 'copyNode').and.returnValue(of('FAKE-OK'));
        spyOn(contentDialogService, 'openCopyMoveDialog').and.returnValue(of([fakeNode]));

        service.copyFolder(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCESS.FOLDER.COPY');
        });
    }));

    it('should be able to propagate the dialog error', async(() => {
        spyOn(documentListService, 'copyNode').and.returnValue(throwError('FAKE-KO'));
        spyOn(contentDialogService, 'openCopyMoveDialog').and.returnValue(of([fakeNode]));

        service.copyFolder(fakeNode, '!allowed').subscribe(() => {
        }, (error) => {
            expect(error).toBe('FAKE-KO');
        });
    }));

});
