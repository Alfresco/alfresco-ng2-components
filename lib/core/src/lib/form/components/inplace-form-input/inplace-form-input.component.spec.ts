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
import { UntypedFormControl } from '@angular/forms';
import { InplaceFormInputComponent } from './inplace-form-input.component';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

describe('InplaceFormInputComponent', () => {
    let component: InplaceFormInputComponent;
    let fixture: ComponentFixture<InplaceFormInputComponent>;
    let formControl: UntypedFormControl;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [InplaceFormInputComponent]
        });
        formControl = new UntypedFormControl('');
        fixture = TestBed.createComponent(InplaceFormInputComponent);

        component = fixture.componentInstance;
        component.control = formControl;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    it('should update form value', () => {
        formControl.setValue('New Value');
        fixture.detectChanges();

        const input = testingUtils.getByDataAutomationId('adf-inplace-input').nativeElement;

        expect(input.value).toBe('New Value');
    });

    it('should show error', () => {
        formControl.setValidators(() => ({ error: 'error' }));
        formControl.setValue('value');
        formControl.markAsTouched();
        formControl.updateValueAndValidity();

        fixture.detectChanges();

        const error = testingUtils.getByDataAutomationId('adf-inplace-input-error');

        expect(error).toBeTruthy();
    });

    it('should show label', () => {
        formControl.setValue('');

        fixture.detectChanges();

        const error = testingUtils.getByDataAutomationId('adf-inplace-input-label');

        expect(error).toBeTruthy();
    });
});
