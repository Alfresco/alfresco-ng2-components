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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigValues, UnsavedChangesDialogComponent, UserPreferencesService } from '@alfresco/adf-core';
import { DebugElement } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { UnsavedChangesDialogData } from './unsaved-changes-dialog.model';
import { UnitTestingUtils } from '../../testing/unit-testing-utils';

describe('UnsavedChangesDialog', () => {
    let fixture: ComponentFixture<UnsavedChangesDialogComponent>;
    let userPreferencesService: UserPreferencesService;
    let savePreferenceCheckbox: DebugElement;
    let testingUtils: UnitTestingUtils;

    const setupBeforeEach = (unsavedChangesDialogData?: UnsavedChangesDialogData) => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: unsavedChangesDialogData ?? {}
                }
            ]
        });

        userPreferencesService = TestBed.inject(UserPreferencesService);
        fixture = TestBed.createComponent(UnsavedChangesDialogComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        fixture.detectChanges();
        savePreferenceCheckbox = testingUtils.getByDataAutomationId('adf-unsaved-changes-dialog-content-checkbox');
    };

    const getElements = (): { header: HTMLElement; content: HTMLElement; discardChangesButton: HTMLElement } => {
        const header = testingUtils.getByCSS('.adf-unsaved-changes-dialog-header').nativeElement;
        const content = testingUtils.getByCSS('.adf-unsaved-changes-dialog-content').nativeElement;
        const discardChangesButton = testingUtils.getByCSS('.adf-unsaved-changes-dialog-actions-discard-changes-button').nativeElement;
        return { header, content, discardChangesButton };
    };

    describe('when data is not present in dialog', () => {
        beforeEach(() => {
            setupBeforeEach();
        });

        it('should display correct text if there is no data object', () => {
            const { header, content, discardChangesButton } = getElements();
            expect(header.textContent).toContain('CORE.DIALOG.UNSAVED_CHANGES.TITLE');
            expect(content.textContent).toContain('CORE.DIALOG.UNSAVED_CHANGES.DESCRIPTION');
            expect(discardChangesButton.textContent).toContain('CORE.DIALOG.UNSAVED_CHANGES.DISCARD_CHANGES_BUTTON');
        });

        it('should have assigned dialog close button with true as result', () => {
            expect(
                testingUtils.getByDataAutomationId('adf-unsaved-changes-dialog-discard-changes-button').injector.get(MatDialogClose).dialogResult
            ).toBeTrue();
        });

        it('should have assigned dialog close button with false as result', () => {
            expect(
                testingUtils.getByDataAutomationId('adf-unsaved-changes-dialog-cancel-button').injector.get(MatDialogClose).dialogResult
            ).toBeFalse();
        });
    });

    describe('when data is present in dialog', () => {
        let userPreferencesServiceSetSpy: jasmine.Spy<(property: string, value: any) => void>;

        beforeEach(() => {
            setupBeforeEach({
                headerText: 'headerText',
                descriptionText: 'descriptionText',
                confirmButtonText: 'confirmButtonText',
                checkboxText: 'checkboxText'
            });
            userPreferencesServiceSetSpy = spyOn(userPreferencesService, 'set');
            fixture.detectChanges();
        });

        it('should display correct text if there is data object', () => {
            const { header, content, discardChangesButton } = getElements();

            expect(header.textContent).toContain('headerText');
            expect(content.textContent).toContain('descriptionText checkboxText');
            expect(discardChangesButton.textContent).toContain('confirmButtonText');
        });

        it('should call UserPreferences Service and update it to true when checkbox is checked', () => {
            const event = { checked: true };
            savePreferenceCheckbox.triggerEventHandler('change', event);
            expect(userPreferencesServiceSetSpy).toHaveBeenCalledWith(AppConfigValues.UNSAVED_CHANGES_MODAL_HIDDEN, 'true');
        });

        it('should call UserPreferences Service and update it to false when checkbox is unchecked', () => {
            const event = { checked: false };
            savePreferenceCheckbox.triggerEventHandler('change', event);
            expect(userPreferencesServiceSetSpy).toHaveBeenCalledWith(AppConfigValues.UNSAVED_CHANGES_MODAL_HIDDEN, 'false');
        });
    });
});
