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

import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '../../../../testing/setup-test-bed';
import { ErrorWidgetComponent } from './error.component';
import { CoreTestingModule } from '../../../../testing';
import { ErrorMessageModel } from '../index';

describe('ErrorWidgetComponent', () => {

    let widget: ErrorWidgetComponent;
    let fixture: ComponentFixture<ErrorWidgetComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
    });
    const errorMessage: string = 'fake-error';
    const errorMessageModel: ErrorMessageModel = new ErrorMessageModel({message: errorMessage});
    const errorChanges: SimpleChanges = {
        error: new SimpleChange(errorMessageModel, errorMessageModel, false)
    };

    it('should display proper error icon', async () => {
        widget.ngOnChanges(errorChanges);

        await fixture.whenStable();
        fixture.detectChanges();

        const errorIcon = element.querySelector('.adf-error-icon').textContent;
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

        const requiredErrorText = element.querySelector('.adf-error-text').textContent;
        expect(requiredErrorText).toEqual(errorMessage);
    });
});
