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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule, UnsavedChangesDialogComponent } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MatDialogClose } from '@angular/material/dialog';

describe('UnsavedChangesDialog', () => {
    let fixture: ComponentFixture<UnsavedChangesDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule]
        });
        fixture = TestBed.createComponent(UnsavedChangesDialogComponent);
        fixture.detectChanges();
    });

    describe('Close icon button', () => {
        let closeIconButton: DebugElement;

        beforeEach(() => {
            closeIconButton = fixture.debugElement.query(By.css('[data-automation-id="adf-unsaved-changes-dialog-close-button"]'));
        });

        it('should have assigned dialog close button with false as result', () => {
            expect(closeIconButton.injector.get(MatDialogClose).dialogResult).toBeFalse();
        });

        it('should have displayed correct icon', () => {
            expect(closeIconButton.nativeElement.textContent).toBe('close');
        });
    });

    describe('Cancel button', () => {
        it('should have assigned dialog close button with false as result', () => {
            expect(
                fixture.debugElement.query(By.css('[data-automation-id="adf-unsaved-changes-dialog-cancel-button"]')).injector.get(MatDialogClose)
                    .dialogResult
            ).toBeFalse();
        });
    });

    describe('Discard changes button', () => {
        it('should have assigned dialog close button with true as result', () => {
            expect(
                fixture.debugElement
                    .query(By.css('[data-automation-id="adf-unsaved-changes-dialog-discard-changes-button"]'))
                    .injector.get(MatDialogClose).dialogResult
            ).toBeTrue();
        });
    });
});
