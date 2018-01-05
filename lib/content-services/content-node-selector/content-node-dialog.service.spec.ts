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

import { async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MinimalNodeEntryEntity, SitePaging } from 'alfresco-js-api';
import { AppConfigService, SitesService } from '@alfresco/adf-core';
import { DocumentListService } from '../document-list/services/document-list.service';
import { ContentNodeDialogService } from './content-node-dialog.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

const fakeNode: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
        id: 'fake',
        name: 'fake-name'
};

const fakeSiteList: SitePaging = {
       list: {
        pagination: {
            count: 1,
            hasMoreItems: false,
            totalItems: 1,
            skipCount: 0,
            maxItems: 100
        },
        entries: [
            {
                entry: {
                    id: 'FAKE',
                    guid: 'FAKE-GUID',
                    title: 'FAKE-SITE-TITLE'
                }
            }
        ]
    }
};

describe('ContentNodeDialogService', () => {

    let service: ContentNodeDialogService;
    let documentListService: DocumentListService;
    let sitesService: SitesService;
    let materialDialog: MatDialog;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ContentNodeDialogService,
                DocumentListService,
                SitesService,
                MatDialog
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        let appConfig: AppConfigService = TestBed.get(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';

        service = TestBed.get(ContentNodeDialogService);
        documentListService = TestBed.get(DocumentListService);
        materialDialog = TestBed.get(MatDialog);
        sitesService =  TestBed.get(SitesService);
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

    it('should NOT be able to open the dialog when node has NOT permission', () => {
        service.openCopyMoveDialog('fake-action', fakeNode, 'noperm').subscribe(
            () => { },
            (error) => {
                expect(materialDialog.open).not.toHaveBeenCalled();
                expect(error.statusCode).toBe(403);
            });
    });

    it('should be able to open the dialog using a folder id', fakeAsync(() => {
        spyOn(documentListService, 'getFolderNode').and.returnValue(Promise.resolve(fakeNode));
        service.openFileBrowseDialogByFolderId('fake-folder-id').subscribe();
        tick();
        expect(materialDialog.open).toHaveBeenCalled();
    }));

    it('should be able to open the dialog using the first user site', fakeAsync(() => {
        spyOn(sitesService, 'getSites').and.returnValue(Observable.of(fakeSiteList));
        spyOn(documentListService, 'getFolderNode').and.returnValue(Promise.resolve(fakeNode));
        service.openFileBrowseDialogBySite().subscribe();
        tick();
        expect(materialDialog.open).toHaveBeenCalled();
    }));

    it('should be able to close the material dialog', () => {
        service.close();
        expect(materialDialog.closeAll).toHaveBeenCalled();
    });

});
