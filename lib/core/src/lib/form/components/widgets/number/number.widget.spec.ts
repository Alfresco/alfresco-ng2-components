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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CoreTestingModule, UnitTestingUtils } from '../../../../testing';
import { FormFieldModel, FormFieldTypes, FormModel } from '../core';
import { NumberWidgetComponent } from './number.widget';
import { DecimalNumberPipe } from '../../../../pipes';

describe('NumberWidgetComponent', () => {
    let loader: HarnessLoader;
    let widget: NumberWidgetComponent;
    let fixture: ComponentFixture<NumberWidgetComponent>;
    let testingUtils: UnitTestingUtils;
    let mockDecimalNumberPipe: DecimalNumberPipe;

    beforeEach(() => {
        mockDecimalNumberPipe = jasmine.createSpyObj('DecimalNumberPipe', ['transform']);
        TestBed.configureTestingModule({
            imports: [CoreTestingModule, MatInputModule, MatIconModule],
            providers: [
                {
                    provide: DecimalNumberPipe,
                    useValue: mockDecimalNumberPipe
                }
            ]
        });
        fixture = TestBed.createComponent(NumberWidgetComponent);
        widget = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    it('should create', () => {
        expect(widget).toBeTruthy();
    });

    describe('with readonly true', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.NUMBER,
                value: 123.45,
                id: 'number-id',
                readOnly: true
            });
            fixture.detectChanges();
        });

        it('should set displayValue using decimalNumberPipe', () => {
            widget.ngOnInit();

            expect(mockDecimalNumberPipe.transform).toHaveBeenCalledWith(123.45);
            expect(widget.displayValue).toBe('123.45');
        });
    });

    describe('with default value', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.NUMBER,
                value: 123,
                id: 'number-id',
                readOnly: false
            });
            fixture.detectChanges();
        });

        it('should display the value', async () => {
            const input = await testingUtils.getMatInput();

            expect(widget.displayValue).toBe(123);
            expect(await input.getValue()).toBe('123');
            expect(widget.field.value).toBe(123);
        });

        it('should have value null when field is cleared', async () => {
            const input = await testingUtils.getMatInput();
            await input.setValue('');

            expect(widget.field.value).toBeNull();
        });

        it('should have value null when value is undefined', async () => {
            const input = await testingUtils.getMatInput();
            await input.setValue(undefined);

            expect(widget.field.value).toBeNull();
        });

        it('should have value null when value is null', async () => {
            const input = await testingUtils.getMatInput();
            await input.setValue(null);

            expect(widget.field.value).toBeNull();
        });
    });

    describe('when tooltip is set', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.NUMBER,
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
                type: FormFieldTypes.NUMBER,
                required: true
            });
            fixture.detectChanges();
        });

        it('should be marked as invalid after interaction', async () => {
            expect(testingUtils.getByCSS('.adf-invalid')).toBeFalsy();

            await testingUtils.blurMatInput();

            expect(testingUtils.getByCSS('.adf-invalid')).toBeTruthy();
        });

        it('should be able to display label with asterisk', async () => {
            const asterisk = testingUtils.getByCSS('.adf-asterisk').nativeElement;

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });
    });

    describe('when form model has left labels', () => {
        it('should have left labels classes on leftLabels true', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id', leftLabels: true }), {
                id: 'number-id',
                name: 'number-name',
                value: '',
                type: FormFieldTypes.NUMBER,
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
                id: 'number-id',
                name: 'number-name',
                value: '',
                type: FormFieldTypes.NUMBER,
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
                id: 'number-id',
                name: 'number-name',
                value: '',
                type: FormFieldTypes.NUMBER,
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
    });
});
