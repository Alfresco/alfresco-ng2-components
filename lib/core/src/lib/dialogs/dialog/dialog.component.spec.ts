/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DIALOG_COMPONENT_DATA, DialogComponent } from './dialog.component';
import { DialogData } from './dialog-data.interface';
import { DialogSize } from './dialog.model';
import { CoreTestingModule } from '../../testing';
import { Component, DebugElement, inject } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'adf-dummy-component',
    standalone: false
})
class DummyComponent {
    data = inject(DIALOG_COMPONENT_DATA);
}

describe('DialogComponent', () => {
    let component: DialogComponent;
    let fixture: ComponentFixture<DialogComponent>;
    let closeButton: HTMLButtonElement;
    let cancelButton: HTMLButtonElement;
    let confirmButton: HTMLButtonElement;
    let dialogContainer: HTMLElement;
    const mockId = 'mockId';
    const mockDataOnConfirm$ = new Subject();

    const data: DialogData = {
        title: 'Title',
        description: 'Description that can be longer or shorter'
    };

    const dialogRef = {
        close: jasmine.createSpy('close'),
        addPanelClass: jasmine.createSpy('addPanelClass')
    };

    const setupBeforeEach = (dialogOptions: DialogData = data) => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule],
            declarations: [DummyComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: dialogOptions },
                { provide: MatDialogRef, useValue: dialogRef }
            ]
        }).compileComponents();

        dialogRef.close.calls.reset();
        fixture = TestBed.createComponent(DialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        confirmButton = fixture.nativeElement.querySelector('[data-automation-id="adf-dialog-actions-confirm"]');
        closeButton = fixture.nativeElement.querySelector('[data-automation-id="adf-dialog-close-button"]');
        cancelButton = fixture.nativeElement.querySelector('[data-automation-id="adf-dialog-actions-cancel"]');
        dialogContainer = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-dialog-container"]');
    };

    describe('when init with default data', () => {
        beforeEach(() => {
            setupBeforeEach();
        });

        it('should have default template elements', () => {
            expect(dialogContainer).toBeDefined();
            expect(fixture.nativeElement.querySelector('.adf-dialog-header')).toBeDefined();
            expect(fixture.nativeElement.querySelector('.adf-dialog-content')).toBeDefined();
            expect(fixture.nativeElement.querySelector('.adf-dialog-actions')).toBeDefined();
        });

        it('should have default values for the dialog', () => {
            expect(closeButton).toBeDefined();

            expect(dialogContainer.classList).toContain('adf-medium');

            expect(confirmButton.innerText).toBe('COMMON.APPLY');

            expect(cancelButton.innerText).toBe('COMMON.CANCEL');
        });
    });

    describe('confirm action', () => {
        const mockButtonTitle = 'mockTitle';
        beforeEach(() => {
            setupBeforeEach({ ...data, confirmButtonTitle: mockButtonTitle, dataOnConfirm$: mockDataOnConfirm$ });
            fixture.detectChanges();
        });

        it('should disable confirm button after confirm button was clicked', (done) => {
            expect(confirmButton.getAttribute('disabled')).toBeFalsy();

            confirmButton.click();
            fixture.detectChanges();

            expect(confirmButton.getAttribute('disabled')).toBeTruthy();
            component.isConfirmButtonDisabled$.subscribe((value) => {
                expect(value).toBeTrue();
                done();
            });
        });

        it('should disable confirm button with updated confirmButtonDisabled$', () => {
            component.isConfirmButtonDisabled$.next(false);

            expect(confirmButton.getAttribute('disabled')).toBeFalsy();

            component.isConfirmButtonDisabled$.next(true);
            fixture.detectChanges();

            expect(confirmButton.getAttribute('disabled')).toBeTruthy();
        });

        it('should close dialog and pass default value', () => {
            component.onConfirm();
            expect(dialogRef.close).toHaveBeenCalledWith(true);
        });

        it('should close dialog and pass dataOnConfirm$', () => {
            mockDataOnConfirm$.next(mockId);

            component.onConfirm();

            expect(dialogRef.close).toHaveBeenCalledWith(mockId);
        });

        it('should set correct button title', () => {
            expect(component.confirmButtonTitle).toEqual(mockButtonTitle);
        });
    });

    describe('cancel action', () => {
        beforeEach(() => {
            setupBeforeEach();
        });

        it('should close dialog when cancel button was clicked', () => {
            cancelButton.click();
            fixture.detectChanges();
            expect(dialogRef.close).toHaveBeenCalled();
        });

        it('should close dialog when close button was clicked', () => {
            closeButton.click();
            fixture.detectChanges();
            expect(dialogRef.close).toHaveBeenCalled();
        });
    });

    describe('when isCloseButtonHidden and isCancelButtonHidden set to true', () => {
        beforeEach(() => {
            setupBeforeEach({
                ...data,
                isCloseButtonHidden: true,
                isCancelButtonHidden: true
            });
        });

        it('should hide close button', () => {
            expect(closeButton).toBeNull();
        });

        it('should hide close button', () => {
            expect(cancelButton).toBeNull();
        });
    });

    describe('when dialog has large size', () => {
        beforeEach(() => {
            setupBeforeEach({ ...data, dialogSize: DialogSize.Large });
        });

        it('should have correct dialogSize value', () => {
            expect(component.dialogSize).toEqual(DialogSize.Large);
        });

        it(`should contain ${DialogSize.Large} class`, () => {
            expect(dialogContainer.classList).toContain(DialogSize.Large);
        });

        it('should not have header and actions border', () => {
            const headerBorder = fixture.nativeElement.querySelector('.adf-alert .adf-dialog-header::after');
            const actionsBorder = fixture.nativeElement.querySelector('.adf-alert .adf-dialog-actions::after');

            expect(headerBorder).toBeDefined();
            expect(actionsBorder).toBeDefined();
        });
    });

    describe('when dialog has medium size', () => {
        beforeEach(() => {
            setupBeforeEach({ ...data, dialogSize: DialogSize.Medium });
        });

        it('should have correct dialogSize value', () => {
            expect(component.dialogSize).toEqual(DialogSize.Medium);
        });

        it(`should contain ${DialogSize.Medium} class`, () => {
            expect(dialogContainer.classList).toContain(DialogSize.Medium);
        });

        it('should not have header and actions border', () => {
            const headerBorder = fixture.nativeElement.querySelector('.adf-alert .adf-dialog-header::after');
            const actionsBorder = fixture.nativeElement.querySelector('.adf-alert .adf-dialog-actions::after');

            expect(headerBorder).toBeDefined();
            expect(actionsBorder).toBeDefined();
        });
    });

    describe('when dialog has alert size', () => {
        describe('when dialog has not an ican', () => {
            beforeEach(() => {
                setupBeforeEach({ ...data, dialogSize: DialogSize.Alert });
            });

            it('should have correct dialogSize value', () => {
                expect(component.dialogSize).toEqual(DialogSize.Alert);
            });

            it(`should contain ${DialogSize.Alert} class`, () => {
                expect(dialogContainer.classList).toContain(DialogSize.Alert);
            });

            it('should not have header and actions border', () => {
                const headerBorder = fixture.nativeElement.querySelector('.adf-alert .adf-dialog-header::after');
                const actionsBorder = fixture.nativeElement.querySelector('.adf-alert .adf-dialog-actions::after');

                expect(headerBorder).toBeNull();
                expect(actionsBorder).toBeNull();
            });

            it('should not center header content', () => {
                const header = fixture.nativeElement.querySelector('.adf-centered-header');

                expect(header).toBeNull();
            });
        });

        describe('when header contains icon', () => {
            beforeEach(() => {
                setupBeforeEach({
                    ...data,
                    dialogSize: DialogSize.Alert,
                    headerIcon: 'access_time'
                });
            });

            it('should have icon element', () => {
                const headerIcon = fixture.nativeElement.querySelector('.adf-dialog-header-icon');

                expect(headerIcon).toBeDefined();
            });

            it('should center header content', () => {
                const header = fixture.nativeElement.querySelector('.adf-centered-header');

                expect(header).toBeDefined();
            });
        });
    });

    describe('when contentComponent with contentData was passed', () => {
        const mockData = 'Injected Data';

        beforeEach(() => {
            setupBeforeEach({
                ...data,
                contentComponent: DummyComponent,
                componentData: mockData
            });
        });

        it('should generate component with injectoted data', () => {
            const debugElement: DebugElement = fixture.debugElement.query(By.directive(DummyComponent));
            const dummyComponentInstance = debugElement.componentInstance;

            expect(dummyComponentInstance).toBeTruthy();
            expect(dummyComponentInstance.data).toEqual(mockData);
        });
    });
});
