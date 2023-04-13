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

import { setupTestBed } from '@alfresco/adf-core';
import { Node, PermissionElement } from '@alfresco/js-api';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AddPermissionPanelComponent } from './add-permission-panel.component';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { AddPermissionDialogComponent } from './add-permission-dialog.component';
import { AddPermissionDialogData } from './add-permission-dialog-data.interface';
import { fakeAuthorityResults } from '../../../mock/add-permission.component.mock';

describe('AddPermissionDialog', () => {

    let fixture: ComponentFixture<AddPermissionDialogComponent>;
    let component: AddPermissionDialogComponent;
    let element: HTMLElement;
    const data: AddPermissionDialogData = {
        title: 'dead or alive you are coming with me',
        node: {
            id: 'fake-node-id',
            aspectNames: [],
            isFile: true,
            name: 'fake-node.pdf',
            permissions: {
                locallySet: []
            }
        } as Node,
        roles: [
            {
                label: 'test',
                role: 'Test'
            },
            {
                label: 'consumer',
                role: 'Consumer'
            }
        ],
        confirm: new Subject<PermissionElement[]> ()
    };
    const dialogRef = {
        close: jasmine.createSpy('close')
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            { provide: MatDialogRef, useValue: dialogRef },
            { provide: MAT_DIALOG_DATA, useValue: data }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AddPermissionDialogComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should show the INJECTED title', () => {
        const titleElement = fixture.debugElement.query(By.css('#add-permission-dialog-title'));
        expect(titleElement).not.toBeNull();
        expect(titleElement.nativeElement.innerText).toBe('dead or alive you are coming with me');
    });

    it('should close the dialog when close button is clicked', () => {
        const closeButton = element.querySelector<HTMLButtonElement>('[data-automation-id="add-permission-dialog-close-button"]');
        expect(closeButton).not.toBeNull();
        closeButton.click();
        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should disable the confirm button when no selection is applied', () => {
        const confirmButton = element.querySelector<HTMLButtonElement>('[data-automation-id="add-permission-dialog-confirm-button"]');
        expect(confirmButton.disabled).toBeTruthy();
    });

    it('should enable the button when a selection is done', async () => {
        const addPermissionPanelComponent: AddPermissionPanelComponent = fixture.debugElement.query(By.directive(AddPermissionPanelComponent)).componentInstance;
        addPermissionPanelComponent.select.emit(fakeAuthorityResults);
        let confirmButton = element.querySelector<HTMLButtonElement>('[data-automation-id="add-permission-dialog-confirm-button"]');
        expect(confirmButton.disabled).toBeTruthy();

        fixture.detectChanges();
        await fixture.whenStable();

        confirmButton = element.querySelector<HTMLButtonElement>('[data-automation-id="add-permission-dialog-confirm-button"]');
        expect(confirmButton.disabled).toBe(false);
    });

    it('should update the role after selection', async () => {
        spyOn(component, 'onMemberUpdate').and.callThrough();
        const addPermissionPanelComponent: AddPermissionPanelComponent = fixture.debugElement.query(By.directive(AddPermissionPanelComponent)).componentInstance;
        let confirmButton = element.querySelector<HTMLButtonElement>('[data-automation-id="add-permission-dialog-confirm-button"]');
        expect(confirmButton.disabled).toBe(true);
        addPermissionPanelComponent.select.emit([fakeAuthorityResults[0]]);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(confirmButton.disabled).toBe(false);
        confirmButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const selectBox = fixture.debugElement.query(By.css(('[id="adf-select-role-permission"] .mat-select-trigger')));
        selectBox.triggerEventHandler('click', null);
        fixture.detectChanges();

        const options = fixture.debugElement.queryAll(By.css('mat-option'));
        expect(options).not.toBeNull();
        expect(options.length).toBe(2);
        options[0].triggerEventHandler('click', {});

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.onMemberUpdate).toHaveBeenCalled();

        let currentSelection = [];

        data.confirm.subscribe((selection) => {
            currentSelection = selection;
        });

        confirmButton = element.querySelector<HTMLButtonElement>('[data-automation-id="add-permission-dialog-confirm-button"]');
        expect(confirmButton.disabled).toBe(false);
        confirmButton.click();

        expect(currentSelection.length).toBe(1);
    });

    it('should update all the user role on header column update', async () => {
        spyOn(component, 'onBulkUpdate').and.callThrough();
        const addPermissionPanelComponent: AddPermissionPanelComponent = fixture.debugElement.query(By.directive(AddPermissionPanelComponent)).componentInstance;
        let confirmButton = element.querySelector<HTMLButtonElement>('[data-automation-id="add-permission-dialog-confirm-button"]');
        expect(confirmButton.disabled).toBe(true);
        addPermissionPanelComponent.select.emit(fakeAuthorityResults);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(confirmButton.disabled).toBe(false);
        confirmButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const selectBox = fixture.debugElement.query(By.css(('[id="adf-bulk-select-role-permission"] .mat-select-trigger')));
        selectBox.triggerEventHandler('click', null);

        fixture.detectChanges();
        await fixture.whenStable();

        const options = fixture.debugElement.queryAll(By.css('mat-option'));
        expect(options).not.toBeNull();
        expect(options.length).toBe(2);
        options[0].triggerEventHandler('click', {});

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.onBulkUpdate).toHaveBeenCalled();

        data.confirm.subscribe((selection) => {
            expect(selection.length).toBe(3);
        });

        confirmButton = element.querySelector<HTMLButtonElement>('[data-automation-id="add-permission-dialog-confirm-button"]');
        expect(confirmButton.disabled).toBe(false);
        confirmButton.click();
    });

    it('should delete the user after selection', async () => {
        spyOn(component, 'onMemberUpdate').and.callThrough();
        spyOn(component, 'onMemberDelete').and.callThrough();
        const addPermissionPanelComponent: AddPermissionPanelComponent = fixture.debugElement.query(By.directive(AddPermissionPanelComponent)).componentInstance;
        let confirmButton = element.querySelector<HTMLButtonElement>('[data-automation-id="add-permission-dialog-confirm-button"]');
        expect(confirmButton.disabled).toBe(true);
        addPermissionPanelComponent.select.emit(fakeAuthorityResults);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(confirmButton.disabled).toBe(false);
        confirmButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const selectBox = fixture.debugElement.query(By.css(('[id="adf-select-role-permission"] .mat-select-trigger')));
        selectBox.triggerEventHandler('click', null);

        fixture.detectChanges();
        await fixture.whenStable();

        const options = fixture.debugElement.queryAll(By.css('mat-option'));
        expect(options).not.toBeNull();
        expect(options.length).toBe(2);
        options[0].triggerEventHandler('click', {});
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.onMemberUpdate).toHaveBeenCalled();

        confirmButton = element.querySelector<HTMLButtonElement>('[data-automation-id="add-permission-dialog-confirm-button"]');
        expect(confirmButton.disabled).toBe(true);
        const deleteButton = element.querySelectorAll('[data-automation-id="adf-delete-permission-button"]') as any;
        deleteButton[1].click();
        deleteButton[2].click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(confirmButton.disabled).toBe(false);
        expect(component.onMemberDelete).toHaveBeenCalled();
        data.confirm.subscribe((selection) => {
            expect(selection.length).toBe(1);
        });

        confirmButton.click();
    });

    it('should stream the confirmed selection on the confirm subject', async () => {
        const addPermissionPanelComponent: AddPermissionPanelComponent = fixture.debugElement.query(By.directive(AddPermissionPanelComponent)).componentInstance;
        addPermissionPanelComponent.select.emit(fakeAuthorityResults);

        fixture.detectChanges();
        await fixture.whenStable();

        let authorityResult = fixture.debugElement.query(By.css('[data-automation-id="datatable-row-0"]'));
        expect(authorityResult).toBeNull();

        const confirmButton = element.querySelector<HTMLButtonElement>('[data-automation-id="add-permission-dialog-confirm-button"]');
        confirmButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        authorityResult = fixture.debugElement.query(By.css('[data-automation-id="datatable-row-0"]'));
        expect(authorityResult).toBeTruthy();
    });
});
