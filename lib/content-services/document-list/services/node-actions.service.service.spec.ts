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

import { async, TestBed } from '@angular/core/testing';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AppConfigService } from '@alfresco/adf-core';
import { DocumentListService } from './document-list.service';
import { NodeActionsService } from './node-actions.service';
import { ContentNodeDialogService } from '../../content-node-selector/content-node-dialog.service';
import { Observable } from 'rxjs/Observable';
import { MatDialogRef } from '@angular/material';
import { NodeLockDialogComponent } from '../../dialogs/node-lock.dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

const fakeNode: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
    id: 'fake'
};

const fakeFileNode: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
    id: 'fake',
    isFile: true
};

describe('NodeActionsService', () => {

    let service: NodeActionsService;
    let documentListService: DocumentListService;
    let contentDialogService: ContentNodeDialogService;
    const dialogRef = {
        open: jasmine.createSpy('open')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NodeLockDialogComponent
            ],
            imports: [],
            providers: [
                NodeActionsService,
                DocumentListService,
                ContentNodeDialogService,
                { provide: MatDialogRef, useValue: dialogRef }
            ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: { entryComponents: [ NodeLockDialogComponent ] }
        }).compileComponents();

    }));

    beforeEach(() => {
        let appConfig: AppConfigService = TestBed.get(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';

        service = TestBed.get(NodeActionsService);
        documentListService = TestBed.get(DocumentListService);
        contentDialogService = TestBed.get(ContentNodeDialogService);
    });

    it('should be able to create the service', () => {
        expect(service).not.toBeNull();
    });

    fit('should be able to open the lock node dialog', async(() => {
        spyOn(service, 'openLockNodeDialog');

        service.openLockNodeDialog(fakeFileNode).subscribe((response) => {
            expect(response).toBe('OPERATION.SUCCES.NODE.LOCK_DIALOG_OPEN');
        });
    }));

    it('should be able to copy content', async(() => {
        spyOn(documentListService, 'copyNode').and.returnValue(Observable.of('FAKE-OK'));
        spyOn(contentDialogService, 'openCopyMoveDialog').and.returnValue(Observable.of([fakeNode]));

        service.copyContent(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCES.CONTENT.COPY');
        });
    }));

    it('should be able to move content', async(() => {
        spyOn(documentListService, 'moveNode').and.returnValue(Observable.of('FAKE-OK'));
        spyOn(contentDialogService, 'openCopyMoveDialog').and.returnValue(Observable.of([fakeNode]));

        service.moveContent(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCES.CONTENT.MOVE');
        });
    }));

    it('should be able to move folder', async(() => {
        spyOn(documentListService, 'moveNode').and.returnValue(Observable.of('FAKE-OK'));
        spyOn(contentDialogService, 'openCopyMoveDialog').and.returnValue(Observable.of([fakeNode]));

        service.moveFolder(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCES.FOLDER.MOVE');
        });
    }));

    it('should be able to copy folder', async(() => {
        spyOn(documentListService, 'copyNode').and.returnValue(Observable.of('FAKE-OK'));
        spyOn(contentDialogService, 'openCopyMoveDialog').and.returnValue(Observable.of([fakeNode]));

        service.copyFolder(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCES.FOLDER.COPY');
        });
    }));

    it('should be able to propagate the dialog error', async(() => {
        spyOn(documentListService, 'copyNode').and.returnValue(Observable.throw('FAKE-KO'));
        spyOn(contentDialogService, 'openCopyMoveDialog').and.returnValue(Observable.of([fakeNode]));

        service.copyFolder(fakeNode, '!allowed').subscribe((value) => {
        }, (error) => {
            expect(error).toBe('FAKE-KO');
        });
    }));

});
