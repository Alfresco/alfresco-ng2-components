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

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { UnitTestingUtils } from '../../../../testing';
import { FormService } from '../../../services/form.service';
import { FormFieldModel, FormFieldTypes, FormModel } from '../core';
import { DecimalWidgetComponent } from './decimal.component';

describe('DecimalComponent', () => {
    let loader: HarnessLoader;
    let widget: DecimalWidgetComponent;
    let fixture: ComponentFixture<DecimalWidgetComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatInputModule, DecimalWidgetComponent],
            providers: [FormService]
        });

        fixture = TestBed.createComponent(DecimalWidgetComponent);
        widget = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    describe('when tooltip is set', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DECIMAL,
                tooltip: 'my custom tooltip'
            });
            fixture.detectChanges();
        });

        it('should show tooltip', async () => {
            const host = await testingUtils.getMatInputHost();
            await host.hover();

            const tooltip = await host.getAttribute('title');
            expect(tooltip).toBe('my custom tooltip');
        });
    });

    describe('when is required', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.DECIMAL,
                required: true
            });

            fixture.detectChanges();
        });

        it('should be marked as invalid after interaction', async () => {
            expect(testingUtils.getByCSS('.adf-invalid')).toBeFalsy();

            await testingUtils.blurMatInput();
            fixture.detectChanges();

            expect(testingUtils.getByCSS('.adf-invalid')).toBeTruthy();
        });

        it('should be able to display label with asterisk and input field is required', async () => {
            const formField = await testingUtils.getMatFormField();
            const formControl = await formField.getControl();

            expect(formControl.isRequired).toBeTruthy();

            const inputField = testingUtils.getByCSS('.adf-input').nativeElement;
            expect(inputField.hasAttribute('required')).toBeTruthy();
        });
    });

    describe('when form model has left labels', () => {
        it('should have left labels classes on leftLabels true', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                id: 'decimal-id',
                name: 'decimal-name',
                value: '',
                type: FormFieldTypes.DECIMAL,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const widgetContainer = testingUtils.getByCSS('.adf-left-label-input-container');
            expect(widgetContainer).not.toBeNull();

            const adfLeftLabel = testingUtils.getByCSS('.adf-left-label');
            expect(adfLeftLabel).not.toBeNull();
        });

        it('should not have left labels classes on leftLabels false', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: false }), {
                id: 'decimal-id',
                name: 'decimal-name',
                value: '',
                type: FormFieldTypes.DECIMAL,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const widgetContainer = testingUtils.getByCSS('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const adfLeftLabel = testingUtils.getByCSS('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
        });

        it('should not have left labels classes on leftLabels not present', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'decimal-id',
                name: 'decimal-name',
                value: '',
                type: FormFieldTypes.DECIMAL,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const widgetContainer = testingUtils.getByCSS('.adf-left-label-input-container');
            expect(widgetContainer).toBeNull();

            const adfLeftLabel = testingUtils.getByCSS('.adf-left-label');
            expect(adfLeftLabel).toBeNull();
        });

        it('should be able to display label with asterisk when leftlabel is true', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                id: 'decimal-id',
                name: 'decimal-name',
                value: '',
                type: FormFieldTypes.DECIMAL,
                readOnly: false,
                required: true
            });

            fixture.detectChanges();
            const asterisk = testingUtils.getByCSS('.adf-asterisk').nativeElement;

            expect(asterisk).toBeTruthy();
            expect(asterisk?.textContent).toEqual('*');
        });
    });
});
