/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { UnitTestingUtils } from '../../../testing';
import { FormRenderingService } from '../../services/form-rendering.service';
import { CheckboxWidgetComponent, FormFieldModel, FormFieldTypes, FormModel, TextWidgetComponent } from '../widgets';
import { DateWidgetComponent } from '../widgets/date/date.widget';
import { DateTimeWidgetComponent } from '../widgets/date-time/date-time.widget';
import { FormService } from '../../services/form.service';
import { FormWriteContext } from '../../models/form-state.model';
import { FormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {
    let fixture: ComponentFixture<FormFieldComponent>;
    let component: FormFieldComponent;
    let form: FormModel;
    let testingUtils: UnitTestingUtils;

    let formRenderingService: FormRenderingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormFieldComponent]
        });
        fixture = TestBed.createComponent(FormFieldComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        formRenderingService = fixture.debugElement.injector.get(FormRenderingService);
        form = new FormModel();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should create default component instance', () => {
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;
        fixture.detectChanges();

        expect(component.componentRef).toBeDefined();
        expect(component.componentRef.instance instanceof TextWidgetComponent).toBeTruthy();
    });

    it('should call update form control state for reactive type widget on formRulesEvent change', () => {
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.DATE,
            id: 'FAKE-DATE-WIDGET'
        });

        component.field = field;
        fixture.detectChanges();

        const widgetInstance = component.componentRef.instance;
        const updateFormControlState = spyOn(widgetInstance, 'updateReactiveFormControl');
        const instanceFormValidation = spyOn(widgetInstance.field.form, 'validateForm');

        widgetInstance.formService.formRulesEvent.next();
        fixture.detectChanges();

        expect(updateFormControlState).toHaveBeenCalled();
        expect(instanceFormValidation).toHaveBeenCalled();
    });

    it('should create custom component instance', () => {
        formRenderingService.setComponentTypeResolver(FormFieldTypes.AMOUNT, () => CheckboxWidgetComponent, true);

        const field = new FormFieldModel(form, {
            type: FormFieldTypes.AMOUNT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;

        fixture.detectChanges();

        expect(component.componentRef).toBeDefined();
        expect(component.componentRef.instance instanceof CheckboxWidgetComponent).toBeTruthy();
    });

    it('should require component type to be resolved', () => {
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        spyOn(formRenderingService, 'resolveComponentType').and.returnValue(null);
        component.field = field;

        fixture.detectChanges();

        expect(formRenderingService.resolveComponentType).toHaveBeenCalled();
        expect(component.componentRef).toBeUndefined();
    });

    it('should hide the field when it is not visible', () => {
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;
        component.field.isVisible = false;

        fixture.detectChanges();

        const styles = testingUtils.getByCSS('#field-FAKE-TXT-WIDGET-container').styles;
        expect(styles.display).toEqual('none');
    });

    it('should show the field when it is visible', () => {
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;

        fixture.detectChanges();

        const styles = testingUtils.getByCSS('#field-FAKE-TXT-WIDGET-container').styles;
        expect(styles.display).toEqual('block');
    });

    it('should hide a visible element', () => {
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;
        fixture.detectChanges();

        let styles = testingUtils.getByCSS('#field-FAKE-TXT-WIDGET-container').styles;
        expect(styles.display).toEqual('block');

        component.field.isVisible = false;
        fixture.detectChanges();

        styles = testingUtils.getByCSS('#field-FAKE-TXT-WIDGET-container').styles;
        expect(styles.display).toEqual('none');
    });

    it('[C213878] - Should fields be correctly rendered when filled with process variables', () => {
        const field = new FormFieldModel(form, {
            fieldType: 'HyperlinkRepresentation',
            id: 'label2',
            name: 'Label2',
            type: 'hyperlink',
            value: null,
            required: false,
            readOnly: false,
            overrideId: false,
            colspan: 1,
            placeholder: null,
            minLength: 0,
            maxLength: 0,
            minValue: null,
            maxValue: null,
            regexPattern: null,
            optionType: null,
            hasEmptyValue: null,
            options: null,
            restUrl: null,
            restResponsePath: null,
            restIdProperty: null,
            restLabelProperty: null,
            tab: null,
            className: null,
            params: {
                existingColspan: 1,
                maxColspan: 2
            },
            dateDisplayFormat: null,
            layout: {
                row: -1,
                column: -1,
                colspan: 1
            },
            sizeX: 1,
            sizeY: 1,
            row: -1,
            col: -1,
            visibilityCondition: null,
            hyperlinkUrl: 'testtest',
            displayText: null
        });

        component.field = field;
        fixture.detectChanges();
        const hyperlink: HTMLLinkElement = testingUtils.getByCSS('#field-label2-container hyperlink-widget a').nativeElement;
        expect(hyperlink).not.toBeNull();
        expect(hyperlink.href).toBe('http://testtest/');
        expect(hyperlink.textContent).toBe('testtest');
    });

    describe('state commit projection', () => {
        let formService: FormService;

        beforeEach(() => {
            formService = TestBed.inject(FormService);
        });

        function mountField(type: string, existingForm?: FormModel) {
            const model =
                existingForm ??
                new FormModel(
                    {
                        id: 'same-definition',
                        fields: [
                            {
                                id: 'container',
                                type: 'container',
                                numberOfColumns: 1,
                                fields: { 1: [{ id: 'field', type, required: true, value: new Date(2024, 0, 15).getTime() }] }
                            }
                        ]
                    },
                    undefined,
                    false,
                    formService
                );
            const host = TestBed.createComponent(FormFieldComponent);
            const context: FormWriteContext = {
                form: model,
                renderer: host.componentInstance,
                generation: {},
                invocation: {},
                documentVersion: '1',
                outcomeId: 'clear',
                isCurrent: () => true
            };
            formService.formState.bind(model, context.renderer, context.generation);
            const field = model.getFieldById('field');
            host.componentRef.setInput('field', field);
            host.detectChanges();
            const widget = host.componentInstance.componentRef.instance as DateWidgetComponent | DateTimeWidgetComponent;
            const control = widget instanceof DateWidgetComponent ? widget.dateInputControl : widget.datetimeInputControl;
            const input = host.nativeElement.querySelector('input') as HTMLInputElement;
            return { form: model, host, context, widget, control, field, input };
        }

        for (const type of [FormFieldTypes.DATE, FormFieldTypes.DATETIME]) {
            it(`should project a silent ${type} commit only into its own mounted control and accept a later edit`, async () => {
                const a = mountField(type);
                const b = mountField(type);
                const bValue = b.field.value;
                const bInput = b.input.value;
                const edits = spyOn(formService.formFieldValueChanged, 'next').and.callThrough();
                const rules = spyOn(formService.formRulesEvent, 'next').and.callThrough();
                expect(formService.formState.commit(a.field, null, a.context)).toBeTrue();
                a.host.detectChanges();
                await a.host.whenStable();
                expect(a.control.value).toBeNull();
                expect(a.input.value).toBe('');
                expect(a.field.value).toBeNull();
                expect(a.form.values.field).toBeNull();
                expect(a.control.invalid).toBeTrue();
                expect(a.field.isValid).toBeFalse();
                expect(edits).not.toHaveBeenCalled();
                expect(rules).not.toHaveBeenCalled();
                expect(b.field.value).toBe(bValue);
                expect(b.control.value).toBe(bValue);
                expect(b.input.value).toBe(bInput);
                const authored = a.field.parseValue({ ...a.field.json, value: new Date(2024, 1, 20).getTime() });
                expect(authored instanceof Date).toBeTrue();
                expect(formService.formState.commit(a.field, authored, a.context)).toBeTrue();
                a.host.detectChanges();
                expect(a.control.value).toEqual(authored);
                expect(a.input.value).toContain('2024');
                expect(a.field.isValid).toBeTrue();
                expect(a.form.values.field).toBe(type === FormFieldTypes.DATE ? '2024-02-20T00:00:00.000Z' : authored.toISOString());
                expect(edits).not.toHaveBeenCalled();
                expect(rules).not.toHaveBeenCalled();
                const genuine = new Date(2025, 4, 12, 10, 30);
                a.control.setValue(genuine);
                a.host.detectChanges();
                expect(a.field.value).toBe(genuine);
                expect(a.form.values.field).toBe(type === FormFieldTypes.DATE ? '2025-05-12T00:00:00.000Z' : genuine.toISOString());
                expect(a.control.valid).toBeTrue();
                expect(edits).toHaveBeenCalled();
                expect(b.field.value).toBe(bValue);
            });

            it(`should ignore a stale ${type} mount when the same form is mounted again`, () => {
                const old = mountField(type);
                const current = mountField(type, old.form);
                const priorControl = old.control.value;
                const edits = spyOn(formService.formFieldValueChanged, 'next').and.callThrough();
                expect(formService.formState.commit(current.field, null, current.context)).toBeTrue();
                current.host.detectChanges();
                old.host.detectChanges();
                expect(current.control.value).toBeNull();
                expect(old.control.value).toBe(priorControl);
                old.control.setValue(new Date(2030, 1, 1));
                expect(current.field.value).toBeNull();
                expect(edits).not.toHaveBeenCalled();
                const rules = spyOn(formService.formRulesEvent, 'next').and.callThrough();
                old.input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                old.input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
                expect(rules).not.toHaveBeenCalled();
                formService.formRulesEvent.next(undefined);
                expect(old.control.value).not.toBeNull();
                old.host.destroy();
                const update = spyOn(current.widget, 'updateReactiveFormControl').and.callThrough();
                current.host.destroy();
                formService.formState.commit(current.field, new Date(2024, 1, 1), current.context);
                expect(update).not.toHaveBeenCalled();
            });
        }
    });
});
