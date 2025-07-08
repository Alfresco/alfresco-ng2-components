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

import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitTestingUtils } from '../../../../testing';
import { ErrorMessageModel } from '../core';
import { ErrorWidgetComponent } from './error.component';

describe('ErrorWidgetComponent', () => {
    let widget: ErrorWidgetComponent;
    let fixture: ComponentFixture<ErrorWidgetComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ErrorWidgetComponent]
        });
        fixture = TestBed.createComponent(ErrorWidgetComponent);
        widget = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });
    const errorMessage: string = 'fake-error';
    const errorMessageModel: ErrorMessageModel = new ErrorMessageModel({ message: errorMessage });
    const errorChanges: SimpleChanges = {
        error: new SimpleChange(errorMessageModel, errorMessageModel, false)
    };

    it('should display proper error icon', async () => {
        widget.ngOnChanges(errorChanges);

        await fixture.whenStable();
        fixture.detectChanges();

        const errorIcon = testingUtils.getByCSS('.adf-error-icon').nativeElement.textContent;
        expect(errorIcon).toEqual('error_outline');
    });

    it('should set subscriptAnimationState value', () => {
        widget.ngOnChanges(errorChanges);

        expect(widget.subscriptAnimationState).toEqual('enter');
    });

    it('should check proper error message', async () => {
        widget.ngOnChanges(errorChanges);

        await fixture.whenStable();
        fixture.detectChanges();

        const requiredErrorText = testingUtils.getByCSS('.adf-error-text').nativeElement.textContent;
        expect(requiredErrorText).toEqual(errorMessage);
    });
});
