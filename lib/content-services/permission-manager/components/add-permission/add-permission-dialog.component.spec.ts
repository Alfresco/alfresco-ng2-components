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

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { By } from '@angular/platform-browser';
import { setupTestBed } from '@alfresco/adf-core';
import { AddPermissionDialogComponent } from './add-permission-dialog.component';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { Subject } from 'rxjs';
import { AddPermissionDialogData } from './add-permission-dialog-data.interface';
import { fakeAuthorityResults } from '../../../mock/add-permission.component.mock';
import { AddPermissionPanelComponent } from './add-permission-panel.component';

describe('AddPermissionDialog', () => {

    let fixture: ComponentFixture<AddPermissionDialogComponent>;
    let element: HTMLElement;
    let data: AddPermissionDialogData = {
        title: 'dead or alive you are coming with me',
        nodeId: 'fake-node-id',
        confirm: new Subject<MinimalNodeEntity[]> ()
    };
    const dialogRef = {
        close: jasmine.createSpy('close')
    };

    setupTestBed({
        imports: [ContentTestingModule],
        providers: [
            { provide: MatDialogRef, useValue: dialogRef },
            { provide: MAT_DIALOG_DATA, useValue: data }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {

        fixture = TestBed.createComponent(AddPermissionDialogComponent);
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
        const closeButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#add-permission-dialog-close-button');
        expect(closeButton).not.toBeNull();
        closeButton.click();
        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should disable the confirm button when no selection is applied', () => {
        const confirmButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#add-permission-dialog-confirm-button');
        expect(confirmButton.disabled).toBeTruthy();
    });

    it('should enable the button when a selection is done', async(() => {
        const addPermissionPanelComponent: AddPermissionPanelComponent = fixture.debugElement.query(By.directive(AddPermissionPanelComponent)).componentInstance;
        addPermissionPanelComponent.select.emit(fakeAuthorityResults);
        let confirmButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#add-permission-dialog-confirm-button');
        expect(confirmButton.disabled).toBeTruthy();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            confirmButton = <HTMLButtonElement> element.querySelector('#add-permission-dialog-confirm-button');
            expect(confirmButton.disabled).toBeFalsy();
        });
    }));

    it('should stream the confirmed selection on the confirm subject', async(() => {
        const addPermissionPanelComponent: AddPermissionPanelComponent = fixture.debugElement.query(By.directive(AddPermissionPanelComponent)).componentInstance;
        addPermissionPanelComponent.select.emit(fakeAuthorityResults);
        data.confirm.subscribe((selection) => {
            expect(selection[0]).not.toBeNull();
            expect(selection[0].entry.id).not.toBeNull();
            expect(fakeAuthorityResults[0].entry.id).toBe(selection[0].entry.id);
        });

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const confirmButton = <HTMLButtonElement> element.querySelector('#add-permission-dialog-confirm-button');
            confirmButton.click();
        });
    }));
});
