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

/*tslint:disable: ban*/

import { async, TestBed } from '@angular/core/testing';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AppConfigService } from '@alfresco/adf-core';
import { DocumentListService } from '../document-list/services/document-list.service';
import { ContentNodeDialogService } from './content-node-dialog.service';
import { MatDialog } from '@angular/material';

const fakeNode: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
        id: 'fake',
        name: 'fake-name'
};

describe('ContentNodeDialogService', () => {

    let service: ContentNodeDialogService;
    // let documentListService: DocumentListService;
    // let contentDialogService: ContentNodeDialogService;
    let materialDialog: MatDialog;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ContentNodeDialogService,
                DocumentListService,
                MatDialog
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        let appConfig: AppConfigService = TestBed.get(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';

        service = TestBed.get(ContentNodeDialogService);
        materialDialog = TestBed.get(MatDialog);
        spyOn(materialDialog, 'open').and.stub();
        spyOn(materialDialog, 'closeAll').and.stub();

    });

    it('should be able to create the service', () => {
        expect(service).not.toBeNull();
    });

    it('should be able to open the dialog when node has permission', () => {
        service.openCopyMoveDialog('fake-action', fakeNode, '!update');
        expect(materialDialog.open).toHaveBeenCalled();
    });

    it('should be able to open the dialog when node has NOT permission', () => {
        service.openCopyMoveDialog('fake-action', fakeNode, 'noperm').subscribe(
            () => { },
            (error) => {
                expect(materialDialog.open).not.toHaveBeenCalled();
                expect(error.statusCode).toBe(403);
            });
    });

    it('should be able to close the material dialog', () => {
        service.close();
        expect(materialDialog.closeAll).toHaveBeenCalled();
    });

});
