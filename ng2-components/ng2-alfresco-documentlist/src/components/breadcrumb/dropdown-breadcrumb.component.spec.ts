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

import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdOptionModule, MdSelectModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { CoreModule } from 'ng2-alfresco-core';
import { fakeNodeWithCreatePermission } from '../../assets/document-list.component.mock';
import { DocumentListComponent } from '../document-list.component';
import { DropdownBreadcrumbComponent } from './dropdown-breadcrumb.component';

describe('DropdownBreadcrumb', () => {

    let component: DropdownBreadcrumbComponent;
    let fixture: ComponentFixture<DropdownBreadcrumbComponent>;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                MdSelectModule,
                MdOptionModule
            ],
            declarations: [
                DropdownBreadcrumbComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DropdownBreadcrumbComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;
    });

    function openSelect() {
        const folderIcon = fixture.debugElement.query(By.css('[data-automation-id="dropdown-breadcrumb-trigger"]'));
        folderIcon.triggerEventHandler('click', null);
        fixture.detectChanges();
    }

    function triggerComponentChange(fakeNodeData) {
        const change = new SimpleChange(null, fakeNodeData, true);
        component.ngOnChanges({'folderNode': change});
        fixture.detectChanges();
    }

    function clickOnTheFirstOption() {
        const option = fixture.debugElement.query(By.css('[data-automation-class="dropdown-breadcrumb-path-option"]'));
        option.triggerEventHandler('click', null);
        fixture.detectChanges();
    }

    it('should display only the current folder name if there is no previous folders', () => {
        fakeNodeWithCreatePermission.path.elements = [];

        triggerComponentChange(fakeNodeWithCreatePermission);
        openSelect();

        const currentFolder = fixture.debugElement.query(By.css('[data-automation-id="current-folder"]'));
        const path = fixture.debugElement.query(By.css('[data-automation-id="dropdown-breadcrumb-path"]'));
        expect(path).toBeNull();
        expect(currentFolder).not.toBeNull();
        expect(currentFolder.nativeElement.innerText.trim()).toEqual('Test');
    });

    it('should display only the path in the selectbox', () => {
        fakeNodeWithCreatePermission.path.elements = [
            { id: '1', name: 'Stark Industries' },
            { id: '2', name: 'User Homes' },
            { id: '3', name: 'J.A.R.V.I.S' }
        ];

        triggerComponentChange(fakeNodeWithCreatePermission);
        openSelect();

        const path = fixture.debugElement.query(By.css('[data-automation-id="dropdown-breadcrumb-path"]'));
        const options = fixture.debugElement.queryAll(By.css('[data-automation-class="dropdown-breadcrumb-path-option"]'));
        expect(path).not.toBeNull();
        expect(options.length).toBe(3);
    });

    it('should display the path in reverse order', () => {
        fakeNodeWithCreatePermission.path.elements = [
            { id: '1', name: 'Stark Industries' },
            { id: '2', name: 'User Homes' },
            { id: '3', name: 'J.A.R.V.I.S' }
        ];

        triggerComponentChange(fakeNodeWithCreatePermission);
        openSelect();

        const options = fixture.debugElement.queryAll(By.css('[data-automation-class="dropdown-breadcrumb-path-option"]'));
        expect(options.length).toBe(3);
        expect(options[0].nativeElement.innerText.trim()).toBe('J.A.R.V.I.S');
        expect(options[1].nativeElement.innerText.trim()).toBe('User Homes');
        expect(options[2].nativeElement.innerText.trim()).toBe('Stark Industries');
    });

    it('should emit navigation event when clicking on an option', (done) => {
        fakeNodeWithCreatePermission.path.elements = [{ id: '1', name: 'Stark Industries' }];
        component.navigate.subscribe(val => {
            expect(val).toEqual({ id: '1', name: 'Stark Industries' });
            done();
        });

        triggerComponentChange(fakeNodeWithCreatePermission);
        openSelect();

        clickOnTheFirstOption();
    });

    it('should update document list  when clicking on an option', () => {
        let documentList = new DocumentListComponent(null, null, null, null);
        spyOn(documentList, 'loadFolderByNodeId').and.stub();
        component.target = documentList;
        fakeNodeWithCreatePermission.path.elements = [{ id: '1', name: 'Stark Industries' }];
        triggerComponentChange(fakeNodeWithCreatePermission);
        openSelect();

        clickOnTheFirstOption();

        expect(documentList.loadFolderByNodeId).toHaveBeenCalledWith('1');
    });

    it('should open the selectbox when clicking on the folder icon', async(() => {
        triggerComponentChange(fakeNodeWithCreatePermission);
        spyOn(component.selectbox, 'open');

        openSelect();

        expect(component.selectbox.open).toHaveBeenCalled();
    }));
});
