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
import { EventEmitter } from '@angular/core';
import { AppConfigService } from '@alfresco/adf-core';
import { DocumentListService } from './document-list.service';
import { NodeActionsService } from './node-actions.service';
import { ContentNodeDialogService } from '../../content-node-selector/content-node-dialog.service';
import { Observable } from 'rxjs/Observable';

const fakeNode: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
        id: 'fake'
};

describe('NodeActionsService', () => {

    let service: NodeActionsService;
    let documentListService: DocumentListService;
    let contentDialogService: ContentNodeDialogService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                NodeActionsService,
                DocumentListService,
                ContentNodeDialogService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        let appConfig: AppConfigService = TestBed.get(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';

        service = TestBed.get(NodeActionsService);
        documentListService = TestBed.get(DocumentListService);
        contentDialogService = TestBed.get(ContentNodeDialogService);
        contentDialogService.select = new EventEmitter<MinimalNodeEntryEntity[]>();
        spyOn(contentDialogService, 'openCopyMoveDialog').and.stub();
    });

    it('should be able to create the service', () => {
        expect(service).not.toBeNull();
    });

    it('should be able to copy content', async(() => {
        spyOn(documentListService, 'copyNode').and.returnValue(Observable.of('FAKE-OK'));

        service.copyContent(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCES.CONTENT.COPY');
        });
        contentDialogService.select.emit([fakeNode]);
    }));

    it('should be able to move content', async(() => {
        spyOn(documentListService, 'moveNode').and.returnValue(Observable.of('FAKE-OK'));

        service.moveContent(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCES.CONTENT.MOVE');
        });
        contentDialogService.select.emit([fakeNode]);
    }));

    it('should be able to move folder', async(() => {
        spyOn(documentListService, 'moveNode').and.returnValue(Observable.of('FAKE-OK'));

        service.moveFolder(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCES.FOLDER.MOVE');
        });
        contentDialogService.select.emit([fakeNode]);
    }));

    it('should be able to copy folder', async(() => {
        spyOn(documentListService, 'copyNode').and.returnValue(Observable.of('FAKE-OK'));

        service.copyFolder(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCES.FOLDER.COPY');
        });
        contentDialogService.select.emit([fakeNode]);
    }));

    it('should be able to propagate the dialog error', async(() => {
        spyOn(documentListService, 'copyNode').and.returnValue(Observable.throw('FAKE-KO'));

        service.copyFolder(fakeNode, '!allowed').subscribe((value) => {
        }, (error) => {
            expect(error).toBe('FAKE-KO');
        });
        contentDialogService.select.emit([fakeNode]);
    }));

});
