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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Node, NodeEntry } from '@alfresco/js-api';
import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { DocumentListService } from './document-list.service';
import { NodeActionsService } from './node-actions.service';
import { ContentNodeDialogService } from '../../content-node-selector/content-node-dialog.service';
import { of, throwError } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { delay } from 'rxjs/operators';

const fakeNode: Node = {
    id: 'fake'
} as Node;

describe('NodeActionsService', () => {

    let service: NodeActionsService;
    let documentListService: DocumentListService;
    let contentDialogService: ContentNodeDialogService;
    const dialogRef = {
        open: jasmine.createSpy('open')
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            { provide: MatDialogRef, useValue: dialogRef }
        ]
    });

    beforeEach(() => {
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';

        service = TestBed.inject(NodeActionsService);
        documentListService = TestBed.inject(DocumentListService);
        contentDialogService = TestBed.inject(ContentNodeDialogService);

        spyOn(contentDialogService, 'openCopyMoveDialog').and.returnValue(of([fakeNode]).pipe(delay(100)));
    });

    it('should be able to copy content', fakeAsync(() => {
        spyOn(documentListService, 'copyNode').and.returnValue(of(new NodeEntry()));

        service.copyContent(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCESS.CONTENT.COPY');
        });

        tick(100);
    }));

    it('should be able to move content', fakeAsync(() => {
        spyOn(documentListService, 'moveNode').and.returnValue(of(new NodeEntry()));

        service.moveContent(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCESS.CONTENT.MOVE');
        });

        tick(100);
    }));

    it('should be able to move folder', fakeAsync(() => {
        spyOn(documentListService, 'moveNode').and.returnValue(of(new NodeEntry()));

        service.moveFolder(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCESS.FOLDER.MOVE');
        });

        tick(100);
    }));

    it('should be able to copy folder', fakeAsync(() => {
        spyOn(documentListService, 'copyNode').and.returnValue(of(new NodeEntry()));

        service.copyFolder(fakeNode, 'allowed').subscribe((value) => {
            expect(value).toBe('OPERATION.SUCCESS.FOLDER.COPY');
        });

        tick(100);
    }));

    it('should be able to propagate the dialog error', fakeAsync(() => {
        spyOn(documentListService, 'copyNode').and.returnValue(throwError('FAKE-KO'));

        service.copyFolder(fakeNode, '!allowed').subscribe(() => {
        }, (error) => {
            expect(error).toBe('FAKE-KO');
        });

        tick(100);
    }));
});
