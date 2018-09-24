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

import { MAT_DIALOG_DATA } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentNodeSelectorComponent } from './content-node-selector.component';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { By } from '@angular/platform-browser';
import { setupTestBed, SitesService } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { DocumentListService } from '../document-list/services/document-list.service';
import { DocumentListComponent } from '../document-list/components/document-list.component';

describe('ContentNodeSelectorDialogComponent', () => {

    let component: ContentNodeSelectorComponent;
    let fixture: ComponentFixture<ContentNodeSelectorComponent>;
    let data: any = {
        title: 'Move along citizen...',
        actionName: 'move',
        select: new EventEmitter<MinimalNodeEntryEntity>(),
        rowFilter: () => {
        },
        imageResolver: () => 'piccolo',
        currentFolderId: 'cat-girl-nuku-nuku'
    };

    setupTestBed({
        imports: [ContentTestingModule],
        providers: [
            { provide: MAT_DIALOG_DATA, useValue: data }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        const documentListService: DocumentListService = TestBed.get(DocumentListService);
        const sitesService: SitesService = TestBed.get(SitesService);
        spyOn(documentListService, 'getFolder').and.returnValue(of({ list: [] }));
        spyOn(documentListService, 'getFolderNode').and.returnValue(of({}));
        spyOn(sitesService, 'getSites').and.returnValue(of({ list: { entries: [] } }));

        fixture = TestBed.createComponent(ContentNodeSelectorComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Data injecting with the "Material dialog way"', () => {

        it('should show the INJECTED title', () => {
            const titleElement = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-title"]'));
            expect(titleElement).not.toBeNull();
            expect(titleElement.nativeElement.innerText).toBe('Move along citizen...');
        });

        it('should have the INJECTED actionName on the name of the choose button', () => {
            const actionButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
            expect(component.buttonActionName).toBe('NODE_SELECTOR.MOVE');
            expect(actionButton).not.toBeNull();
            expect(actionButton.nativeElement.innerText).toBe('NODE_SELECTOR.MOVE');
        });

        it('should pass through the injected currentFolderId to the documentList', () => {
            let documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
            expect(documentList).not.toBeNull('Document list should be shown');
            expect(documentList.componentInstance.currentFolderId).toBe('cat-girl-nuku-nuku');
        });

        xit('should pass through the injected rowFilter to the documentList', (done) => {
            fixture.whenStable().then(() => {
                let documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.rowFilter).toBe(data.rowFilter);
                done();
            });

        });

        it('should pass through the injected imageResolver to the documentList', () => {
            let documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
            expect(documentList).not.toBeNull('Document list should be shown');
            expect(documentList.componentInstance.imageResolver).toBe(data.imageResolver);
        });

    });

    describe('Cancel button', () => {

        it('should complete the data stream when user click "CANCEL"', () => {
            let cancelButton;
            data.select.subscribe(
                () => {
                },
                () => {
                },
                () => {
                    cancelButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-cancel"]'));
                    expect(cancelButton).not.toBeNull();
                });

            cancelButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-cancel"]'));
            cancelButton.triggerEventHandler('click', {});
        });

        it('should not be shown if dialogRef is NOT injected', () => {
            const closeButton = fixture.debugElement.query(By.css('[content-node-selector-actions-cancel]'));
            expect(closeButton).toBeNull();
        });
    });

    describe('Action button for the chosen node', () => {

        it('should be disabled by default', () => {
            fixture.detectChanges();

            let actionButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
            expect(actionButton.nativeElement.disabled).toBeTruthy();
        });

        it('should be enabled when a node is chosen', () => {
            component.onSelect([{ id: 'fake' }]);
            fixture.detectChanges();

            let actionButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
            expect(actionButton.nativeElement.disabled).toBeFalsy();
        });

    });

});
