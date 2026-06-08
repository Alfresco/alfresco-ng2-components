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
import { FormFieldModel, FormModel } from '../core';
import { FormFieldTypes } from '../core/form-field-types';
import { DisplayTextWidgetComponent } from './display-text.widget';
import { ADF_DISPLAY_TEXT_SETTINGS } from '../base-display-text/base-display-text.widget';
import { ADF_TYPED_VALUE_FORMATTING_ENABLED } from '../../../services/form-field-value-formatter.token';
import { FormService } from '../../../services/form.service';
import { of } from 'rxjs';

describe('DisplayTextWidgetComponent', () => {
    let fixture: ComponentFixture<DisplayTextWidgetComponent>;
    let widget: DisplayTextWidgetComponent;
    let formService: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DisplayTextWidgetComponent],
            providers: [FormService]
        });

        fixture = TestBed.createComponent(DisplayTextWidgetComponent);
        widget = fixture.componentInstance;
        formService = TestBed.inject(FormService);
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

    describe('expression evaluation', () => {
        beforeEach(() => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [DisplayTextWidgetComponent],
                providers: [
                    FormService,
                    {
                        provide: ADF_DISPLAY_TEXT_SETTINGS,
                        useValue: { enableExpressionEvaluation: true }
                    }
                ]
            });

            fixture = TestBed.createComponent(DisplayTextWidgetComponent);
            widget = fixture.componentInstance;
            formService = TestBed.inject(FormService);
        });

        it('should resolve field expressions in text value', () => {
            const form = new FormModel({
                fields: [
                    { id: 'displayText1', type: 'display-text', value: 'Hello ${field.name}' },
                    { id: 'name', type: 'text', value: 'John' }
                ]
            });

            widget.field = form.getFieldById('displayText1');
            fixture.detectChanges();

            expect(widget.field.value).toBe('Hello John');
        });

        it('should resolve variable expressions in text value', () => {
            const form = new FormModel({
                fields: [{ id: 'displayText1', type: 'display-text', value: 'Status: ${variable.status}' }],
                variables: [{ id: 'status', name: 'status', type: 'string', value: 'Active' }]
            });

            widget.field = form.getFieldById('displayText1');
            fixture.detectChanges();

            expect(widget.field.value).toBe('Status: Active');
        });

        it('should resolve multiple expressions in text value', () => {
            const form = new FormModel({
                fields: [
                    { id: 'displayText1', type: 'display-text', value: '${field.firstName} ${field.lastName}' },
                    { id: 'firstName', type: 'text', value: 'John' },
                    { id: 'lastName', type: 'text', value: 'Doe' }
                ]
            });

            widget.field = form.getFieldById('displayText1');
            fixture.detectChanges();

            expect(widget.field.value).toBe('John Doe');
        });

        it('should update display text when dependent field value changes', (done) => {
            const form = new FormModel({
                fields: [
                    { id: 'displayText1', type: 'display-text', value: 'Hello ${field.name}' },
                    { id: 'name', type: 'text', value: 'John' }
                ]
            });

            widget.field = form.getFieldById('displayText1');
            const nameField = form.getFieldById('name');
            fixture.detectChanges();

            expect(widget.field.value).toBe('Hello John');

            nameField.value = 'Jane';
            formService.formRulesEvent.next({ type: 'fieldValueChanged', field: nameField } as any);

            setTimeout(() => {
                expect(widget.field.value).toBe('Hello Jane');
                done();
            }, 350);
        });

        it('should handle non-string field values by stringifying them', () => {
            const form = new FormModel({
                fields: [
                    { id: 'displayText1', type: 'display-text', value: 'Count: ${field.count}' },
                    { id: 'count', type: 'number', value: 42 }
                ]
            });

            widget.field = form.getFieldById('displayText1');
            fixture.detectChanges();

            expect(widget.field.value).toBe('Count: 42');
        });

        it('should handle missing field references with empty string', () => {
            const form = new FormModel({
                fields: [{ id: 'displayText1', type: 'display-text', value: 'Hello ${field.nonExistent}' }]
            });

            widget.field = form.getFieldById('displayText1');
            fixture.detectChanges();

            expect(widget.field.value).toBe('Hello ');
        });

        it('should not resolve expressions when enableExpressionEvaluation is false', () => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [DisplayTextWidgetComponent],
                providers: [
                    FormService,
                    {
                        provide: ADF_DISPLAY_TEXT_SETTINGS,
                        useValue: { enableExpressionEvaluation: false }
                    }
                ]
            });

            fixture = TestBed.createComponent(DisplayTextWidgetComponent);
            widget = fixture.componentInstance;

            const form = new FormModel({
                fields: [
                    { id: 'displayText1', type: 'display-text', value: 'Hello ${field.name}' },
                    { id: 'name', type: 'text', value: 'John' }
                ]
            });

            widget.field = form.getFieldById('displayText1');
            fixture.detectChanges();

            expect(widget.field.value).toBe('Hello ${field.name}');
        });

        it('should preserve original value for re-evaluation', () => {
            const form = new FormModel({
                fields: [
                    { id: 'displayText1', type: 'display-text', value: 'Hello ${field.name}' },
                    { id: 'name', type: 'text', value: 'John' }
                ]
            });

            widget.field = form.getFieldById('displayText1');
            fixture.detectChanges();

            expect(widget.field.value).toBe('Hello John');
            expect(widget['originalFieldValue']).toBe('Hello ${field.name}');
        });

        it('should support observable settings', (done) => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [DisplayTextWidgetComponent],
                providers: [
                    FormService,
                    {
                        provide: ADF_DISPLAY_TEXT_SETTINGS,
                        useValue: of({ enableExpressionEvaluation: true })
                    }
                ]
            });

            fixture = TestBed.createComponent(DisplayTextWidgetComponent);
            widget = fixture.componentInstance;

            const form = new FormModel({
                fields: [
                    { id: 'displayText1', type: 'display-text', value: 'Hello ${field.name}' },
                    { id: 'name', type: 'text', value: 'John' }
                ]
            });

            widget.field = form.getFieldById('displayText1');
            fixture.detectChanges();

            setTimeout(() => {
                expect(widget.field.value).toBe('Hello John');
                done();
            }, 100);
        });
    });

    describe('typed value formatting', () => {
        describe('when flag is on', () => {
            beforeEach(() => {
                TestBed.resetTestingModule();
                TestBed.configureTestingModule({
                    imports: [DisplayTextWidgetComponent],
                    providers: [
                        FormService,
                        { provide: ADF_DISPLAY_TEXT_SETTINGS, useValue: { enableExpressionEvaluation: true } },
                        { provide: ADF_TYPED_VALUE_FORMATTING_ENABLED, useValue: true }
                    ]
                });
                fixture = TestBed.createComponent(DisplayTextWidgetComponent);
                widget = fixture.componentInstance;
            });

            it('should format a direct People value to full name', () => {
                widget.field = new FormFieldModel(new FormModel(), {
                    id: 'f1',
                    type: FormFieldTypes.PEOPLE,
                    value: [{ firstName: 'Alyssa', lastName: 'Adcock' }]
                });
                fixture.detectChanges();

                expect(widget.field.value).toBe('Alyssa Adcock');
            });

            it('should format a direct Group value to group name', () => {
                widget.field = new FormFieldModel(new FormModel(), {
                    id: 'f1',
                    type: FormFieldTypes.FUNCTIONAL_GROUP,
                    value: [{ id: 'g1', name: 'Engineering' }]
                });
                fixture.detectChanges();

                expect(widget.field.value).toBe('Engineering');
            });

            it('should not contain [object Object] for a complex value', () => {
                widget.field = new FormFieldModel(new FormModel(), {
                    id: 'f1',
                    type: FormFieldTypes.PEOPLE,
                    value: [{ firstName: 'Alice', lastName: 'Brown' }]
                });
                fixture.detectChanges();

                expect(String(widget.field.value)).not.toContain('[object Object]');
            });

            it('should resolve expression templates for People via FormExpressionService', () => {
                const form = new FormModel({
                    fields: [
                        { id: 'displayText1', type: 'display-text', value: 'Selected: ${field.peopleField}' },
                        { id: 'peopleField', type: FormFieldTypes.PEOPLE, value: [{ firstName: 'Alyssa', lastName: 'Adcock' }] }
                    ]
                });

                widget.field = form.getFieldById('displayText1');
                fixture.detectChanges();

                expect(widget.field.value).toBe('Selected: Alyssa Adcock');
            });

            it('should re-evaluate expression with formatted value when dependent People field changes', (done) => {
                const form = new FormModel({
                    fields: [
                        { id: 'displayText1', type: 'display-text', value: 'Selected: ${field.peopleField}' },
                        { id: 'peopleField', type: FormFieldTypes.PEOPLE, value: [{ firstName: 'Alyssa', lastName: 'Adcock' }] }
                    ]
                });
                formService = TestBed.inject(FormService);

                widget.field = form.getFieldById('displayText1');
                const peopleField = form.getFieldById('peopleField');
                fixture.detectChanges();

                expect(widget.field.value).toBe('Selected: Alyssa Adcock');

                peopleField.value = [{ firstName: 'Jane', lastName: 'Smith' }];
                formService.formRulesEvent.next({ type: 'fieldValueChanged', field: peopleField } as any);

                setTimeout(() => {
                    expect(widget.field.value).toBe('Selected: Jane Smith');
                    done();
                }, 350);
            });
        });

        describe('when flag is off', () => {
            it('should not format a complex field value (default behaviour preserved)', () => {
                TestBed.resetTestingModule();
                TestBed.configureTestingModule({
                    imports: [DisplayTextWidgetComponent],
                    providers: [FormService]
                });
                fixture = TestBed.createComponent(DisplayTextWidgetComponent);
                widget = fixture.componentInstance;

                const rawValue = [{ firstName: 'Alyssa', lastName: 'Adcock' }];
                widget.field = new FormFieldModel(new FormModel(), {
                    id: 'f1',
                    type: FormFieldTypes.PEOPLE,
                    value: rawValue
                });

                // Trigger only ngOnInit (no full render — raw array would crash TranslatePipe without the flag)
                widget.ngOnInit();

                expect(widget.field.value).toEqual(rawValue);
            });
        });
    });
});
