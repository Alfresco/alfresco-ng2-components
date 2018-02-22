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
    let spyOnDialogOpen: jasmine.Spy;

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
        spyOnDialogOpen = spyOn(materialDialog, 'open').and.stub();
        spyOn(materialDialog, 'closeAll').and.stub();

    });

    it('should be able to create the service', () => {
        expect(service).not.toBeNull();
    });

    it('should be able to open the dialog when node has permission', () => {
        service.openCopyMoveDialog('fake-action', fakeNode, '!update');
        expect(spyOnDialogOpen).toHaveBeenCalled();
    });

    it('should NOT be able to open the dialog when node has NOT permission', () => {
        service.openCopyMoveDialog('fake-action', fakeNode, 'noperm').subscribe(
            () => { },
            (error) => {
                expect(spyOnDialogOpen).not.toHaveBeenCalled();
                expect(JSON.parse(error.message).error.statusCode).toBe(403);
            });
    });

    it('should be able to open the dialog using a folder id', fakeAsync(() => {
        spyOn(documentListService, 'getFolderNode').and.returnValue(Promise.resolve(fakeNode));
        service.openFileBrowseDialogByFolderId('fake-folder-id').subscribe();
        tick();
        expect(spyOnDialogOpen).toHaveBeenCalled();
    }));

    it('should be able to open the dialog for files using the first user site', fakeAsync(() => {
        spyOn(sitesService, 'getSites').and.returnValue(Observable.of(fakeSiteList));
        spyOn(documentListService, 'getFolderNode').and.returnValue(Promise.resolve(fakeNode));
        service.openFileBrowseDialogBySite().subscribe();
        tick();
        expect(spyOnDialogOpen).toHaveBeenCalled();
    }));

    it('should be able to open the dialog for folder using the first user site', fakeAsync(() => {
        spyOn(sitesService, 'getSites').and.returnValue(Observable.of(fakeSiteList));
        spyOn(documentListService, 'getFolderNode').and.returnValue(Promise.resolve(fakeNode));
        service.openFolderBrowseDialogBySite().subscribe();
        tick();
        expect(spyOnDialogOpen).toHaveBeenCalled();
    }));

    it('should be able to close the material dialog', () => {
        service.close();
        expect(materialDialog.closeAll).toHaveBeenCalled();
    });

    describe('hasEntityCreatePermission', () => {
        const siteNode: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
            id: 'site',
            name: 'site-name',
            nodeType: 'st:site'
        };
        const sites: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
            id: 'sites',
            name: 'sites-name',
            nodeType: 'st:sites'
        };
        const site: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
            id: 'site-id',
            name: 'site-entry-name',
            guid: 'any-guid'
        };
        const nodeEntryWithRightPermissions: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
            id: 'node-id',
            name: 'node-name',
            allowableOperations: ['create']
        };
        const nodeEntryNoPermissions: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
            id: 'node-id',
            name: 'node-name',
            allowableOperations: []
        };

        const fixture = [
            {
                node: siteNode,
                infoKey: 'nodeType',
                expected: false
            },
            {
                node: sites,
                infoKey: 'nodeType',
                expected: false
            },
            {
                node: site,
                infoKey: 'guid',
                expected: false
            },
            {
                node: nodeEntryWithRightPermissions,
                infoKey: 'allowableOperations',
                expected: true
            },
            {
                node: nodeEntryNoPermissions,
                infoKey: 'allowableOperations',
                expected: false
            }
        ];

        fixture.forEach((testData) => {
            it(`should be \'${testData.expected}\' for given node with ${testData.infoKey} = \'${testData.node[testData.infoKey]}\'`, () => {

                let testContentNodeSelectorComponentData;
                spyOnDialogOpen.and.callFake((contentNodeSelectorComponent: any, config: any) => {
                    testContentNodeSelectorComponentData = config.data;
                    return {componentInstance: {}};
                });
                service.openCopyMoveDialog('fake-action', fakeNode, '!update');

                expect(spyOnDialogOpen.calls.count()).toEqual(1);
                expect(testContentNodeSelectorComponentData.isSelectionValid(testData.node)).toBe(testData.expected);
            });

        });
    });

});
