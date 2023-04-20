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

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentNodeSelectorComponent } from './content-node-selector.component';
import { Node, NodeEntry, SitePaging } from '@alfresco/js-api';
import { By } from '@angular/platform-browser';
import { FileModel } from '../common/models/file.model';
import { FileUploadEvent } from '../common/events/file.event';
import { UploadService } from '../common/services/upload.service';

import { of } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { DocumentListService } from '../document-list/services/document-list.service';
import { DocumentListComponent } from '../document-list/components/document-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { UploadModule } from '../upload';
import { ContentNodeSelectorPanelComponent } from './content-node-selector-panel.component';
import { NodeAction } from '../document-list/models/node-action.enum';
import { SitesService } from '../common/services/sites.service';
import { NodesApiService } from '../common/services/nodes-api.service';
import { ContentService } from '../common/services/content.service';

describe('ContentNodeSelectorComponent', () => {
    let component: ContentNodeSelectorComponent;
    let fixture: ComponentFixture<ContentNodeSelectorComponent>;
    let data: any;
    let uploadService: UploadService;
    let dialog: MatDialogRef<ContentNodeSelectorComponent>;

    beforeEach(() => {
        data = {
            title: 'Choose along citizen...',
            actionName: NodeAction.CHOOSE,
            select: new EventEmitter<Node>(),
            rowFilter: (shareDataRow) => shareDataRow.node.entry.name === 'impossible-name',
            imageResolver: () => 'piccolo',
            currentFolderId: 'cat-girl-nuku-nuku',
            selectionMode: 'multiple',
            showLocalUploadButton: true,
            restrictRootToCurrentFolderId: true
        };

        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule,
                MatDialogModule,
                UploadModule
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                {
                    provide: MatDialogRef,
                    useValue: {
                        keydownEvents: () => of(null),
                        backdropClick: () => of(null),
                        close: jasmine.createSpy('close'),
                        afterClosed: () => of(null),
                        afterOpened: () => of(null)
                    }
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });

        const documentListService = TestBed.inject(DocumentListService);
        const sitesService: SitesService = TestBed.inject(SitesService);

        dialog = TestBed.inject(MatDialogRef);
        uploadService = TestBed.inject(UploadService);

        spyOn(documentListService, 'getFolder');
        spyOn(documentListService, 'getFolderNode');
        spyOn(sitesService, 'getSites').and.returnValue(of(new SitePaging({ list: { entries: [] } })));

        fixture = TestBed.createComponent(ContentNodeSelectorComponent);
        component = fixture.componentInstance;

        const contentService = TestBed.inject(ContentService);
        spyOn(contentService, 'hasAllowableOperations').and.returnValue(true);

        const fakeFolderNodeWithPermission = new NodeEntry({
            entry: {
                allowableOperations: [
                    'create',
                    'update'
                ],
                isFolder: true,
                name: 'Folder Fake Name',
                nodeType: 'cm:folder'
            }
        });

        const nodesApiService = TestBed.inject(NodesApiService);
        spyOn(nodesApiService, 'getNode').and.returnValue(of(fakeFolderNodeWithPermission.entry));

        component.data.showLocalUploadButton = true;
        component.hasAllowableOperations = true;
        component.showingSearch = false;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    const enableLocalUpload = () => {
        component.data.showLocalUploadButton = true;
        component.hasAllowableOperations = true;
        component.showingSearch = false;
        component.isLoading = false;
    };

    const selectTabByIndex = (tabIndex: number) => {
        const uploadFromLocalTab = fixture.debugElement.queryAll(By.css('.mat-tab-label'))[tabIndex];
        const attributes = uploadFromLocalTab.nativeNode.attributes as NamedNodeMap;
        const tabPositionInSet = Number(attributes.getNamedItem('aria-posinset').value) - 1;
        component.onTabSelectionChange(tabPositionInSet);
    };

    describe('Data injecting with the "Material dialog way"', () => {

        it('should show the INJECTED title', () => {
            const titleElement = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-title"]'));
            expect(titleElement).not.toBeNull();
            expect(titleElement.nativeElement.innerText).toBe('Choose along citizen...');
        });

        it('should have the INJECTED actionName on the name of the choose button', () => {
            const actionButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
            expect(component.buttonActionName).toBe('NODE_SELECTOR.CHOOSE');
            expect(actionButton).not.toBeNull();
            expect(actionButton.nativeElement.innerText).toBe('NODE_SELECTOR.CHOOSE');
        });

        it('should pass through the injected currentFolderId to the documentList', () => {
            const documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
            expect(documentList).not.toBeNull('Document list should be shown');
            expect(documentList.componentInstance.currentFolderId).toBe('cat-girl-nuku-nuku');
        });

        it('should pass through the injected rowFilter to the documentList', () => {
            const documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
            expect(documentList).not.toBeNull('Document list should be shown');
            expect(documentList.componentInstance.rowFilter({
                node: {
                    entry: new Node({
                        name: 'impossible-name',
                        id: 'name'
                    })
                }
            }))
                .toBe(data.rowFilter({
                    node: {
                        entry: new Node({
                            name: 'impossible-name',
                            id: 'name'
                        })
                    }
                }));
        });

        it('should pass through the injected imageResolver to the documentList', () => {
            const documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
            expect(documentList).not.toBeNull('Document list should be shown');
            expect(documentList.componentInstance.imageResolver).toBe(data.imageResolver);
        });
   });

    describe('Cancel button', () => {
        it('should not be shown if dialogRef is NOT injected', () => {
            const closeButton = fixture.debugElement.query(By.css('[content-node-selector-actions-cancel]'));
            expect(closeButton).toBeNull();
        });

        it('should close the dialog', () => {
            let cancelButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-cancel"]'));
            cancelButton.triggerEventHandler('click', {});
            expect(dialog.close).toHaveBeenCalled();

            fixture.detectChanges();
            cancelButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-cancel"]'));
            expect(cancelButton).not.toBeNull();
        });
    });

    describe('Action button for the chosen node', () => {

        it('should be disabled by default', () => {
            fixture.detectChanges();

            const actionButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
            expect(actionButton.nativeElement.disabled).toBeTruthy();
        });

        it('should be enabled when a node is chosen', () => {
            component.onSelect([new Node({ id: 'fake' })]);
            fixture.detectChanges();

            const actionButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
            expect(actionButton.nativeElement.disabled).toBeFalsy();
        });

        it('should be disabled when no node chosen', () => {
            component.onSelect([new Node({ id: 'fake' })]);
            fixture.detectChanges();

            const actionButtonWithNodeSelected = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));

            expect(actionButtonWithNodeSelected.nativeElement.disabled).toBe(false);

            component.onSelect([]);
            fixture.detectChanges();

            const actionButtonWithoutNodeSelected = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));

            expect(actionButtonWithoutNodeSelected.nativeElement.disabled).toBe(true);
        });

        it('should close the dialog when action button is clicked', async () => {
            component.onSelect([new Node({ id: 'fake' })]);
            fixture.detectChanges();

            const actionButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
            await actionButton.nativeElement.click();

            expect(dialog.close).toHaveBeenCalled();
        });
    });

    describe('Title', () => {

        it('should be updated when a site is chosen', () => {
            const fakeSiteTitle = 'My fake site';
            const contentNodePanel = fixture.debugElement.query(By.directive(ContentNodeSelectorPanelComponent));
            contentNodePanel.componentInstance.siteChange.emit(fakeSiteTitle);
            fixture.detectChanges();

            const titleElement = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-title"]'));
            expect(titleElement).not.toBeNull();
            expect(titleElement.nativeElement.innerText).toBe('NODE_SELECTOR.CHOOSE_ITEM');
       });
   });

    describe('Upload button', () => {

        it('should be able to show upload button if showLocalUploadButton set to true', async () => {
            enableLocalUpload();
            selectTabByIndex(1);

            fixture.detectChanges();
            const adfUploadButton = fixture.debugElement.query(By.css('adf-upload-button'));

            expect(adfUploadButton).not.toBeNull();
            expect(adfUploadButton.nativeElement.innerText).toEqual('file_uploadFORM.FIELD.UPLOAD');
        });

        it('should be able to disable UploadButton if showingSearch set to true', () => {
            selectTabByIndex(1);
            component.showingSearch = true;
            component.hasAllowableOperations = true;

            fixture.detectChanges();
            const adfUploadButton = fixture.debugElement.query(By.css('adf-upload-button button'));

            expect(adfUploadButton).not.toBeNull();
            expect(adfUploadButton.nativeElement.disabled).toBe(true);
        });

        it('should be able to enable UploadButton if showingSearch set to false', () => {
            selectTabByIndex(1);
            component.showingSearch = false;
            component.hasAllowableOperations = true;

            fixture.detectChanges();
            const adfUploadButton = fixture.debugElement.query(By.css('adf-upload-button button'));

            expect(adfUploadButton).not.toBeNull();
            expect(adfUploadButton.nativeElement.disabled).toBe(false);
        });

        it('should be able to show warning message while searching', () => {
            component.data.showLocalUploadButton = true;
            component.showingSearch = true;
            component.hasAllowableOperations = false;
            selectTabByIndex(1);

            fixture.detectChanges();
            const infoMatIcon = fixture.debugElement.query(By.css('[data-automation-id="adf-content-node-selector-disabled-tab-info-icon"]'));
            const iconTooltipMessage = infoMatIcon.attributes['ng-reflect-message'];

            const expectedMessage = 'NODE_SELECTOR.UPLOAD_BUTTON_SEARCH_WARNING_MESSAGE';

            expect(component.getWarningMessage()).toEqual(expectedMessage);
            expect(iconTooltipMessage).toEqual(expectedMessage.substring(0, 30));
        });

        it('should not be able to show warning message if it is not in search mode', () => {
            component.data.showLocalUploadButton = true;
            component.showingSearch = false;

            fixture.detectChanges();
            const warningMessage = fixture.debugElement.query(By.css('.adf-content-node-upload-button-warning-message span'));

            expect(warningMessage).toBeNull();
        });

        it('should be able to disable UploadButton if user does not have allowable operations', () => {
            component.hasAllowableOperations = false;
            selectTabByIndex(1);

            fixture.detectChanges();
            const adfUploadButton = fixture.debugElement.query(By.css('adf-upload-button button'));

            expect(adfUploadButton).not.toBeNull();
            expect(adfUploadButton.nativeElement.disabled).toBe(true);
        });

        it('should be able to enable UploadButton if user has allowable operations', () => {
            selectTabByIndex(1);
            component.hasAllowableOperations = true;

            fixture.detectChanges();
            const adfUploadButton = fixture.debugElement.query(By.css('adf-upload-button button'));

            expect(adfUploadButton).not.toBeNull();
            expect(adfUploadButton.nativeElement.disabled).toBe(false);
        });

        it('should not be able to show warning message if user has allowable operations', () => {
            enableLocalUpload();
            selectTabByIndex(1);
            fixture.detectChanges();
            const warningMessage = fixture.debugElement.query(By.css('.adf-content-node-upload-button-warning-message span'));

            expect(warningMessage).toBeNull();
        });

        it('should be able to show warning message if user does not have allowable operations', () => {
            component.data.showLocalUploadButton = true;
            component.hasAllowableOperations = false;
            component.showingSearch = false;
            component.isLoading = false;
            selectTabByIndex(1);

            fixture.detectChanges();
            const infoMatIcon = fixture.debugElement.query(By.css('[data-automation-id="adf-content-node-selector-disabled-tab-info-icon"]'));
            const iconTooltipMessage = infoMatIcon.attributes['ng-reflect-message'];
            const expectedMessage = 'NODE_SELECTOR.UPLOAD_BUTTON_PERMISSION_WARNING_MESSAGE';

            expect(component.getWarningMessage()).toEqual(expectedMessage);
            expect(iconTooltipMessage).toEqual(expectedMessage.substring(0, 30));
        });

        it('should not be able to show warning message while loading documents', () => {
            component.data.showLocalUploadButton = true;
            component.hasAllowableOperations = false;
            component.showingSearch = false;
            component.isLoading = true;

            fixture.detectChanges();
            const warningMessage = fixture.debugElement.query(By.css('.adf-content-node-upload-button-warning-message span'));

            expect(warningMessage).toBeNull();
        });
    });

    describe('Tabs', () => {
        it('should isFileServerTabSelected return true when tabIndex 0 is selected', () => {
            selectTabByIndex(0);

            expect(component.isFileServerTabSelected()).toEqual(true);
        });

        it('should isLocalUploadTabSelected return true when tabIndex 1 is selected', () => {
            enableLocalUpload();
            selectTabByIndex(1);

            expect(component.isLocalUploadTabSelected()).toEqual(true);
        });

        it('should tabs be headless when local upload is not enabled', () => {
           component.data.showLocalUploadButton = false;
           fixture.detectChanges();
           const tabGroup = fixture.debugElement.queryAll(By.css('.adf-content-node-selector-headless-tabs'))[0];

           expect(tabGroup).not.toBe(undefined);
        });

        it('should tabs show headers when local upload is enabled', () => {
            component.data.showLocalUploadButton = true;
            fixture.detectChanges();
            const tabGroup = fixture.debugElement.queryAll(By.css('.adf-content-node-selector-headless-tabs'))[0];

            expect(tabGroup).toBe(undefined);
        });
    });

    describe('Drag and drop area', () => {
        it('should uploadStarted be false by default', () => {
            expect(component.uploadStarted).toBe(false);
        });

        it('should uploadStarted become true when the first upload gets started', () => {
            const fileUploadEvent  = new FileUploadEvent(new FileModel({ name: 'fake-name', size: 100 } as File));
            uploadService.fileUploadStarting.next(fileUploadEvent);

            expect(component.uploadStarted).toBe(true);
        });

        it('should show drag and drop area with the empty list template when no upload has started', async () => {
            enableLocalUpload();
            const uploadFromLocalTab = fixture.debugElement.queryAll(By.css('.mat-tab-label'))[1];
            uploadFromLocalTab.nativeElement.click();

            fixture.detectChanges();
            await fixture.whenRenderingDone();
            const emptyListTemplate = fixture.nativeElement.querySelector('[data-automation-id="adf-empty-list"]');
            const dragAndDropArea = fixture.debugElement.query(By.css('.adf-upload-drag-area'));

            expect(emptyListTemplate).not.toBeNull();
            expect(dragAndDropArea).not.toBeNull();
        });

        it('should not show the empty list template when an upload has started', async () => {
            enableLocalUpload();
            const uploadFromLocalTab = fixture.debugElement.queryAll(By.css('.mat-tab-label'))[1];
            uploadFromLocalTab.nativeElement.click();

            component.uploadStarted = true;
            fixture.detectChanges();
            await fixture.whenRenderingDone();
            const emptyListTemplate = fixture.nativeElement.querySelector('[data-automation-id="adf-empty-list"]');

            expect(emptyListTemplate).toBeNull();
        });
    });

    describe('Selected nodes counter', () => {
        it('should getSelectedCount return 0 by default', () => {
            expect(component.getSelectedCount()).toBe(0);
        });

        it('should getSelectedCount return 1 when a node is selected', () => {
            component.onSelect([new Node({ id: 'fake' })]);

            expect(component.getSelectedCount()).toBe(1);
        });

        it('should show the counter depending on the action', () => {
            component.action = NodeAction.ATTACH;
            fixture.detectChanges();
            expect(fixture.debugElement.nativeElement.querySelector('adf-node-counter')).not.toBe(null);

            component.action = NodeAction.CHOOSE;
            fixture.detectChanges();
            expect(fixture.debugElement.nativeElement.querySelector('adf-node-counter')).not.toBe(null);

            component.action = NodeAction.COPY;
            fixture.detectChanges();
            expect(fixture.debugElement.nativeElement.querySelector('adf-node-counter')).toBe(null);

            component.action = NodeAction.MOVE;
            fixture.detectChanges();
            expect(fixture.debugElement.nativeElement.querySelector('adf-node-counter')).toBe(null);
        });
    });
});
