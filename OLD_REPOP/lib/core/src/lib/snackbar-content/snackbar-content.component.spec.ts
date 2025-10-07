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
import { MatIcon } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarContentComponent } from './snackbar-content.component';
import { UnitTestingUtils } from '../testing/unit-testing-utils';

describe('SnackbarContentComponent', () => {
    let component: SnackbarContentComponent;
    let fixture: ComponentFixture<SnackbarContentComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SnackbarContentComponent],
            providers: [
                {
                    provide: MatSnackBarRef,
                    useValue: {
                        dismissWithAction() {}
                    }
                },
                {
                    provide: MAT_SNACK_BAR_DATA,
                    useValue: {}
                }
            ]
        });

        fixture = TestBed.createComponent(SnackbarContentComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        component = fixture.componentInstance;
    });

    it('should display message if message in data is set', () => {
        component.data = {
            message: 'Some message'
        };
        fixture.detectChanges();
        expect(testingUtils.getInnerTextByCSS('.adf-snackbar-message-content')).toBe(component.data.message);
    });

    it('should not display message if message in data is not set', () => {
        fixture.detectChanges();
        expect(testingUtils.getInnerTextByCSS('.adf-snackbar-message-content')).toBe('');
    });

    it('should call snackBarRef.dismissWithAction() when button is clicked', () => {
        component.data = {
            message: '',
            showAction: true,
            actionLabel: 'Some action'
        };
        spyOn(component.snackBarRef, 'dismissWithAction');
        fixture.detectChanges();
        testingUtils.clickByCSS('.adf-snackbar-message-content-action-button');
        expect(component.snackBarRef.dismissWithAction).toHaveBeenCalled();
    });

    it('should display actionLabel if actionLabel in data is set', () => {
        component.data = {
            message: '',
            showAction: true,
            actionLabel: 'Some action action'
        };
        fixture.detectChanges();
        expect(testingUtils.getInnerTextByCSS('.adf-snackbar-message-content-action-button')).toBe(component.data.actionLabel);
    });

    it('should not display actionLabel if actionLabel in data is not set', () => {
        component.data = {
            message: '',
            showAction: true
        };
        fixture.detectChanges();
        expect(testingUtils.getByCSS('.adf-snackbar-message-content-action-button')).toBeNull();
    });

    it('should render icon if actionIcon in data is set', () => {
        component.data = {
            message: '',
            showAction: true,
            actionIcon: 'close'
        };
        fixture.detectChanges();
        expect(testingUtils.getByDirective(MatIcon)).toBeDefined();
    });

    it('should not render icon if actionIcon in data is not set', () => {
        component.data = {
            message: '',
            showAction: true
        };
        fixture.detectChanges();
        expect(testingUtils.getByDirective(MatIcon)).toBeNull();
    });
});
