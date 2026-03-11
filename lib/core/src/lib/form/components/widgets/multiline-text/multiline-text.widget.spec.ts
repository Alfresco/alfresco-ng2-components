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
import { FormModel } from '../core/form.model';
import { FormFieldModel } from '../core/form-field.model';
import { FormFieldTypes } from '../core/form-field-types';
import { MultilineTextWidgetComponentComponent } from './multiline-text.widget';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitTestingUtils } from '../../../../testing/unit-testing-utils';
import { ADF_CUSTOM_MESSAGE } from '../core/custom-validation-message.token';
import { of, Subject } from 'rxjs';

describe('MultilineTextWidgetComponentComponent', () => {
    let loader: HarnessLoader;
    let widget: MultilineTextWidgetComponentComponent;
    let fixture: ComponentFixture<MultilineTextWidgetComponentComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MultilineTextWidgetComponentComponent]
        });
        fixture = TestBed.createComponent(MultilineTextWidgetComponentComponent);
        widget = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    describe('event tracking', () => {
        let eventSpy: jasmine.Spy;

        beforeEach(() => {
            eventSpy = spyOn(widget, 'event').and.callThrough();
            widget.field = new FormFieldModel(new FormModel(), {});
            fixture.detectChanges();
        });

        it('should call event method only once when widget is clicked', () => {
            const clickEvent = new MouseEvent('click', { bubbles: true });
            fixture.debugElement.nativeElement.dispatchEvent(clickEvent);

            expect(eventSpy).toHaveBeenCalledTimes(1);
            expect(eventSpy).toHaveBeenCalledWith(clickEvent);
        });
    });

    describe('when tooltip is set', () => {
        beforeEach(() => {
            widget.field = new FormFieldModel(new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.MULTILINE_TEXT,
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
                type: FormFieldTypes.MULTILINE_TEXT,
                required: true,
                name: 'myField'
            });
            fixture.detectChanges();
        });

        it('should be marked as invalid after interaction', async () => {
            expect(testingUtils.getByCSS('.adf-invalid')).toBeFalsy();

            await testingUtils.blurMatInput();
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
});

describe('MultilineTextWidgetComponentComponent - ADF_CUSTOM_MESSAGE', () => {
    let widget: MultilineTextWidgetComponentComponent;
    let fixture: ComponentFixture<MultilineTextWidgetComponentComponent>;
    let loader: HarnessLoader;
    let testingUtils: UnitTestingUtils;

    describe('when provided as plain boolean', () => {
        describe('set to true', () => {
            beforeEach(() => {
                TestBed.configureTestingModule({
                    imports: [MultilineTextWidgetComponentComponent],
                    providers: [{ provide: ADF_CUSTOM_MESSAGE, useValue: true }]
                });
                fixture = TestBed.createComponent(MultilineTextWidgetComponentComponent);
                widget = fixture.componentInstance;
                loader = TestbedHarnessEnvironment.loader(fixture);
                testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
            });

            it('should set enableCustomValidationMessage to true on the field', () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'multiline-id',
                    name: 'multiline-name',
                    type: FormFieldTypes.MULTILINE_TEXT
                });
                fixture.detectChanges();
                expect(widget.field.enableCustomValidationMessage).toBeTrue();
            });

            it('should display custom validation message when regex validation fails', async () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'multiline-id',
                    name: 'multiline-name',
                    value: '',
                    type: FormFieldTypes.MULTILINE_TEXT,
                    readOnly: false,
                    regexPattern: '^[0-9]+$',
                    customValidationMessage: 'Only numbers are allowed'
                });
                fixture.detectChanges();

                await testingUtils.fillMatInput('invalid text');
                expect(widget.field.isValid).toBeFalse();
                expect(widget.field.validationSummary.message).toBe('Only numbers are allowed');
            });
        });

        describe('set to false', () => {
            beforeEach(() => {
                TestBed.configureTestingModule({
                    imports: [MultilineTextWidgetComponentComponent],
                    providers: [{ provide: ADF_CUSTOM_MESSAGE, useValue: false }]
                });
                fixture = TestBed.createComponent(MultilineTextWidgetComponentComponent);
                widget = fixture.componentInstance;
                loader = TestbedHarnessEnvironment.loader(fixture);
                testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
            });

            it('should set enableCustomValidationMessage to false on the field', () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'multiline-id',
                    name: 'multiline-name',
                    type: FormFieldTypes.MULTILINE_TEXT
                });
                fixture.detectChanges();
                expect(widget.field.enableCustomValidationMessage).toBeFalse();
            });

            it('should display default validation message when regex validation fails even if customValidationMessage is set', async () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'multiline-id',
                    name: 'multiline-name',
                    value: '',
                    type: FormFieldTypes.MULTILINE_TEXT,
                    readOnly: false,
                    regexPattern: '^[0-9]+$',
                    customValidationMessage: 'Only numbers are allowed'
                });
                fixture.detectChanges();

                await testingUtils.fillMatInput('invalid text');
                expect(widget.field.isValid).toBeFalse();
                expect(widget.field.validationSummary.message).toBe('FORM.FIELD.VALIDATOR.INVALID_VALUE');
            });
        });
    });

    describe('when provided as observable', () => {
        describe('emitting true', () => {
            beforeEach(() => {
                TestBed.configureTestingModule({
                    imports: [MultilineTextWidgetComponentComponent],
                    providers: [{ provide: ADF_CUSTOM_MESSAGE, useValue: of(true) }]
                });
                fixture = TestBed.createComponent(MultilineTextWidgetComponentComponent);
                widget = fixture.componentInstance;
            });

            it('should set enableCustomValidationMessage to true on the field', () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'multiline-id',
                    name: 'multiline-name',
                    type: FormFieldTypes.MULTILINE_TEXT
                });
                fixture.detectChanges();
                expect(widget.field.enableCustomValidationMessage).toBeTrue();
            });
        });

        describe('emitting false', () => {
            beforeEach(() => {
                TestBed.configureTestingModule({
                    imports: [MultilineTextWidgetComponentComponent],
                    providers: [{ provide: ADF_CUSTOM_MESSAGE, useValue: of(false) }]
                });
                fixture = TestBed.createComponent(MultilineTextWidgetComponentComponent);
                widget = fixture.componentInstance;
            });

            it('should set enableCustomValidationMessage to false on the field', () => {
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'multiline-id',
                    name: 'multiline-name',
                    type: FormFieldTypes.MULTILINE_TEXT
                });
                fixture.detectChanges();
                expect(widget.field.enableCustomValidationMessage).toBeFalse();
            });
        });

        describe('when field is not set', () => {
            it('should not throw when observable emits after field is cleared', () => {
                const subject = new Subject<boolean>();
                TestBed.configureTestingModule({
                    imports: [MultilineTextWidgetComponentComponent],
                    providers: [{ provide: ADF_CUSTOM_MESSAGE, useValue: subject }]
                });
                fixture = TestBed.createComponent(MultilineTextWidgetComponentComponent);
                widget = fixture.componentInstance;
                widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'multiline-id',
                    name: 'multiline-name',
                    type: FormFieldTypes.MULTILINE_TEXT
                });
                fixture.detectChanges();

                widget.field = undefined as any;
                expect(() => subject.next(true)).not.toThrow();
            });
        });
    });

    describe('when not provided', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MultilineTextWidgetComponentComponent]
            });
            fixture = TestBed.createComponent(MultilineTextWidgetComponentComponent);
            widget = fixture.componentInstance;
            loader = TestbedHarnessEnvironment.loader(fixture);
            testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
        });

        it('should default enableCustomValidationMessage to false on the field', () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'multiline-id',
                name: 'multiline-name',
                type: FormFieldTypes.MULTILINE_TEXT
            });
            fixture.detectChanges();
            expect(widget.field.enableCustomValidationMessage).toBeFalse();
        });

        it('should display default validation message when regex validation fails', async () => {
            widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                id: 'multiline-id',
                name: 'multiline-name',
                value: '',
                type: FormFieldTypes.MULTILINE_TEXT,
                readOnly: false,
                regexPattern: '^[0-9]+$',
                customValidationMessage: 'Only numbers are allowed'
            });
            fixture.detectChanges();

            await testingUtils.fillMatInput('invalid text');
            expect(widget.field.isValid).toBeFalse();
            expect(widget.field.validationSummary.message).toBe('FORM.FIELD.VALIDATOR.INVALID_VALUE');
        });
    });
});
