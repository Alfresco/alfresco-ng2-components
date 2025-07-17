/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { DIALOG_COMPONENT_DATA, DialogComponent } from './dialog.component';
import { DialogData } from './dialog-data.interface';
import { DialogSize } from './dialog.model';
import { UnitTestingUtils } from '../../testing';
import { Component, inject } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'adf-dummy-component'
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
    let testingUtils: UnitTestingUtils;

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
            imports: [DummyComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: dialogOptions },
                { provide: MatDialogRef, useValue: dialogRef }
            ]
        }).compileComponents();

        dialogRef.close.calls.reset();
        fixture = TestBed.createComponent(DialogComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        fixture.detectChanges();

        confirmButton = testingUtils.getByDataAutomationId('adf-dialog-actions-confirm').nativeElement;
        closeButton = testingUtils.getByDataAutomationId('adf-dialog-close-button')?.nativeElement;
        cancelButton = testingUtils.getByDataAutomationId('adf-dialog-actions-cancel')?.nativeElement;
        dialogContainer = testingUtils.getByDataAutomationId('adf-dialog-container').nativeElement;
    };

    describe('when init with default data', () => {
        beforeEach(() => {
            setupBeforeEach();
        });

        it('should have default template elements', () => {
            expect(dialogContainer).toBeDefined();
            expect(testingUtils.getByCSS('.adf-dialog-header')).toBeDefined();
            expect(testingUtils.getByCSS('.adf-dialog-content')).toBeDefined();
            expect(testingUtils.getByCSS('.adf-dialog-actions')).toBeDefined();
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
            expect(closeButton).toBeUndefined();
        });

        it('should hide close button', () => {
            expect(cancelButton).toBeUndefined();
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
            expect(testingUtils.getByCSS('.adf-alert .adf-dialog-header::after')).toBeDefined();
            expect(testingUtils.getByCSS('.adf-alert .adf-dialog-actions::after')).toBeDefined();
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
            expect(testingUtils.getByCSS('.adf-alert .adf-dialog-header::after')).toBeDefined();
            expect(testingUtils.getByCSS('.adf-alert .adf-dialog-actions::after')).toBeDefined();
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
                expect(testingUtils.getByCSS('.adf-alert .adf-dialog-header::after')).toBeNull();
                expect(testingUtils.getByCSS('.adf-alert .adf-dialog-actions::after')).toBeNull();
            });

            it('should not center header content', () => {
                expect(testingUtils.getByCSS('.adf-centered-header')).toBeNull();
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
                expect(testingUtils.getByCSS('.adf-dialog-header-icon')).toBeDefined();
            });

            it('should center header content', () => {
                expect(testingUtils.getByCSS('.adf-centered-header')).toBeDefined();
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
            const debugElement = testingUtils.getByDirective(DummyComponent);
            const dummyComponentInstance = debugElement.componentInstance;

            expect(dummyComponentInstance).toBeTruthy();
            expect(dummyComponentInstance.data).toEqual(mockData);
        });
    });
});
