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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { setupTestBed } from '@alfresco/adf-core';
import { fakeNodeWithCreatePermission } from '../mock';
import { DocumentListComponent, DocumentListService } from '../document-list';
import { DropdownBreadcrumbComponent } from './dropdown-breadcrumb.component';
import { ContentTestingModule } from '../testing/content.testing.module';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('DropdownBreadcrumb', () => {

    let component: DropdownBreadcrumbComponent;
    let fixture: ComponentFixture<DropdownBreadcrumbComponent>;
    let documentList: DocumentListComponent;
    let documentListService: DocumentListService = jasmine.createSpyObj({ loadFolderByNodeId: of(''), isCustomSourceService: false });

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: DocumentListService, useValue: documentListService }]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DropdownBreadcrumbComponent);
        component = fixture.componentInstance;
        documentList = TestBed.createComponent<DocumentListComponent>(DocumentListComponent).componentInstance;
        documentListService = TestBed.inject(DocumentListService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    const openSelect = () => {
        const folderIcon = fixture.debugElement.nativeElement.querySelector('[data-automation-id="dropdown-breadcrumb-trigger"]');
        folderIcon.click();
        fixture.detectChanges();
    };

    const triggerComponentChange = (fakeNodeData) => {
        component.folderNode = fakeNodeData;
        component.ngOnChanges();
        fixture.detectChanges();
    };

    const clickOnTheFirstOption = () => {
        const option: any = document.querySelector('[id^="mat-option"]');
        option.click();
    };

    it('should display only the current folder name if there is no previous folders', (done) => {
        const fakeNodeWithCreatePermissionInstance = JSON.parse(JSON.stringify(fakeNodeWithCreatePermission));
        fakeNodeWithCreatePermissionInstance.path.elements = [];

        triggerComponentChange(fakeNodeWithCreatePermissionInstance);

        fixture.whenStable().then(() => {

            openSelect();

            const currentFolder = fixture.debugElement.query(By.css('[data-automation-id="current-folder"]'));
            const path = fixture.debugElement.query(By.css('[data-automation-id="dropdown-breadcrumb-path"]'));
            expect(path).toBeNull();
            expect(currentFolder).not.toBeNull();
            expect(currentFolder.nativeElement.innerText.trim()).toEqual('Test');

            done();
        });
    });

    it('should display only the path in the selectBox', (done) => {
        const fakeNodeWithCreatePermissionInstance = JSON.parse(JSON.stringify(fakeNodeWithCreatePermission));
        fakeNodeWithCreatePermissionInstance.path.elements = [
            { id: '1', name: 'Stark Industries' },
            { id: '2', name: 'User Homes' },
            { id: '3', name: 'J.A.R.V.I.S' }
        ];

        triggerComponentChange(fakeNodeWithCreatePermissionInstance);

        fixture.whenStable().then(() => {

            openSelect();

            const path = fixture.debugElement.query(By.css('[data-automation-id="dropdown-breadcrumb-path"]'));
            const options = fixture.debugElement.queryAll(By.css('[data-automation-class="dropdown-breadcrumb-path-option"]'));
            expect(path).not.toBeNull();
            expect(options.length).toBe(3);
            done();
        });
    });


    it('should update document list when clicking on an option', async () => {
        component.target = documentList;
        const fakeNodeWithCreatePermissionInstance = JSON.parse(JSON.stringify(fakeNodeWithCreatePermission));
        fakeNodeWithCreatePermissionInstance.path.elements = [{ id: '1', name: 'Stark Industries' }];
        triggerComponentChange(fakeNodeWithCreatePermissionInstance);

        openSelect();
        await fixture.whenStable();
        clickOnTheFirstOption();

        expect(documentListService.loadFolderByNodeId).toHaveBeenCalledWith('1', documentList.DEFAULT_PAGINATION, undefined, undefined, null);
    });

    it('should open the selectBox when clicking on the folder icon', (done) => {
        triggerComponentChange(JSON.parse(JSON.stringify(fakeNodeWithCreatePermission)));
        spyOn(component.dropdown, 'open');

        fixture.whenStable().then(() => {
            openSelect();

            fixture.whenStable().then(() => {
                expect(component.dropdown.open).toHaveBeenCalled();
                done();
            });
        });
    });
});
