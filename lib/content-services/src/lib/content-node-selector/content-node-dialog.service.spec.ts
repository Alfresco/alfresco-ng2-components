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

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NodeEntry, Node, SitePaging, Site } from '@alfresco/js-api';
import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { DocumentListService } from '../document-list/services/document-list.service';
import { ContentNodeDialogService } from './content-node-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, of } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NodeAction } from '../document-list/models/node-action.enum';
import { SitesService } from '../common/services/sites.service';

const fakeNodeEntry = {
    entry: {
        id: 'fake',
        name: 'fake-name'
    }
} as NodeEntry;

const fakeNode = {
    id: 'fake',
    name: 'fake-name'
} as Node;

const fakeSiteList: SitePaging = new SitePaging({
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
});

describe('ContentNodeDialogService', () => {

    let service: ContentNodeDialogService;
    let documentListService: DocumentListService;
    let sitesService: SitesService;
    let materialDialog: MatDialog;
    let spyOnDialogOpen: jasmine.Spy;
    let afterOpenObservable: Subject<any>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';

        service = TestBed.inject(ContentNodeDialogService);
        documentListService = TestBed.inject(DocumentListService);
        materialDialog = TestBed.inject(MatDialog);
        sitesService = TestBed.inject(SitesService);
        afterOpenObservable = new Subject<any>();
        spyOnDialogOpen = spyOn(materialDialog, 'open').and.returnValue({
            afterOpen: () => afterOpenObservable,
            afterClosed: () => of({}),
            componentInstance: {
                error: new Subject<any>()
            }
        } as any);
    });

    it('should not open the lock node dialog if have no permission', () => {
        const testNode = {
            id: 'fake',
            isFile: false
        } as Node;

        service.openLockNodeDialog(testNode).subscribe(() => {
        }, (error) => {
            expect(error).toBe('OPERATION.FAIL.NODE.NO_PERMISSION');
        });
    });

    it('should be able to open the dialog when node has permission', () => {
        service.openCopyMoveDialog(NodeAction.CHOOSE, fakeNode, '!update');
        expect(spyOnDialogOpen).toHaveBeenCalled();
    });

    it('should NOT be able to open the dialog when node has NOT permission', () => {
        service.openCopyMoveDialog(NodeAction.CHOOSE, fakeNode, 'noperm').subscribe(
            () => {},
            (error) => {
                expect(spyOnDialogOpen).not.toHaveBeenCalled();
                expect(JSON.parse(error.message).error.statusCode).toBe(403);
            });
    });

    it('should be able to open the dialog using a folder id', fakeAsync(() => {
        spyOn(documentListService, 'getFolderNode').and.returnValue(of(fakeNodeEntry));
        service.openFileBrowseDialogByFolderId('fake-folder-id').subscribe(() => {});
        tick();
        expect(spyOnDialogOpen).toHaveBeenCalled();
    }));

    it('should be able to open the dialog for files using the first user site', fakeAsync(() => {
        spyOn(sitesService, 'getSites').and.returnValue(of(fakeSiteList));
        spyOn(documentListService, 'getFolderNode').and.returnValue(of(fakeNodeEntry));
        service.openFileBrowseDialogBySite().subscribe(() => {});
        tick();
        expect(spyOnDialogOpen).toHaveBeenCalled();
    }));

    it('should be able to open the dialog for folder using the first user site', fakeAsync(() => {
        spyOn(sitesService, 'getSites').and.returnValue(of(fakeSiteList));
        spyOn(documentListService, 'getFolderNode').and.returnValue(of(fakeNodeEntry));
        service.openFolderBrowseDialogBySite().subscribe(() => {});
        tick();
        expect(spyOnDialogOpen).toHaveBeenCalled();
    }));

    describe('for the copy/move dialog', () => {
        const siteNode: Node = {
            id: 'site-node-id',
            nodeType: 'st:site'
        } as Node;
        const sites: Node = {
            id: 'sites-id',
            nodeType: 'st:sites'
        } as Node;
        const site: Site = {
            id: 'site-id',
            guid: 'any-guid'
        } as Site;
        const nodeEntryWithRightPermissions: Node = {
            id: 'node-id',
            allowableOperations: ['create']
        } as Node;
        const nodeEntryNoPermissions: Node = {
            id: 'node-id',
            allowableOperations: []
        } as Node;

        const siteFixture = [
            {
                node: siteNode,
                expected: false
            },
            {
                node: sites,
                expected: false
            },
            {
                node: site,
                expected: false
            }
        ];

        const permissionFixture = [
            {
                node: nodeEntryWithRightPermissions,
                expected: true
            },
            {
                node: nodeEntryNoPermissions,
                expected: false
            }
        ];

        let testContentNodeSelectorComponentData;

        beforeEach(() => {
            spyOnDialogOpen.and.callFake((_: any, config: any) => {
                testContentNodeSelectorComponentData = config.data;
                return { componentInstance: {}, afterClosed: () => of(null) };
            });
            service.openCopyMoveDialog(NodeAction.CHOOSE, fakeNode, '!update');
        });

        it('should NOT allow selection for sites', () => {
            expect(spyOnDialogOpen.calls.count()).toEqual(1);
            siteFixture.forEach((testData) => {
                expect(testContentNodeSelectorComponentData.isSelectionValid(testData.node)).toBe(testData.expected);
            });
        });

        it('should allow selection only for nodes with the right permission', () => {
            expect(spyOnDialogOpen.calls.count()).toEqual(1);
            permissionFixture.forEach((testData) => {
                expect(testContentNodeSelectorComponentData.isSelectionValid(testData.node)).toBe(testData.expected);
            });
        });
    });
});
