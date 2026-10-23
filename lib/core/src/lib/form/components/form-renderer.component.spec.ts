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
import { UnitTestingUtils } from '../../testing';
import { ByPassFormRuleManager, FORM_RULES_MANAGER, FormInvocationResult, FormRulesManager } from '../models/form-rules.model';
import { FormInvocationRequest, FormResetResult, captureFormStateMount, hasFormStateBinding } from '../models/form-state.model';
import { NotificationService } from '../../notifications/services/notification.service';
import { FormRulesEvent } from '../events/form-rules.event';
import { FormRenderingService } from '../services/form-rendering.service';
import { FormService } from '../services/form.service';
import { ADF_MULTI_TAB_VALIDATION_INDICATORS_ENABLED, FormRendererComponent } from './form-renderer.component';
import {
    amountWidgetFormVisibilityMock,
    checkboxWidgetFormVisibilityMock,
    colspanAnyColumnsForm,
    colspanForm,
    customWidgetForm,
    customWidgetFormWithVisibility,
    dateWidgetFormVisibilityMock,
    displayBigDecimalWidgetMock,
    displayDynamicTableMock,
    displayTextWidgetFormVisibilityMock,
    formDateVisibility,
    formDisplayValueCombinedVisibility,
    formDisplayValueForm,
    formDisplayValueVisibility,
    formNumberTextJson,
    formNumberWidgetVisibility,
    formRequiredNumberWidget,
    mockSectionVisibilityForm,
    mockRepeatableSectionForm01,
    mockRepeatableSectionForm02,
    multilineWidgetFormVisibilityMock,
    numberMinMaxForm,
    numberNotRequiredForm,
    numberWidgetVisibilityForm,
    radioWidgetVisibilityForm,
    textWidgetVisibility
} from './mock/form-renderer.component.mock';
import { ErrorMessageModel, FormFieldModel, FormModel, TextWidgetComponent, WidgetComponent } from './widgets';
import { Component, inject, Injectable, OnInit, Provider } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { WidgetVisibilityService } from '../services/widget-visibility.service';
import { ENTER, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { repeatableSectionForm } from './mock/repeatable-section-form.mock';
import { FormEvent } from '../events/form.event';

@Component({
    selector: 'adf-test-reporting-date-widget',
    template: ''
})
class ReportingDateWidgetComponent extends WidgetComponent implements OnInit {
    ngOnInit(): void {
        this.field.validationSummary = new ErrorMessageModel({ message: 'CUSTOM.DATE_ERROR' });
        this.field.markAsInvalid();
    }

    updateReactiveFormControl(): void {
        this.field.validationSummary = new ErrorMessageModel({ message: 'CUSTOM.DATE_ERROR' });
    }
}

const typeIntoInput = (testingUtils: UnitTestingUtils, selector: string, message: string) => {
    testingUtils.fillInputByCSS(selector, message);
};

const expectElementToBeHidden = (testingUtils: UnitTestingUtils, fieldId: string): void => {
    const targetElement = testingUtils.getByCSS(`#field-${fieldId}-container`).nativeElement;
    expect(targetElement).toBeTruthy();
    expect(targetElement.style.display).toBe('none', `${targetElement.id} should be hidden but it is not`);
};

const expectElementToBeVisible = (testingUtils: UnitTestingUtils, fieldId: string, display: string = 'block'): void => {
    const targetElement = testingUtils.getByCSS(`#field-${fieldId}-container`).nativeElement;
    expect(targetElement).toBeTruthy();
    expect(targetElement.style.display).toBe(display, `${targetElement.id} should be visible but it is not`);
};

const expectInputElementValueIs = (testingUtils: UnitTestingUtils, selector: string, value: string): void => {
    const targetElement = testingUtils.getByCSS(selector).nativeElement;
    expect(targetElement).toBeTruthy();
    expect(targetElement.value).toBe(value, `invalid value for ${targetElement.name}`);
};

const expectElementToBeInvalid = (testingUtils: UnitTestingUtils, fieldId: string): void => {
    const invalidElementContainer = testingUtils.getByCSS(`#field-${fieldId}-container .adf-invalid`);
    expect(invalidElementContainer).toBeTruthy();
};

const expectElementToBeValid = (testingUtils: UnitTestingUtils, fieldId: string): void => {
    const invalidElementContainer = testingUtils.getByCSS(`#field-${fieldId}-container .adf-invalid`);
    expect(invalidElementContainer).toBeFalsy();
};

const buildTabbedForm = (tabCount: number, hiddenTabIndices: number[] = []): FormModel => {
    const tabs = Array.from({ length: tabCount }, (_, i) => ({
        id: `tab-${i}`,
        title: `Tab ${i}`
    }));
    const fields = tabs.map((tab) => ({
        id: `container-${tab.id}`,
        type: 'container',
        tab: tab.id,
        numberOfColumns: 1,
        fields: { 1: [{ id: `text-${tab.id}`, type: 'text', name: `Text in ${tab.title}` }] }
    }));

    const form = new FormModel({ tabs, fields });

    hiddenTabIndices.forEach((tabIndex) => {
        if (form.tabs[tabIndex]) {
            form.tabs[tabIndex].isVisible = false;
        }
    });

    return form;
};

describe('Form Renderer Component', () => {
    let formRendererComponent: FormRendererComponent<any>;
    let fixture: ComponentFixture<FormRendererComponent<any>>;
    let formService: FormService;
    let formRenderingService: FormRenderingService;
    let rulesManager: FormRulesManager<any>;
    let testingUtils: UnitTestingUtils;
    let dialog: MatDialog;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormRendererComponent]
        });
        fixture = TestBed.createComponent(FormRendererComponent);
        formRendererComponent = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        formService = TestBed.inject(FormService);
        dialog = TestBed.inject(MatDialog);
        formRenderingService = TestBed.inject(FormRenderingService);
        rulesManager = fixture.debugElement.injector.get(FormRulesManager);
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('visibility refresh on form rules', () => {
        const buildFormWithRequiredField = (startVisible: boolean = true): FormModel => {
            const form = new FormModel(
                {
                    id: 'required-field-form',
                    fields: [
                        {
                            id: 'container',
                            type: 'container',
                            numberOfColumns: 1,
                            fields: { 1: [{ id: 'requiredText', type: 'text', name: 'Required text', required: true }] }
                        }
                    ]
                },
                undefined,
                false,
                formService
            );

            if (!startVisible) {
                form.changeFieldVisibility('requiredText', false);
                form.validateForm();
            }

            return form;
        };

        const hideFieldOnFieldValueChanged = (form: FormModel, fieldId: string, visible: boolean): void => {
            formService.formRulesEvent
                .pipe(filter((event) => event?.type === 'fieldValueChanged' && event.form?.id === form.id))
                .subscribe(() => form.changeFieldVisibility(fieldId, visible));
        };

        it('should refresh visibility when a fieldValueChanged rule event fires for the same form', () => {
            const form = formService.parseForm(textWidgetVisibility.formRepresentation);
            formRendererComponent.formDefinition = form;
            fixture.detectChanges();

            const visibilityService = TestBed.inject(WidgetVisibilityService);
            const refreshVisibilitySpy = spyOn(visibilityService, 'refreshVisibility');

            formService.formRulesEvent.next({ type: 'fieldValueChanged', form } as any);

            expect(refreshVisibilitySpy).toHaveBeenCalledOnceWith(form);
        });

        it('should not refresh visibility when a fieldValueChanged rule event fires for a different form', () => {
            const form = formService.parseForm(textWidgetVisibility.formRepresentation);
            const otherForm = formService.parseForm(formDateVisibility.formRepresentation);
            formRendererComponent.formDefinition = form;
            fixture.detectChanges();

            const visibilityService = TestBed.inject(WidgetVisibilityService);
            const refreshVisibilitySpy = spyOn(visibilityService, 'refreshVisibility');

            formService.formRulesEvent.next({ type: 'fieldValueChanged', form: otherForm } as any);

            expect(refreshVisibilitySpy).not.toHaveBeenCalled();
        });

        it('should not refresh visibility for non-fieldValueChanged rule events', () => {
            const form = formService.parseForm(textWidgetVisibility.formRepresentation);
            formRendererComponent.formDefinition = form;
            fixture.detectChanges();

            const visibilityService = TestBed.inject(WidgetVisibilityService);
            const refreshVisibilitySpy = spyOn(visibilityService, 'refreshVisibility');

            formService.formRulesEvent.next({ type: 'formLoaded', form } as any);

            expect(refreshVisibilitySpy).not.toHaveBeenCalled();
        });

        it('should revalidate the form when a rule hides an empty required field', () => {
            const form = buildFormWithRequiredField();
            formRendererComponent.formDefinition = form;
            hideFieldOnFieldValueChanged(form, 'requiredText', false);
            fixture.detectChanges();

            expect(form.isValid).toBe(false, 'form should start invalid with a visible empty required field');

            formService.formRulesEvent.next({ type: 'fieldValueChanged', form } as any);

            expect(form.isValid).toBe(true, 'hiding the required field should re-enable the outcome');
        });

        it('should revalidate the form when a rule reveals an empty required field', () => {
            const form = buildFormWithRequiredField(false);
            formRendererComponent.formDefinition = form;
            hideFieldOnFieldValueChanged(form, 'requiredText', true);
            fixture.detectChanges();

            expect(form.isValid).toBe(true, 'form should start valid while the required field is hidden');

            formService.formRulesEvent.next({ type: 'fieldValueChanged', form } as any);

            expect(form.isValid).toBe(false, 'revealing the empty required field should disable the outcome');
        });

        it('should revalidate the form when a rule hides a group containing an empty required field', () => {
            const form = new FormModel(
                {
                    id: 'required-group-form',
                    fields: [
                        {
                            id: 'requiredGroup',
                            type: 'group',
                            params: {},
                            numberOfColumns: 1,
                            fields: { 1: [{ id: 'textInGroup', type: 'text', name: 'Text', required: true }] }
                        }
                    ]
                },
                undefined,
                false,
                formService
            );
            form.enableParentVisibilityCheck = true;
            form.getFormFields().forEach((field) => (field.checkParentVisibilityForValidation = true));
            form.validateForm();

            formRendererComponent.formDefinition = form;
            hideFieldOnFieldValueChanged(form, 'requiredGroup', false);
            fixture.detectChanges();

            expect(form.isValid).toBe(false, 'form should start invalid while the group is visible');

            formService.formRulesEvent.next({ type: 'fieldValueChanged', form } as any);

            expect(form.isValid).toBe(true, 'hiding the group should exempt its required child');
        });

        it('should revalidate the form for rule events other than fieldValueChanged', () => {
            const form = buildFormWithRequiredField();
            formRendererComponent.formDefinition = form;
            formService.formRulesEvent
                .pipe(filter((event) => event?.type === 'onRowCountChanged' && event.form?.id === form.id))
                .subscribe(() => form.changeFieldVisibility('requiredText', false));
            fixture.detectChanges();

            expect(form.isValid).toBe(false, 'form should start invalid with a visible empty required field');

            formService.formRulesEvent.next({ type: 'onRowCountChanged', form } as any);

            expect(form.isValid).toBe(true, 'row-count driven rules should also recompute validity');
        });
    });

    describe('Display Date Widget ', () => {
        it('Should be able to see a widget when the visibility condition refers to another fields with specific date', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDateVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeHidden(testingUtils, 'Text0pqd1u');
            testingUtils.fillInputByCSS('#Date0hwq20', '2019-11-19');

            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Text0pqd1u');
        });

        it('Should not be able to see a widget when the visibility condition refers to another fields with specific date', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDateVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Text0uyqd3');

            testingUtils.fillInputByCSS('#Date0hwq20', '2019-11-19');

            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeHidden(testingUtils, 'Text0uyqd3');
        });

        it('[C310336] - Should be able to set visibility conditions for Date widget', async () => {
            formRendererComponent.formDefinition = formService.parseForm(dateWidgetFormVisibilityMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Text5asd0a');
            expectElementToBeHidden(testingUtils, 'Date8wbe3d');

            typeIntoInput(testingUtils, '#Text5asd0a', 'Date');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Date8wbe3d');
        });
    });

    describe('Display Value Widget', () => {
        it('[C309862] - Should be able to see Display value widget when visibility condition refers to another field with specific value', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDisplayValueVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeHidden(testingUtils, 'Displayvalue0g6092');
            typeIntoInput(testingUtils, '#Text0bq3ar', 'DisplayValue');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Displayvalue0g6092');
            expectInputElementValueIs(testingUtils, '#Displayvalue0g6092', 'No field selected');
        });

        it('[C309863] - Should be able to see Display value widget when visibility condition refers to a form variable and a field', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDisplayValueForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'DisplayValueOne');

            typeIntoInput(testingUtils, '#Text0howrc', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'DisplayValueOne');
            expectInputElementValueIs(testingUtils, '#DisplayValueOne', 'No field selected');

            typeIntoInput(testingUtils, '#Text0howrc', 'aaab');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'DisplayValueOne');
        });

        it('[C309864] - Should be able to see Display value widget when visibility condition refers to another field and form variable', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDisplayValueForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'DisplayValueVariableField');

            typeIntoInput(testingUtils, '#TextOne', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'DisplayValueVariableField');
            expectInputElementValueIs(testingUtils, '#DisplayValueVariableField', 'No field selected');

            typeIntoInput(testingUtils, '#TextOne', 'aaab');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'DisplayValueVariableField');
        });

        it('[C309865] - Should be able to see Display value widget when has multiple visibility conditions and next condition operators', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDisplayValueCombinedVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'Text0bq3ar');
            expectElementToBeVisible(testingUtils, 'TextTwo');
            expectElementToBeHidden(testingUtils, 'Displayvalue0g6092');

            typeIntoInput(testingUtils, '#Text0bq3ar', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            typeIntoInput(testingUtils, '#Text0bq3ar', 'aaa');
            expectInputElementValueIs(testingUtils, '#TextTwo', '');
            expectElementToBeVisible(testingUtils, 'Displayvalue0g6092');

            typeIntoInput(testingUtils, '#Text0bq3ar', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            typeIntoInput(testingUtils, '#Text0bq3ar', 'bbb');
            expectInputElementValueIs(testingUtils, '#TextTwo', '');
            expectElementToBeHidden(testingUtils, 'Displayvalue0g6092');

            typeIntoInput(testingUtils, '#TextTwo', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            typeIntoInput(testingUtils, '#Text0bq3ar', 'bbb');
            expectInputElementValueIs(testingUtils, '#TextTwo', 'aaa');
            expectElementToBeHidden(testingUtils, 'Displayvalue0g6092');

            typeIntoInput(testingUtils, '#Text0bq3ar', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            typeIntoInput(testingUtils, '#Text0bq3ar', 'aaa');
            expectInputElementValueIs(testingUtils, '#TextTwo', 'aaa');
            expectElementToBeHidden(testingUtils, 'Displayvalue0g6092');

            typeIntoInput(testingUtils, '#TextTwo', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            typeIntoInput(testingUtils, '#Text0bq3ar', 'aaa');
            expectInputElementValueIs(testingUtils, '#TextTwo', 'bbb');
            expectElementToBeVisible(testingUtils, 'Displayvalue0g6092');
        });

        it('should render display value of dynamic-table widget', () => {
            formRendererComponent.formDefinition = formService.parseForm(displayDynamicTableMock);
            fixture.detectChanges();

            expectElementToBeVisible(testingUtils, 'dynamic-table-id');
        });
    });

    describe('Number widget', () => {
        it('[C315169] - Should be able to complete a task with a form with number widgets', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberWidgetVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Number1');
            expectElementToBeHidden(testingUtils, 'Number2');
            expect(formRendererComponent.formDefinition.isValid).toBe(true, 'Form should be valid by default');

            typeIntoInput(testingUtils, '#Number1', '5');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Number1');
            expectElementToBeVisible(testingUtils, 'Number2');
            expect(formRendererComponent.formDefinition.isValid).toBe(true, 'Form should be valid with a valid value');

            typeIntoInput(testingUtils, '#Number1', 'az');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Number1');
            expectElementToBeHidden(testingUtils, 'Number2');
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should be invalid with an invalid value');
        });

        it('[C309663] - Should be able to see Number widget when visibility condition refers to another field with specific value', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberTextJson.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Text');
            expectElementToBeHidden(testingUtils, 'NumberFieldValue');

            typeIntoInput(testingUtils, '#Text', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'NumberFieldValue');

            typeIntoInput(testingUtils, '#Text', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'NumberFieldValue');
        });

        it('[C315170] - Should be able to complete a task with a form with required number widgets', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formRequiredNumberWidget.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeHidden(testingUtils, 'Number2');
            expectElementToBeVisible(testingUtils, 'Number1');

            typeIntoInput(testingUtils, '#Number1', '5');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'Number2');

            typeIntoInput(testingUtils, '#Number1', '123');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'Number2');
            const errorText = testingUtils.getByCSS('#field-Number1-container .adf-error-text').nativeElement;
            expect(errorText.textContent).toContain(`FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without mandatory field');
        });

        it('[C309653] - Should disable the save button when Number widget is required', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberTextJson.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'NumberReq');
            expectElementToBeVisible(testingUtils, 'NumberNotReq');
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should be invalid with an empty required value');

            typeIntoInput(testingUtils, '#NumberNotReq', '5');
            fixture.detectChanges();
            await fixture.whenStable();
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should be invalid with an empty required value');

            typeIntoInput(testingUtils, '#NumberReq', '5');
            typeIntoInput(testingUtils, '#NumberNotReq', '');
            fixture.detectChanges();
            await fixture.whenStable();
            expect(formRendererComponent.formDefinition.isValid).toBe(true, 'Form should be valid when required field are filled');
        });

        it('[C309654] - Should display Number widget spans on 2 columns when colspan is set to 2 and grid view is active', async () => {
            formRendererComponent.formDefinition = formService.parseForm(colspanForm.formRepresentation.formDefinition, null, false, true);
            fixture.detectChanges();
            await fixture.whenStable();

            const numbersContainerGridElement = testingUtils.getByCSS(
                `#field-2bc275fb-e113-4d7d-885f-6e74a7332d40-container div.adf-grid-list`
            ).nativeElement;
            expect(numbersContainerGridElement).toBeTruthy();
            expect(numbersContainerGridElement.style.display).not.toBe('hidden');

            const sectionGridElement: HTMLElement[] = testingUtils
                .getAllByCSS('#field-2bc275fb-e113-4d7d-885f-6e74a7332d40-container div .adf-grid-list-item')
                .map((element) => element.nativeElement);
            sectionGridElement.forEach((element) => {
                expect(element.style['grid-area']).toBe('auto / auto / span 1 / span 1', 'Elemens is wrong sized for this section');
            });

            const fullWidthElement = testingUtils.getByCSS(
                '#field-d52ada4e-cbdc-4f0c-a480-5b85fa00e4f8-container div.adf-grid-list .adf-grid-list-item'
            ).nativeElement;
            expect(fullWidthElement.style['grid-area']).toBe('auto / auto / span 1 / span 2');
        });

        it('[C309654] - Should display Number widget spans on 2 columns when colspan is set to 2 and grid view is not active', async () => {
            formRendererComponent.formDefinition = formService.parseForm(colspanForm.formRepresentation.formDefinition, null, false, false);
            fixture.detectChanges();
            await fixture.whenStable();

            const numbersContainerElement = testingUtils.getByCSS(
                `#field-2bc275fb-e113-4d7d-885f-6e74a7332d40-container section.adf-grid-list-column-view`
            ).nativeElement;
            expect(numbersContainerElement).toBeTruthy();
            expect(numbersContainerElement.style.display).not.toBe('hidden');

            const sectionGridElement = testingUtils
                .getAllByCSS('#field-2bc275fb-e113-4d-7d-885f-6e74a7332d40-container section .adf-grid-list-single-column')
                .map((element) => element.nativeElement);
            sectionGridElement.forEach((element) => {
                expect(element.style['width']).toBe('50%', 'Elemens is wrong sized for this section');
            });
            const fullWidthElement = testingUtils.getByCSS(
                '#field-d52ada4e-cbdc-4f0c-a480-5b85fa00e4f8-container section.adf-grid-list-column-view .adf-grid-list-single-column'
            ).nativeElement;
            expect(fullWidthElement.style['width']).toBe('100%');
        });

        it('Should display widths 25% and 75% in non-grid mode for 4-column container with colspan 1 and 3', async () => {
            formRendererComponent.formDefinition = formService.parseForm(colspanAnyColumnsForm.formRepresentation.formDefinition, null, false, false);
            fixture.detectChanges();
            await fixture.whenStable();

            const columns = testingUtils
                .getAllByCSS('#field-4col-container-id-container section.adf-grid-list-column-view .adf-grid-list-single-column')
                .map((element) => element.nativeElement as HTMLElement);

            expect(columns.length).toBe(4);
            expect(columns[0].style['width']).toBe('25%');
            expect(columns[1].style['width']).toBe('75%');
            expect(columns[2].style['width']).toBe('0%');
            expect(columns[3].style['width']).toBe('0%');
        });

        it('Should display widths 33.333% and 66.666% in non-grid mode for 12-column container with colspan 4 and 8', async () => {
            formRendererComponent.formDefinition = formService.parseForm(colspanAnyColumnsForm.formRepresentation.formDefinition, null, false, false);
            fixture.detectChanges();
            await fixture.whenStable();

            const columns = testingUtils
                .getAllByCSS('#field-12col-container-id-container section.adf-grid-list-column-view .adf-grid-list-single-column')
                .map((element) => element.nativeElement as HTMLElement);

            expect(columns.length).toBe(12);
            expect(parseFloat(columns[0].style['width'])).toBeCloseTo(33.33, 2);
            expect(columns[1].style['width']).toBe('0%');
            expect(columns[2].style['width']).toBe('0%');
            expect(columns[3].style['width']).toBe('0%');
            expect(parseFloat(columns[4].style['width'])).toBeCloseTo(66.67, 2);
            expect(columns[5].style['width']).toBe('0%');
            expect(columns[6].style['width']).toBe('0%');
            expect(columns[7].style['width']).toBe('0%');
            expect(columns[8].style['width']).toBe('0%');
            expect(columns[9].style['width']).toBe('0%');
            expect(columns[10].style['width']).toBe('0%');
            expect(columns[11].style['width']).toBe('0%');
        });

        it('Should preserve width for an intentionally empty leading spacer column in non-grid mode', async () => {
            formRendererComponent.formDefinition = formService.parseForm(
                amountWidgetFormVisibilityMock.formRepresentation.formDefinition,
                null,
                false,
                false
            );
            fixture.detectChanges();
            await fixture.whenStable();

            const columns = testingUtils
                .getAllByCSS('#field-ce32844c-20b2-4361-88b5-a56f28219aef-container section.adf-grid-list-column-view .adf-grid-list-single-column')
                .map((element) => element.nativeElement as HTMLElement);

            expect(columns.length).toBe(2);
            expect(columns[0].style['width']).toBe('50%');
            expect(columns[1].style['width']).toBe('50%');
        });

        it('[C309872] - Should display Text widget spans on 2 columns when colspan is set to 2', () => {
            formRendererComponent.formDefinition = formService.parseForm(colspanForm.formRepresentation.formDefinition, null, false, false);
            fixture.detectChanges();

            const twoSpanTextWidgetContainerId = '#field-1ff21afc-7df4-4607-8363-1dc8576e1c8e-container';
            const oneSpanTextWidgetContainerId = '#field-f4285ad-g123-1a73-521d-7nm4a7231aul0-container';

            const oneSpanTextWidgetElement = testingUtils.getByCSS(`${oneSpanTextWidgetContainerId} section.adf-grid-list-column-view`).nativeElement;
            expect(oneSpanTextWidgetElement).toBeTruthy();
            expect(oneSpanTextWidgetElement.style.display).not.toBe('hidden');

            const sectionGridElement = testingUtils
                .getAllByCSS(`${oneSpanTextWidgetContainerId} section .adf-grid-list-single-column`)
                .map((element) => element.nativeElement);
            sectionGridElement.forEach((element) => {
                expect(element.style['width']).toBe('50%');
            });
            const fullWidthElement = testingUtils.getByCSS(
                `${twoSpanTextWidgetContainerId} section.adf-grid-list-column-view .adf-grid-list-single-column`
            ).nativeElement;
            expect(fullWidthElement.style['width']).toBe('100%');
        });

        it('[C309655] - Should display validation error message when Number widget has invalid value', async () => {
            formRendererComponent.formDefinition = formService.parseForm(numberNotRequiredForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Number0x8cbv');
            expectElementToBeValid(testingUtils, 'Number0x8cbv');

            testingUtils.blurByCSS('#Number0x8cbv');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeInvalid(testingUtils, 'Number0x8cbv');

            typeIntoInput(testingUtils, '#Number0x8cbv', '5');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeValid(testingUtils, 'Number0x8cbv');

            typeIntoInput(testingUtils, '#Number0x8cbv', 'a');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeInvalid(testingUtils, 'Number0x8cbv');
            let errorText = testingUtils.getByCSS('#field-Number0x8cbv-container .adf-error-text').nativeElement;
            expect(errorText.textContent).toContain(`FORM.FIELD.VALIDATOR.INVALID_NUMBER`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without mandatory field');

            typeIntoInput(testingUtils, '#Number0x8cbv', '?');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeInvalid(testingUtils, 'Number0x8cbv');
            errorText = testingUtils.getByCSS('#field-Number0x8cbv-container .adf-error-text').nativeElement;
            expect(errorText.textContent).toContain(`FORM.FIELD.VALIDATOR.INVALID_NUMBER`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without mandatory field');

            typeIntoInput(testingUtils, '#Number0x8cbv', '-5');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeValid(testingUtils, 'Number0x8cbv');
        });

        it('[C309660] - Should display validation error message when Number widget value is not respecting min max interval', async () => {
            formRendererComponent.formDefinition = formService.parseForm(numberMinMaxForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'Number0him2z');
            expectElementToBeValid(testingUtils, 'Number0him2z');

            testingUtils.blurByCSS('#Number0him2z');
            typeIntoInput(testingUtils, '#Number0him2z', '9');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeInvalid(testingUtils, 'Number0him2z');
            let errorText = testingUtils.getByCSS('#field-Number0him2z-container .adf-error-text').nativeElement;
            expect(errorText.textContent).toContain(`FORM.FIELD.VALIDATOR.NOT_LESS_THAN`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without valid field');

            typeIntoInput(testingUtils, '#Number0him2z', '10');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeValid(testingUtils, 'Number0him2z');

            typeIntoInput(testingUtils, '#Number0him2z', '60');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeValid(testingUtils, 'Number0him2z');

            typeIntoInput(testingUtils, '#Number0him2z', '61');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeInvalid(testingUtils, 'Number0him2z');
            errorText = testingUtils.getByCSS('#field-Number0him2z-container .adf-error-text').nativeElement;
            expect(errorText.textContent).toContain(`FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without valid field');
        });

        it('[C309664] - Should be able to see Number widget when visibility condition refers to a form variable and a field', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberTextJson.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            const inputText = testingUtils.getByCSS('#Text').nativeElement;
            expect(inputText).not.toBeNull();
            expectElementToBeHidden(testingUtils, 'NumberFieldValue');

            typeIntoInput(testingUtils, '#Text', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'NumberFieldValue');

            typeIntoInput(testingUtils, '#Text', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'NumberFieldValue');
        });

        it('[C309665] - Should be able to see Number widget when visibility condition refers to another field and form variable', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberTextJson.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            const inputText = testingUtils.getByCSS('#Text').nativeElement;
            expect(inputText).not.toBeNull();
            expectElementToBeHidden(testingUtils, 'NumberFieldVariable');

            typeIntoInput(testingUtils, '#Text', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'NumberFieldVariable');

            typeIntoInput(testingUtils, '#Text', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'NumberFieldVariable');
        });

        it('[C309666] - Should be able to see Number widget when has multiple visibility conditions and next condition operators', async () => {
            formRendererComponent.formDefinition = formService.parseForm(numberWidgetVisibilityForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'Number0wxaur');

            typeIntoInput(testingUtils, '#Text0hs0gt', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'Number0wxaur');

            typeIntoInput(testingUtils, '#Text0hs0gt', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'Number0wxaur');

            typeIntoInput(testingUtils, '#Text0cuqet', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'Number0wxaur');
            expectInputElementValueIs(testingUtils, '#Text0hs0gt', 'bbb');

            typeIntoInput(testingUtils, '#Text0hs0gt', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            expectInputElementValueIs(testingUtils, '#Text0hs0gt', 'aaa');
            expectInputElementValueIs(testingUtils, '#Text0cuqet', 'aaa');
            expectElementToBeHidden(testingUtils, 'Number0wxaur');
        });
    });

    describe('Text widget', () => {
        it('[C309669] - Should be able to set visibility conditions for Text widget', async () => {
            formRendererComponent.formDefinition = formService.parseForm(textWidgetVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'textOne');
            expectElementToBeHidden(testingUtils, 'textThree');
            expectElementToBeHidden(testingUtils, 'textTwo');
            expectElementToBeVisible(testingUtils, 'textFour');

            typeIntoInput(testingUtils, '#textOne', 'Test');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'textOne');
            expectElementToBeVisible(testingUtils, 'textTwo');
            expectElementToBeVisible(testingUtils, 'textThree');
            expectElementToBeHidden(testingUtils, 'textFour');

            typeIntoInput(testingUtils, '#textTwo', 'Test');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'textOne');
            expectElementToBeVisible(testingUtils, 'textTwo');
            expectElementToBeVisible(testingUtils, 'textFour');
            expectElementToBeHidden(testingUtils, 'textThree');
        });
    });

    describe('Radio widget', () => {
        it('[C310352] - Should be able to set visibility conditions for Radio Button widget', async () => {
            formRendererComponent.formDefinition = formService.parseForm(radioWidgetVisibilityForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'Text0cee7g');
            expectElementToBeHidden(testingUtils, 'Radiobuttons03rkbo');

            typeIntoInput(testingUtils, '#Text0cee7g', 'Radio');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'Radiobuttons03rkbo');
        });
    });

    describe('Custom Widget', () => {
        it('Should be able to correctly display a custom process cloud widget', async () => {
            formRenderingService.register({ banana: () => TextWidgetComponent }, true);
            formRendererComponent.formDefinition = formService.parseForm(customWidgetForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'Text0vdi18');
            expectElementToBeVisible(testingUtils, 'banana0k8gui');
        });

        it('Should be able to correctly use visibility in a custom process cloud widget ', async () => {
            formRenderingService.register({ banana: () => TextWidgetComponent }, true);
            formRendererComponent.formDefinition = formService.parseForm(customWidgetFormWithVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'banana0k8gui');
            typeIntoInput(testingUtils, '#Text0vdi18', 'no');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'banana0k8gui');
        });
    });

    describe('Form rules', () => {
        it('should call the Form Rules Manager init', () => {
            spyOn(rulesManager, 'initialize');
            const formModel = formService.parseForm(customWidgetFormWithVisibility.formRepresentation.formDefinition);

            formRendererComponent.formDefinition = formModel;
            formRendererComponent.ngOnInit();

            expect(rulesManager.initialize).toHaveBeenCalledWith(formModel);
        });

        it('should NOT call the Form Rules Manager init when the form is read only', () => {
            spyOn(rulesManager, 'initialize');
            const formModel = formService.parseForm(customWidgetFormWithVisibility.formRepresentation.formDefinition);

            formRendererComponent.formDefinition = formModel;
            formRendererComponent.readOnly = true;
            formRendererComponent.ngOnInit();

            expect(rulesManager.initialize).not.toHaveBeenCalled();
        });

        it('should call the Form Rules Manager destroy on component destruction', () => {
            spyOn(rulesManager, 'destroy');

            formRendererComponent.ngOnDestroy();

            expect(rulesManager.destroy).toHaveBeenCalled();
        });
    });

    describe('Amount widget', () => {
        it('[C309694] - Should be possible to set the visibility conditions with Form fields for Amount Widget', async () => {
            formRendererComponent.formDefinition = formService.parseForm(amountWidgetFormVisibilityMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Text0id3ic');
            expectElementToBeVisible(testingUtils, 'Number0yggl7');
            expectElementToBeHidden(testingUtils, 'Amount0kceqc');

            typeIntoInput(testingUtils, '#Text0id3ic', 'text1');
            typeIntoInput(testingUtils, '#Number0yggl7', '77');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'Amount0kceqc');
        });
    });

    describe('Checkbox widget', () => {
        it('[C315208] - Should be possible to set the visibility conditions with Form fields for Checkbox Widget', async () => {
            formRendererComponent.formDefinition = formService.parseForm(checkboxWidgetFormVisibilityMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Checkbox0pr51m');
            expectElementToBeVisible(testingUtils, 'Checkbox0fp0zf');
            expectElementToBeHidden(testingUtils, 'Checkbox0lb7ze');

            testingUtils.clickByCSS('#Checkbox0pr51m-input');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'Checkbox0lb7ze');

            testingUtils.clickByCSS('#Checkbox0fp0zf-input');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'Checkbox0lb7ze');
        });
    });

    describe('Multiline widget', () => {
        it('[C309670] - Should be able to set the Visibility Conditions of the Multiline Text Widget', async () => {
            formRendererComponent.formDefinition = formService.parseForm(multilineWidgetFormVisibilityMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Text');
            expectElementToBeVisible(testingUtils, 'MultilineTextId');

            typeIntoInput(testingUtils, '#Text', 'textwrong');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'MultilineTextId');

            typeIntoInput(testingUtils, '#Text', 'text');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'MultilineTextId');
        });
    });

    describe('Display Text (readonly) widget', () => {
        it('[C309868] - Should be able to see Display text widget when visibility condition refers to another field with specific value', async () => {
            formRendererComponent.formDefinition = formService.parseForm(displayTextWidgetFormVisibilityMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Text0tzu53');
            expectElementToBeHidden(testingUtils, 'Displaytext0q4w02');

            typeIntoInput(testingUtils, '#Text0tzu53', 'aaa-value');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'Displaytext0q4w02');

            typeIntoInput(testingUtils, '#Text0tzu53', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'Displaytext0q4w02');
        });

        it('[C309870] - Should be able to see Display text widget when visibility condition refers to another field and form variable', async () => {
            formRendererComponent.formDefinition = formService.parseForm(displayTextWidgetFormVisibilityMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(testingUtils, 'Text0tzu53');
            expectElementToBeHidden(testingUtils, 'Displaytext8bac2e');

            typeIntoInput(testingUtils, '#Text0tzu53', 'aaa-variable');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'Displaytext8bac2e');

            typeIntoInput(testingUtils, '#Text0tzu53', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'Displaytext8bac2e');
        });
    });

    describe('Display Bigdecimal Widget', () => {
        it('should round decimal field value to correct precision', async () => {
            formRendererComponent.formDefinition = formService.parseForm(displayBigDecimalWidgetMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            const decimalInputElement = testingUtils.getByCSS('#Decimal0tzu53').nativeElement;
            expect(decimalInputElement.value).toBeTruthy('10.12');
        });
    });

    describe('Section', () => {
        it('should be able to set visibility conditions for Section with fields', () => {
            const formDefinition = new FormModel(mockSectionVisibilityForm);
            const sectionIdSelector = '48e6bfed-b477-4641-86cb-bfa70229a31e';
            const mockTextDisplaySectionId = 'Text0n9o62';
            const mockTestDisplaySectionFieldId = 'Text0nu6os';
            const mockSectionFieldId = 'Text0t23xu';

            fixture.componentRef.setInput('formDefinition', formDefinition);
            fixture.detectChanges();

            expectElementToBeVisible(testingUtils, mockTestDisplaySectionFieldId);
            expectElementToBeVisible(testingUtils, mockTextDisplaySectionId);

            expectElementToBeHidden(testingUtils, sectionIdSelector);
            expectElementToBeHidden(testingUtils, mockSectionFieldId);

            typeIntoInput(testingUtils, `#${mockTextDisplaySectionId}`, 'section');
            fixture.detectChanges();

            expectElementToBeVisible(testingUtils, sectionIdSelector, 'flex');

            typeIntoInput(testingUtils, `#${mockTestDisplaySectionFieldId}`, 'section text');
            fixture.detectChanges();

            expectElementToBeVisible(testingUtils, mockSectionFieldId);
        });
    });

    describe('Tab navigation', () => {
        describe('visibleTabs', () => {
            it('should return only tabs where isVisible is true', () => {
                formRendererComponent.formDefinition = buildTabbedForm(3, [1]);
                expect(formRendererComponent.visibleTabs().length).toBe(2);
                expect(formRendererComponent.visibleTabs().every((t) => t.isVisible)).toBeTrue();
            });

            it('should return all tabs when none are hidden', () => {
                formRendererComponent.formDefinition = buildTabbedForm(3);
                expect(formRendererComponent.visibleTabs().length).toBe(3);
            });

            it('should return empty array when all tabs are hidden', () => {
                formRendererComponent.formDefinition = buildTabbedForm(3, [0, 1, 2]);
                expect(formRendererComponent.visibleTabs().length).toBe(0);
            });
        });

        describe('canNavigateNext and canNavigatePrevious', () => {
            beforeEach(() => {
                fixture.componentRef.setInput('formDefinition', buildTabbedForm(3));
                fixture.detectChanges();
            });

            it('should not allow navigating previous on the first tab', () => {
                expect(formRendererComponent.canNavigatePrevious).toBeFalse();
                expect(formRendererComponent.canNavigateNext).toBeTrue();
            });

            it('should allow navigating previous and next between the first and last tabs', async () => {
                formRendererComponent.navigateToNextTab();
                fixture.detectChanges();
                await fixture.whenStable();

                expect(formRendererComponent.canNavigatePrevious).toBeTrue();
                expect(formRendererComponent.canNavigateNext).toBeTrue();
            });

            it('should not allow navigating next on the last tab', async () => {
                formRendererComponent.navigateToNextTab();
                fixture.detectChanges();
                await fixture.whenStable();
                formRendererComponent.tabGroup.selectedIndexChange.emit(1);
                fixture.detectChanges();

                formRendererComponent.navigateToNextTab();
                fixture.detectChanges();
                await fixture.whenStable();
                formRendererComponent.tabGroup.selectedIndexChange.emit(2);
                fixture.detectChanges();

                expect(formRendererComponent.canNavigatePrevious).toBeTrue();
                expect(formRendererComponent.canNavigateNext).toBeFalse();
            });
        });

        describe('navigateToNextTab and navigateToPreviousTab', () => {
            beforeEach(() => {
                fixture.componentRef.setInput('formDefinition', buildTabbedForm(3));
                fixture.detectChanges();
                expect(formRendererComponent.tabGroup).toBeDefined();
            });

            it('should increment selectedIndex when navigating to next tab', async () => {
                const initialIndex = formRendererComponent.tabGroup.selectedIndex;
                formRendererComponent.navigateToNextTab();
                fixture.detectChanges();
                await fixture.whenStable();
                expect(formRendererComponent.tabGroup.selectedIndex).toBe(initialIndex + 1);
            });

            it('should decrement selectedIndex when navigating to previous tab', async () => {
                formRendererComponent.navigateToNextTab();
                fixture.detectChanges();
                await fixture.whenStable();
                const indexAfterNext = formRendererComponent.tabGroup.selectedIndex;
                formRendererComponent.navigateToPreviousTab();
                fixture.detectChanges();
                await fixture.whenStable();
                expect(formRendererComponent.tabGroup.selectedIndex).toBe(indexAfterNext - 1);
            });

            it('should not go below 0 when navigating previous on the first tab', async () => {
                formRendererComponent.navigateToPreviousTab();
                fixture.detectChanges();
                await fixture.whenStable();
                expect(formRendererComponent.tabGroup.selectedIndex).toBe(0);
            });

            it('should not exceed last index when navigating next on the last tab', async () => {
                formRendererComponent.navigateToNextTab();
                fixture.detectChanges();
                await fixture.whenStable();
                formRendererComponent.tabGroup.selectedIndexChange.emit(1);
                fixture.detectChanges();

                formRendererComponent.navigateToNextTab();
                fixture.detectChanges();
                await fixture.whenStable();
                formRendererComponent.tabGroup.selectedIndexChange.emit(2);
                fixture.detectChanges();
                const lastIndex = formRendererComponent.tabGroup.selectedIndex;
                formRendererComponent.navigateToNextTab();
                fixture.detectChanges();
                await fixture.whenStable();
                expect(formRendererComponent.tabGroup.selectedIndex).toBe(lastIndex);
            });
        });
    });

    describe('Repeatable section', () => {
        const renderNestedForm = async ({ required = false } = {}) => {
            const form = new FormModel(repeatableSectionForm(required));
            fixture.componentInstance.formDefinition = form;
            spyOn(dialog, 'open').and.returnValue({ beforeClosed: () => of(true) } as any);
            fixture.detectChanges();
            await fixture.whenStable();
            return { form, section: form.fields[0].field };
        };

        const removeFirstRenderedRow = async () => {
            testingUtils.clickByCSS('.adf-grid-list-row-remove-button');
            fixture.detectChanges();
            await fixture.whenStable();
        };

        const addRenderedRow = async () => {
            testingUtils.clickByCSS('button.adf-container-widget-row-action');
            fixture.detectChanges();
            await fixture.whenStable();
        };

        const enterNestedText = async (text: FormFieldModel, value: string) => {
            testingUtils.fillInputByCSS(`[id="${text.id}"]`, value);
            fixture.detectChanges();
            await fixture.whenStable();
        };

        it('should keep the surviving nested optional Text input and write to row zero after deleting the first row', async () => {
            const { form, section } = await renderNestedForm();
            const text = section.rows[1].columns[0].fields[0].columns[0].fields[0];
            const originalInput = testingUtils.getInputByCSS(`[id="${text.id}"]`);

            await removeFirstRenderedRow();

            expect(testingUtils.getAllByCSS('.adf-grid-list-row-remove-button').length).toBe(1);
            expect(testingUtils.getInputByCSS(`[id="${text.id}"]`)).toBe(originalInput);
            expect(text.parent.rowIndex).toBe(0);
            form.validateForm();
            expect(form.isValid).toBeTrue();

            await enterNestedText(text, 'visible row');
            form.validateForm();

            expect(text.value).toBe('visible row');
            expect(form.isValid).toBeTrue();
            expect(form.values).toEqual({ RepeatableSection0lp64g: [{ Text0bere0: 'visible row' }] });
            expect(testingUtils.getInputByCSS(`[id="${text.id}"]`).value).toBe('visible row');
        });

        it('should add and edit one optional row after deleting all initial rows through the UI', async () => {
            const { form, section } = await renderNestedForm();

            await removeFirstRenderedRow();
            await removeFirstRenderedRow();

            expect(testingUtils.getAllByCSS('.adf-grid-list-row-remove-button').length).toBe(0);
            expect(form.values[section.id]).toEqual([]);

            await addRenderedRow();

            const text = section.rows[0].columns[0].fields[0].columns[0].fields[0];
            expect(testingUtils.getAllByCSS('.adf-grid-list-row-remove-button').length).toBe(1);
            expect(text.parent.rowIndex).toBe(0);
            form.validateForm();
            expect(form.isValid).toBeTrue();

            await enterNestedText(text, 'new row');
            form.validateForm();

            expect(text.value).toBe('new row');
            expect(form.isValid).toBeTrue();
            expect(form.values).toEqual({ RepeatableSection0lp64g: [{ Text0bere0: 'new row' }] });
            expect(testingUtils.getInputByCSS(`[id="${text.id}"]`).value).toBe('new row');
        });

        it('should require a value in the new row after deleting all initial rows and adding a row through the UI', async () => {
            const { form, section } = await renderNestedForm({ required: true });

            await removeFirstRenderedRow();
            await removeFirstRenderedRow();
            await addRenderedRow();

            const text = section.rows[0].columns[0].fields[0].columns[0].fields[0];
            form.validateForm();
            expect(text.isValid).toBeFalse();
            expect(form.isValid).toBeFalse();

            await enterNestedText(text, 'required value');
            form.validateForm();

            expect(text.isValid).toBeTrue();
            expect(form.isValid).toBeTrue();
            expect(form.values).toEqual({ RepeatableSection0lp64g: [{ Text0bere0: 'required value' }] });
            expect(testingUtils.getAllByCSS('.adf-grid-list-row-remove-button').length).toBe(1);
        });

        it('should preserve nested rows and their values when deletion is cancelled', () => {
            const form = new FormModel(repeatableSectionForm());
            const section = form.fields[0].field;
            const originalRows = [...section.rows];
            section.rows[0].columns[0].fields[0].columns[0].fields[0].value = 'keep first';
            section.rows[1].columns[0].fields[0].columns[0].fields[0].value = 'keep second';
            fixture.componentInstance.formDefinition = form;
            spyOn(dialog, 'open').and.returnValue({ beforeClosed: () => of(false) } as any);
            fixture.detectChanges();

            testingUtils.clickByCSS('.adf-grid-list-row-remove-button');
            fixture.detectChanges();

            expect(section.rows).toEqual(originalRows);
            expect(testingUtils.getAllByCSS('.adf-grid-list-row-remove-button').length).toBe(2);
            expect(form.values[section.id]).toEqual([{ Text0bere0: 'keep first' }, { Text0bere0: 'keep second' }]);
        });

        const repeatableSectionField = new FormFieldModel(new FormModel(), {
            id: 'RepeatableSection0tbw2y',
            name: 'Repeatable Section',
            type: 'repeatable-section',
            tab: null,
            params: {
                initialNumberOfRows: 2,
                allowInitialRowsDelete: true,
                maxNumberOfRows: 3
            },
            numberOfColumns: 2,
            fields: {
                '1': [
                    {
                        id: 'Text0wwp7n',
                        name: 'Text',
                        type: 'text',
                        readOnly: false,
                        required: false,
                        colspan: 1,
                        rowspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        regexPattern: null,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ],
                '2': [
                    {
                        id: 'Integer0rzkwq',
                        name: 'Integer',
                        type: 'integer',
                        readOnly: false,
                        colspan: 1,
                        rowspan: 1,
                        placeholder: null,
                        minValue: null,
                        maxValue: null,
                        required: false,
                        visibilityCondition: null,
                        params: {
                            existingColspan: 1,
                            maxColspan: 2
                        }
                    }
                ]
            }
        });

        beforeEach(() => {
            const formDefinition = new FormModel(mockRepeatableSectionForm01.formRepresentation);
            fixture.componentInstance.formDefinition = formDefinition;

            fixture.detectChanges();
        });

        it('should display repeatable-section field', () => {
            const container = testingUtils.getByCSS('#field-RepeatableSection0tbw2y-container');

            expect(container).toBeTruthy();
        });

        it('should remove row if confimation dialog is true', () => {
            spyOn(dialog, 'open').and.returnValue({
                beforeClosed: () => of(true)
            } as any);

            spyOn(repeatableSectionField, 'removeRow').and.callThrough();

            const rowIndex = 0;

            fixture.detectChanges();

            fixture.componentInstance.displayDialogToRemoveRow(repeatableSectionField, rowIndex);

            expect(dialog.open).toHaveBeenCalled();
            expect(repeatableSectionField.removeRow).toHaveBeenCalledWith(rowIndex);
        });

        it('should NOT remove row if confirmation dialog is false', () => {
            spyOn(dialog, 'open').and.returnValue({
                beforeClosed: () => of(false)
            } as any);

            spyOn(repeatableSectionField, 'removeRow').and.callThrough();

            const rowIndex = 0;

            fixture.detectChanges();

            fixture.componentInstance.displayDialogToRemoveRow(repeatableSectionField, rowIndex);

            expect(dialog.open).toHaveBeenCalled();
            expect(repeatableSectionField.removeRow).not.toHaveBeenCalled();
        });

        it('should keep the last field in its grid column for collapsed designer shape with colspan 2', () => {
            const mock = JSON.parse(JSON.stringify(mockRepeatableSectionForm01));
            const sectionDefinition = mock.formRepresentation.formDefinition.fields[0];
            sectionDefinition.numberOfColumns = 4;
            sectionDefinition.fields = {
                '1': [{ ...sectionDefinition.fields['1'][0], colspan: 2 }],
                '2': [],
                '3': sectionDefinition.fields['2']
            };
            fixture.componentInstance.formDefinition = new FormModel(mock.formRepresentation);
            fixture.detectChanges();

            const firstRowColumns = testingUtils
                .getByCSS('#field-RepeatableSection0tbw2y-container .adf-grid-list-container')
                .queryAll(By.css('.adf-grid-list-single-column'))
                .map((element) => element.nativeElement as HTMLElement);

            expect(firstRowColumns.length).toBe(3);
            expect(firstRowColumns[0].style['width']).toBe('50%');
            expect(firstRowColumns[1].style['width']).toBe('25%');
            expect(firstRowColumns[2].style['width']).toBe('25%');
        });

        it('should display the correct number of initial rows', () => {
            const rows = testingUtils.getAllByCSS('#field-RepeatableSection0tbw2y-container .adf-grid-list-container');

            expect(rows.length).toBeTruthy(2);
        });

        describe('remove row button', () => {
            it('should display remove button if allowed', () => {
                const row = testingUtils.getByCSS('#field-RepeatableSection0tbw2y-container .adf-grid-list-container');

                expect(row).toBeTruthy();

                const removeRowButton = testingUtils.getByCSS(
                    '#field-RepeatableSection0tbw2y-container .adf-grid-list-container .adf-grid-list-row-remove-button'
                );

                expect(removeRowButton).toBeTruthy();
            });

            it('should NOT display remove button if NOT allowed', () => {
                const formDefinition = new FormModel(mockRepeatableSectionForm02.formRepresentation);
                fixture.componentInstance.formDefinition = formDefinition;

                fixture.detectChanges();

                const row = testingUtils.getByCSS('#field-RepeatableSection0tbw2y-container .adf-grid-list-container');

                expect(row).toBeTruthy();

                const removeRowButton = testingUtils.getByCSS(
                    '#field-RepeatableSection0tbw2y-container .adf-grid-list-container .adf-grid-list-row-remove-button'
                );

                expect(removeRowButton).toBeFalsy();
            });
        });

        describe('row labels', () => {
            const labelSelector = '#field-RepeatableSection0tbw2y-container .adf-grid-list-row-label';

            const buildFormWithLabelParams = (labelParams: Record<string, unknown>): FormModel => {
                const mock = JSON.parse(JSON.stringify(mockRepeatableSectionForm01));
                Object.assign(mock.formRepresentation.formDefinition.fields[0].params, labelParams);
                return new FormModel(mock.formRepresentation);
            };

            const getRenderedLabels = (): string[] =>
                testingUtils.getAllByCSS(labelSelector).map((element) => element.nativeElement.textContent.trim());

            it('should render the default translated row label when no label params are set', () => {
                const labels = getRenderedLabels();

                expect(labels.length).toBe(2);
                labels.forEach((label) => expect(label).toBe('FORM.FORM_RENDERER.ROW_LABEL'));
            });

            it('should NOT render any row label when displayRowLabels is false', () => {
                fixture.componentInstance.formDefinition = buildFormWithLabelParams({ displayRowLabels: false });
                fixture.detectChanges();

                expect(testingUtils.getAllByCSS(labelSelector).length).toBe(0);
            });

            it('should render the custom label with the row number appended', () => {
                fixture.componentInstance.formDefinition = buildFormWithLabelParams({ rowLabelText: 'Approver', appendRowNumber: true });
                fixture.detectChanges();

                expect(getRenderedLabels()).toEqual(['Approver 1', 'Approver 2']);
            });

            it('should render the custom label without the row number when appendRowNumber is false', () => {
                fixture.componentInstance.formDefinition = buildFormWithLabelParams({ rowLabelText: 'Approver', appendRowNumber: false });
                fixture.detectChanges();

                expect(getRenderedLabels()).toEqual(['Approver', 'Approver']);
            });
        });
    });
});

class HideOnFieldValueChangedRulesManager extends FormRulesManager<{ targetFieldId: string }> {
    protected getRules(): { targetFieldId: string } {
        return { targetFieldId: 'requiredText' };
    }

    protected handleRuleEvent(event: FormRulesEvent, rules: { targetFieldId: string }): void {
        if (event.type === 'fieldValueChanged') {
            this.formModel.changeFieldVisibility(rules.targetFieldId, false);
        }
    }
}

describe('Form Renderer Component form rule ordering', () => {
    let fixture: ComponentFixture<FormRendererComponent<any>>;
    let formService: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormRendererComponent],
            providers: [
                {
                    provide: FORM_RULES_MANAGER,
                    useFactory: (service: FormService) => new HideOnFieldValueChangedRulesManager(service),
                    deps: [FormService]
                }
            ]
        });
        fixture = TestBed.createComponent(FormRendererComponent<any>);
        formService = TestBed.inject(FormService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should revalidate after a real rules manager hides an empty required field', () => {
        const form = new FormModel(
            {
                id: 'rule-ordering-form',
                fields: [
                    {
                        id: 'container',
                        type: 'container',
                        numberOfColumns: 1,
                        fields: { 1: [{ id: 'requiredText', type: 'text', name: 'Required text', required: true }] }
                    }
                ]
            },
            undefined,
            false,
            formService
        );

        fixture.componentInstance.formDefinition = form;
        fixture.detectChanges();

        expect(form.isValid).toBe(false, 'form should start invalid with a visible empty required field');

        formService.formRulesEvent.next({ type: 'fieldValueChanged', form } as any);

        expect(form.isValid).toBe(true, 'the rule-driven hide must be reflected in form validity');
    });
});

class HideOnFormLoadedRulesManager extends FormRulesManager<{ targetFieldId: string }> {
    protected getRules(): { targetFieldId: string } {
        return { targetFieldId: 'requiredText' };
    }

    protected handleRuleEvent(event: FormRulesEvent, rules: { targetFieldId: string }): void {
        if (event.type === 'formLoaded') {
            this.formModel.changeFieldVisibility(rules.targetFieldId, false);
        }
    }
}

describe('Form Renderer Component formLoaded rule ordering', () => {
    let fixture: ComponentFixture<FormRendererComponent<any>>;
    let formService: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormRendererComponent],
            providers: [
                {
                    provide: FORM_RULES_MANAGER,
                    useFactory: (service: FormService) => new HideOnFormLoadedRulesManager(service),
                    deps: [FormService]
                }
            ]
        });
        fixture = TestBed.createComponent(FormRendererComponent<any>);
        formService = TestBed.inject(FormService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should revalidate when a formLoaded rule hides an empty required field with no user interaction', () => {
        const form = new FormModel(
            {
                id: 'form-loaded-ordering-form',
                fields: [{ id: 'requiredText', type: 'text', name: 'Required text', required: true }]
            },
            undefined,
            false,
            formService
        );

        fixture.componentInstance.formDefinition = form;
        fixture.detectChanges();

        expect(form.getFormFields().find((field) => field.id === 'requiredText').isVisible).toBe(
            false,
            'sanity check: the formLoaded rule should have hidden the field'
        );
        expect(form.isValid).toBe(true, 'form.isValid must reflect the formLoaded-driven hide with no user interaction');
    });
});

describe('Form Renderer Component multi-tab validation indicators', () => {
    let fixture: ComponentFixture<FormRendererComponent<any>>;
    let form: FormModel;

    const buildInvalidTabbedForm = (): FormModel => {
        const tabs = [
            { id: 'tab-0', title: 'Tab 0', visibilityCondition: null },
            { id: 'tab-1', title: 'Tab 1', visibilityCondition: null },
            {
                id: 'tab-2',
                title: 'Tab 2',
                visibilityCondition: {
                    leftType: 'field',
                    leftValue: 'text-tab-0',
                    operator: '==',
                    rightValue: 'showtab',
                    rightType: 'value',
                    nextConditionOperator: '',
                    nextCondition: null
                }
            }
        ];
        const fields = [
            {
                id: 'container-tab-0',
                type: 'container',
                tab: 'tab-0',
                numberOfColumns: 1,
                fields: { 1: [{ id: 'text-tab-0', type: 'text', name: 'Text in Tab 0', required: false }] }
            },
            {
                id: 'container-tab-1',
                type: 'container',
                tab: 'tab-1',
                numberOfColumns: 1,
                fields: { 1: [{ id: 'text-tab-1', type: 'text', name: 'Text in Tab 1', required: true }] }
            },
            {
                id: 'container-tab-2',
                type: 'container',
                tab: 'tab-2',
                numberOfColumns: 1,
                fields: { 1: [{ id: 'text-tab-2', type: 'text', name: 'Text in Tab 2', required: true }] }
            }
        ];

        const tabbedForm = new FormModel({ tabs, fields });
        TestBed.inject(WidgetVisibilityService).refreshVisibility(tabbedForm);
        tabbedForm.validateForm();

        return tabbedForm;
    };

    const setUp = (providers: Provider[] = [{ provide: ADF_MULTI_TAB_VALIDATION_INDICATORS_ENABLED, useValue: true }]): void => {
        TestBed.configureTestingModule({
            imports: [FormRendererComponent],
            providers
        });
        const translateService = TestBed.inject(TranslateService);
        translateService.use('en').subscribe();
        translateService.setTranslation('en', {
            FORM: {
                FORM_RENDERER: {
                    TAB_VALIDATION_ERRORS_LABEL: '{{ tabTitle }} needs attention',
                    TAB_VALIDATION_ERRORS_TOOLTIP: 'Tab needs attention'
                }
            }
        });

        fixture = TestBed.createComponent(FormRendererComponent<any>);
        form = buildInvalidTabbedForm();
        fixture.componentRef.setInput('formDefinition', form);
        fixture.detectChanges();
    };

    const getTabHeaders = (): HTMLElement[] => Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));

    const getIndicator = (tabHeader: HTMLElement): HTMLElement | null => tabHeader.querySelector('.adf-form-tab-validation-indicator');

    afterEach(() => {
        fixture.destroy();
    });

    describe('when a visible tab has validation errors', () => {
        beforeEach(() => {
            setUp();
        });

        it('should render the indicator only on the visible invalid tab', () => {
            const tabHeaders = getTabHeaders();

            expect(tabHeaders.length).toBe(2);
            expect(tabHeaders.map((tabHeader) => tabHeader.textContent)).not.toContain(jasmine.stringContaining('Tab 2'));
            expect(getIndicator(tabHeaders[0])).toBeNull();
            expect(getIndicator(tabHeaders[1])).not.toBeNull();
        });

        it('should remove the indicator when the invalid field is corrected through the field change path', () => {
            const invalidField = form.getFieldById('text-tab-1');

            invalidField.value = 'corrected';
            form.onFormFieldChanged(invalidField);
            fixture.detectChanges();

            expect(getIndicator(getTabHeaders()[1])).toBeNull();
            expect(getTabHeaders()[1].getAttribute('aria-label')).toBeNull();
        });

        it('should keep the tab width unchanged when the indicator is removed', () => {
            const markedTabWidth = getTabHeaders()[1].getBoundingClientRect().width;
            const markedLabelWidth = getTabHeaders()[1].querySelector('.adf-form-tab-label').getBoundingClientRect().width;
            const invalidField = form.getFieldById('text-tab-1');

            invalidField.value = 'corrected';
            form.onFormFieldChanged(invalidField);
            fixture.detectChanges();

            expect(getTabHeaders()[1].getBoundingClientRect().width).toBe(markedTabWidth);
            expect(getTabHeaders()[1].querySelector('.adf-form-tab-label').getBoundingClientRect().width).toBe(markedLabelWidth);
        });

        it('should keep Previous and Next navigation unchanged when a tab is marked', () => {
            const renderer = fixture.componentInstance;

            expect(renderer.visibleTabCount).toBe(2);
            expect(renderer.canNavigatePrevious).toBeFalse();
            expect(renderer.canNavigateNext).toBeTrue();
        });

        it('should expose the tab title and error state in the accessible name of the marked tab only', () => {
            const [validTab, invalidTab] = getTabHeaders();

            expect(invalidTab.getAttribute('aria-label')).toBe('Tab 1 needs attention');
            expect(validTab.getAttribute('aria-label')).toBeNull();
        });

        it('should render a decorative non-color cue with a tooltip that adds no tab stop', () => {
            const indicator = getIndicator(getTabHeaders()[1]);
            const tooltip = fixture.debugElement.query(By.css('.adf-form-tab-validation-indicator')).injector.get(MatTooltip);

            expect(indicator.textContent.trim()).toBe('*');
            expect(indicator.getAttribute('aria-hidden')).toBe('true');
            expect(indicator.hasAttribute('tabindex')).toBeFalse();
            expect(tooltip.message).toBe('Tab needs attention');
        });

        it('should keep Material tab roles, selection and keyboard activation when a tab is marked', async () => {
            const [validTab, invalidTab] = getTabHeaders();

            expect(validTab.getAttribute('aria-selected')).toBe('true');
            expect(invalidTab.getAttribute('aria-selected')).toBe('false');
            expect(validTab.getAttribute('tabindex')).toBe('0');
            expect(invalidTab.getAttribute('tabindex')).toBe('-1');

            validTab.focus();
            validTab.dispatchEvent(new KeyboardEvent('keydown', { keyCode: RIGHT_ARROW, bubbles: true }));
            fixture.detectChanges();

            expect(document.activeElement).toBe(invalidTab);

            invalidTab.dispatchEvent(new KeyboardEvent('keydown', { keyCode: ENTER, bubbles: true }));
            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.componentInstance.tabGroup.selectedIndex).toBe(1);
            expect(invalidTab.getAttribute('aria-selected')).toBe('true');
            expect(getIndicator(invalidTab)).not.toBeNull();
        });
    });

    describe('ADF_MULTI_TAB_VALIDATION_INDICATORS_ENABLED token', () => {
        const expectNoIndicators = (): void => {
            getTabHeaders().forEach((tabHeader) => {
                expect(getIndicator(tabHeader)).toBeNull();
                expect(tabHeader.getAttribute('aria-label')).toBeNull();
            });
        };

        it('should not render the indicator when the token is not provided', () => {
            setUp([]);

            expect(form.tabs[1].hasValidationErrors).toBeTrue();
            expectNoIndicators();
        });

        it('should not render the indicator when the token is false', () => {
            setUp([{ provide: ADF_MULTI_TAB_VALIDATION_INDICATORS_ENABLED, useValue: false }]);

            expect(form.tabs[1].hasValidationErrors).toBeTrue();
            expectNoIndicators();
        });

        it('should follow the token observable when it toggles', () => {
            const indicatorsEnabled$ = new BehaviorSubject<boolean>(false);
            setUp([{ provide: ADF_MULTI_TAB_VALIDATION_INDICATORS_ENABLED, useValue: indicatorsEnabled$ }]);

            expectNoIndicators();

            indicatorsEnabled$.next(true);
            fixture.detectChanges();

            expect(getIndicator(getTabHeaders()[1])).not.toBeNull();
            expect(getTabHeaders()[1].getAttribute('aria-label')).toBe('Tab 1 needs attention');

            indicatorsEnabled$.next(false);
            fixture.detectChanges();

            expectNoIndicators();
        });

        it('should keep the form invalid when the indicator is disabled', () => {
            setUp([{ provide: ADF_MULTI_TAB_VALIDATION_INDICATORS_ENABLED, useValue: false }]);

            expect(form.isValid).toBeFalse();
        });
    });

    describe('when a tab holds only widget-validated fields', () => {
        const buildDateTabForm = (dateField: Record<string, unknown>): FormModel =>
            new FormModel(
                {
                    tabs: [
                        { id: 'details', title: 'Details' },
                        { id: 'coverage', title: 'Coverage' }
                    ],
                    fields: [
                        {
                            id: 'details-root',
                            type: 'container',
                            tab: 'details',
                            numberOfColumns: 1,
                            fields: { 1: [{ id: 'email', type: 'text', name: 'Email' }] }
                        },
                        {
                            id: 'coverage-root',
                            type: 'container',
                            tab: 'coverage',
                            numberOfColumns: 1,
                            fields: { 1: [{ id: 'dob', type: 'date', name: 'Date of birth', ...dateField }] }
                        }
                    ]
                },
                null,
                false,
                TestBed.inject(FormService)
            );

        const renderForm = (dateField: Record<string, unknown>): void => {
            setUp();
            form = buildDateTabForm(dateField);
            fixture.componentRef.setInput('formDefinition', form);
            fixture.detectChanges();
        };

        const openCoverageTab = async (): Promise<void> => {
            fixture.autoDetectChanges();
            fixture.componentInstance.tabGroup.selectedIndex = 1;
            await fixture.whenStable();
        };

        const getDateWidget = (): HTMLElement | null => fixture.nativeElement.querySelector('date-widget');

        it('should mark an unopened tab with an empty required date and make the form invalid without rendering its widget', () => {
            renderForm({ required: true });

            expect(getDateWidget()).toBeNull();
            expect(form.isValid).toBeFalse();
            expect(getIndicator(getTabHeaders()[1])).not.toBeNull();
        });

        it('should mark an unopened tab with a date outside its range', () => {
            renderForm({ minValue: '2024-03-01', value: '2024-01-01' });

            expect(getDateWidget()).toBeNull();
            expect(form.isValid).toBeFalse();
            expect(getIndicator(getTabHeaders()[1])).not.toBeNull();
        });

        it('should not mark an unopened tab whose date is valid', () => {
            renderForm({ required: true, minValue: '2024-03-01', value: '2024-05-10' });

            expect(form.isValid).toBeTrue();
            expect(getIndicator(getTabHeaders()[1])).toBeNull();
        });

        it('should keep the tab marked once the tab is opened', async () => {
            renderForm({ required: true });

            await openCoverageTab();

            expect(getDateWidget()).not.toBeNull();
            expect(form.isValid).toBeFalse();
            expect(getIndicator(getTabHeaders()[1])).not.toBeNull();
        });

        it('should mark an unopened tab with an empty required datetime and keep it marked once the tab is opened', async () => {
            renderForm({ type: 'datetime', required: true });

            expect(form.isValid).toBeFalse();
            expect(getIndicator(getTabHeaders()[1])).not.toBeNull();

            await openCoverageTab();

            expect(fixture.nativeElement.querySelector('date-time-widget')).not.toBeNull();
            expect(form.isValid).toBeFalse();
            expect(getIndicator(getTabHeaders()[1])).not.toBeNull();
        });

        it('should keep reporting a prefilled out-of-range date once its tab is opened', async () => {
            renderForm({ minValue: '2024-03-01', value: '2024-01-01' });

            await openCoverageTab();

            expect(form.getFieldById('dob').validationSummary.message).toBe('FORM.FIELD.VALIDATOR.NOT_LESS_THAN');
            expect(form.isValid).toBeFalse();
            expect(getIndicator(getTabHeaders()[1])).not.toBeNull();
        });

        it('should clear the mark when an unopened field is corrected through the model', () => {
            renderForm({ required: true });
            const dateField = form.getFieldById('dob');

            dateField.value = '2024-05-10';
            form.validateForm();
            fixture.detectChanges();

            expect(getIndicator(getTabHeaders()[1])).toBeNull();
        });

        it('should keep validating a required date whose widget type has been replaced', () => {
            setUp();
            TestBed.inject(FormRenderingService).setComponentTypeResolver('date', () => TextWidgetComponent, true);
            form = buildDateTabForm({ required: true });
            fixture.componentRef.setInput('formDefinition', form);
            fixture.detectChanges();

            expect(form.isValid).toBeFalse();
            expect(getIndicator(getTabHeaders()[1])).not.toBeNull();
        });

        it('should keep an error that a replacement date widget reports once its tab is opened', async () => {
            setUp();
            TestBed.inject(FormRenderingService).setComponentTypeResolver('date', () => ReportingDateWidgetComponent, true);
            form = buildDateTabForm({ value: '2024-05-10' });
            fixture.componentRef.setInput('formDefinition', form);
            fixture.detectChanges();

            expect(form.isValid).toBeTrue();

            await openCoverageTab();
            form.validateForm();
            fixture.detectChanges();

            expect(form.getFieldById('dob').validationSummary.message).toBe('CUSTOM.DATE_ERROR');
            expect(form.isValid).toBeFalse();
            expect(getIndicator(getTabHeaders()[1])).not.toBeNull();
        });

        it('should mark the tab when text that does not parse is typed into an opened date field', async () => {
            renderForm({});
            await openCoverageTab();
            const input: HTMLInputElement = fixture.nativeElement.querySelector('date-widget input');

            input.value = 'not a date';
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            expect(form.getFieldById('dob').validationSummary.message).toBe('FORM.FIELD.VALIDATOR.INVALID_DATE_FORMAT');
            expect(form.isValid).toBeFalse();
            expect(getIndicator(getTabHeaders()[1])).not.toBeNull();
        });

        it('should make a form without tabs invalid when a collapsed group holds an empty required date', () => {
            setUp();
            form = new FormModel(
                {
                    fields: [
                        {
                            id: 'coverage-group',
                            type: 'group',
                            name: 'Coverage',
                            params: { allowCollapse: true, collapseByDefault: true },
                            numberOfColumns: 1,
                            fields: { 1: [{ id: 'dob', type: 'date', name: 'Date of birth', required: true }] }
                        }
                    ]
                },
                null,
                false,
                TestBed.inject(FormService)
            );
            fixture.componentRef.setInput('formDefinition', form);
            fixture.detectChanges();

            expect(getDateWidget()).toBeNull();
            expect(form.isValid).toBeFalse();
        });
    });
});

@Injectable({ providedIn: 'root' })
class RootFormRulesManager extends FormRulesManager<unknown> {
    readonly handledForms: FormModel[] = [];

    constructor() {
        super(inject(FormService));
    }

    get boundForm(): FormModel {
        return this.formModel;
    }

    protected getRules(): unknown {
        return {};
    }

    protected handleRuleEvent(): void {
        this.handledForms.push(this.formModel);
    }
}

describe('Form Renderer Component simultaneous instances', () => {
    const sharedDefinition = () => ({
        id: 'shared-definition',
        fields: [
            { id: 'sharedContainer', type: 'container', numberOfColumns: 1, fields: { 1: [{ id: 'sharedText', type: 'text', value: 'Authored' }] } }
        ]
    });

    const renderTwoInstances = (formService: FormService) => {
        const firstForm = new FormModel(sharedDefinition(), undefined, false, formService);
        const secondForm = new FormModel(sharedDefinition(), undefined, false, formService);
        const first = TestBed.createComponent(FormRendererComponent);
        const second = TestBed.createComponent(FormRendererComponent);
        first.componentRef.setInput('formDefinition', firstForm);
        second.componentRef.setInput('formDefinition', secondForm);
        first.detectChanges();
        second.detectChanges();

        return { first, second, firstForm, secondForm };
    };

    it('should give each renderer its own bypass manager when no rules manager is provided', () => {
        TestBed.configureTestingModule({ imports: [FormRendererComponent] });
        const { first, second } = renderTwoInstances(TestBed.inject(FormService));

        expect(first.debugElement.injector.get(FormRulesManager)).not.toBe(second.debugElement.injector.get(FormRulesManager));
    });

    it('should share one root manager across simultaneous renderers and bind it to the last initialized model', () => {
        TestBed.configureTestingModule({
            imports: [FormRendererComponent],
            providers: [{ provide: FORM_RULES_MANAGER, useExisting: RootFormRulesManager }]
        });
        const formService = TestBed.inject(FormService);
        const manager = TestBed.inject(RootFormRulesManager);
        const { first, second, firstForm, secondForm } = renderTwoInstances(formService);
        manager.handledForms.length = 0;

        formService.formRulesEvent.next(new FormRulesEvent('fieldValueChanged', new FormEvent(firstForm)));

        expect(first.debugElement.injector.get(FormRulesManager)).toBe(manager);
        expect(second.debugElement.injector.get(FormRulesManager)).toBe(manager);
        expect(manager.boundForm).toBe(secondForm);
        expect(manager.handledForms).toEqual([secondForm]);
    });

    it('should route a rule event from one instance to every same-definition subscriber', () => {
        TestBed.configureTestingModule({ imports: [FormRendererComponent] });
        const formService = TestBed.inject(FormService);
        const { firstForm, secondForm } = renderTwoInstances(formService);
        const received: FormModel[] = [];
        formService.formRulesEvent.pipe(filter((event) => event.form?.id === secondForm.id)).subscribe((event) => received.push(event.form));

        formService.formRulesEvent.next(new FormRulesEvent('fieldValueChanged', new FormEvent(firstForm)));

        expect(received).toEqual([firstForm]);
        expect(firstForm.id).toBe(secondForm.id);
    });
});

const mountRulesOnlyRenderer = (version: string | number | undefined = 1, fields: object[] = [{ id: 'text', type: 'text', value: 'authored' }]) => {
    const form = new FormModel({
        id: 'same-definition',
        version,
        fields,
        outcomes: [{ id: 'clear', name: 'Clear', executionMode: 'rules-only', skipValidation: true }]
    });
    const fixture = TestBed.createComponent(FormRendererComponent);
    fixture.componentRef.setInput('formDefinition', form);
    fixture.detectChanges();
    return { fixture, renderer: fixture.componentInstance, form, outcome: form.outcomes.find((outcome) => outcome.id === 'clear') };
};

describe('Form Renderer Component rules-only invocation', () => {
    let manager: RootFormRulesManager;
    let notifications: jasmine.Spy;
    let requests: FormInvocationRequest[];
    let provider: { enabled: boolean; execute: jasmine.Spy };

    const flushPromises = (): Promise<void> => new Promise((resolve) => setTimeout(resolve));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormRendererComponent],
            providers: [{ provide: FORM_RULES_MANAGER, useExisting: RootFormRulesManager }]
        });
        manager = TestBed.inject(RootFormRulesManager);
        notifications = spyOn(TestBed.inject(NotificationService), 'showError');
        requests = [];
        provider = {
            enabled: true,
            execute: jasmine.createSpy('execute').and.callFake((request: FormInvocationRequest) => {
                requests.push(request);
                return request.reset();
            })
        };
        manager.rulesOnlyProvider = provider;
    });

    it('should dispatch exact independent mounted models despite a shared manager bound to the second', async () => {
        const first = mountRulesOnlyRenderer();
        const second = mountRulesOnlyRenderer();
        const firstReset = spyOn(first.form, 'resetToDefaults').and.callThrough();
        const secondReset = spyOn(second.form, 'resetToDefaults').and.callThrough();
        const firstTerminal = jasmine.createSpy('first terminal');
        const secondTerminal = jasmine.createSpy('second terminal');
        expect(manager.boundForm).toBe(second.form);

        first.renderer.dispatchRulesOnlyOutcome(first.outcome, firstTerminal);
        second.renderer.dispatchRulesOnlyOutcome(second.outcome, secondTerminal);
        await flushPromises();

        expect(requests.map((request) => request.form)).toEqual([first.form, second.form]);
        expect(requests[0].renderer).toBe(first.renderer);
        expect(requests[1].renderer).toBe(second.renderer);
        expect(requests[0].generation).not.toBe(requests[1].generation);
        expect(requests[0].invocation).not.toBe(requests[1].invocation);
        expect(requests[0].documentVersion).toBe('1');
        expect(requests[0].outcomeId).toBe('clear');
        expect(firstReset).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ form: first.form, renderer: first.renderer }),
            jasmine.objectContaining({ editableFields: jasmine.any(Set) })
        );
        expect(secondReset).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ form: second.form, renderer: second.renderer }),
            jasmine.objectContaining({ editableFields: jasmine.any(Set) })
        );
        expect(firstTerminal).toHaveBeenCalledOnceWith(jasmine.objectContaining({ status: 'complete' }));
        expect(secondTerminal).toHaveBeenCalledOnceWith(jasmine.objectContaining({ status: 'complete' }));
        expect(notifications).not.toHaveBeenCalled();
    });

    it('should complete without a failure notification when display-only widgets sit beside a text field', async () => {
        const mounted = mountRulesOnlyRenderer(1, [
            { id: 'text', type: 'text', value: 'authored' },
            { id: 'viewer', type: 'file-viewer', value: 'file' },
            { id: 'properties', type: 'properties-viewer' },
            { id: 'table', type: 'data-table', value: [{ id: 'row' }] },
            {
                id: 'rows',
                type: 'repeatable-section',
                params: { initialNumberOfRows: 1 },
                fields: {
                    1: [
                        { id: 'rowViewer', type: 'file-viewer' },
                        { id: 'rowText', type: 'text', value: 'authored' }
                    ]
                }
            }
        ]);
        mounted.form.getFieldById('text').value = 'draft';
        const section = mounted.form.getFieldById('rows');
        section.addRow(section.fields, mounted.form);

        const result = await new Promise<FormInvocationResult>((resolve) => mounted.renderer.dispatchRulesOnlyOutcome(mounted.outcome, resolve));

        expect(result.status).toBe('complete');
        expect(mounted.form.getFieldById('text').value).toBe('authored');
        expect(mounted.form.getFieldById('rows').rows.length).toBe(1);
        expect(notifications).not.toHaveBeenCalled();
    });

    it('should not dispatch when the renderer is read only', () => {
        const mounted = mountRulesOnlyRenderer();
        mounted.fixture.componentRef.setInput('readOnly', true);
        const terminal = jasmine.createSpy('terminal');

        expect(mounted.renderer.dispatchRulesOnlyOutcome(mounted.outcome, terminal)).toBeFalse();
        expect(provider.execute).not.toHaveBeenCalled();
        expect(terminal).not.toHaveBeenCalled();
        expect(notifications).not.toHaveBeenCalled();
    });

    it('should still deliver the terminal result when the failure notification throws', async () => {
        const mounted = mountRulesOnlyRenderer();
        manager.rulesOnlyProvider = undefined;
        notifications.and.throwError('notification');

        const result = await new Promise<FormInvocationResult>((resolve) => mounted.renderer.dispatchRulesOnlyOutcome(mounted.outcome, resolve));

        expect(result.status).toBe('unavailable');
        expect(notifications).toHaveBeenCalledTimes(1);
    });

    it('should coalesce clicks while retaining authored reset positions and notify one failed invocation once', async () => {
        const mounted = mountRulesOnlyRenderer();
        let finish: (result: FormResetResult) => void;
        const terminal = jasmine.createSpy('terminal');
        const duplicate = jasmine.createSpy('duplicate terminal');
        const reset = spyOn(mounted.form, 'resetToDefaults').and.callThrough();
        provider.execute.and.callFake(async (request: FormInvocationRequest) => {
            requests.push(request);
            await request.reset();
            request.form.changeFieldValue('text', 'intervening write', request);
            await request.reset();
            return new Promise<FormResetResult>((resolve) => (finish = resolve));
        });
        mounted.renderer.dispatchRulesOnlyOutcome(mounted.outcome, terminal);
        mounted.renderer.dispatchRulesOnlyOutcome(mounted.outcome, duplicate);
        await flushPromises();
        expect(provider.execute).toHaveBeenCalledTimes(1);
        expect(reset).toHaveBeenCalledTimes(2);
        expect(mounted.form.getFieldById('text').value).toBe('authored');
        finish({ context: requests[0], status: 'partial', items: [] });
        await flushPromises();
        expect(terminal).toHaveBeenCalledTimes(1);
        expect(duplicate).not.toHaveBeenCalled();
        expect(notifications).toHaveBeenCalledOnceWith('FORM.OUTCOME_EXECUTION_FAILED');
        expect(requests[0].isCurrent()).toBeFalse();
    });

    for (const capability of ['missing', 'disabled', 'reset'] as const) {
        it(`should report unavailable without effects for ${capability} capability`, async () => {
            const mounted = mountRulesOnlyRenderer();
            const terminal = jasmine.createSpy('terminal');
            const reset = spyOn(mounted.form, 'resetToDefaults').and.callThrough();
            if (capability === 'missing') {
                manager.rulesOnlyProvider = undefined;
            } else if (capability === 'disabled') {
                manager.rulesOnlyProvider = { ...provider, enabled: false };
            } else {
                mounted.form.resetToDefaults = undefined;
            }
            expect(mounted.renderer.dispatchRulesOnlyOutcome(mounted.outcome, terminal)).toBeTrue();
            await flushPromises();
            expect(provider.execute).not.toHaveBeenCalled();
            expect(reset).not.toHaveBeenCalled();
            expect(terminal).toHaveBeenCalledOnceWith(jasmine.objectContaining({ status: 'unavailable' }));
            expect(notifications).toHaveBeenCalledTimes(1);
        });
    }

    it('should require a real revision and accept explicit renderer revision without changing mount generation', async () => {
        const mounted = mountRulesOnlyRenderer(undefined);
        delete mounted.form.json.version;
        const terminal = jasmine.createSpy('terminal');
        const mountState = captureFormStateMount(mounted.form.getFormFields()[0]);
        expect(mounted.renderer.dispatchRulesOnlyOutcome(mounted.outcome, terminal)).toBeFalse();
        expect(provider.execute).not.toHaveBeenCalled();
        mounted.fixture.componentRef.setInput('documentVersion', 'authored-revision');
        expect(mounted.renderer.dispatchRulesOnlyOutcome(mounted.outcome, terminal)).toBeTrue();
        await flushPromises();
        expect(requests[0].documentVersion).toBe('authored-revision');
        expect(requests[0].generation).toBe(mountState.generation);
    });

    for (const stale of ['cancel', 'version', 'explicit-version', 'replace', 'destroy'] as const) {
        it(`should reject stale reset and completion after ${stale} without notifying a successor`, async () => {
            const mounted = mountRulesOnlyRenderer();
            let finish: (result: FormResetResult) => void;
            const terminal = jasmine.createSpy('terminal');
            const reset = spyOn(mounted.form, 'resetToDefaults').and.callThrough();
            provider.execute.and.callFake((request: FormInvocationRequest) => {
                requests.push(request);
                return new Promise<FormResetResult>((resolve) => (finish = resolve));
            });
            mounted.renderer.dispatchRulesOnlyOutcome(mounted.outcome, terminal);
            await flushPromises();
            const request = requests[0];
            if (stale === 'cancel') {
                mounted.renderer.cancelInvocation();
            } else if (stale === 'version') {
                mounted.form.json.version = 2;
            } else if (stale === 'explicit-version') {
                mounted.fixture.componentRef.setInput('documentVersion', 'next');
            } else if (stale === 'replace') {
                mounted.fixture.componentRef.setInput('formDefinition', new FormModel({ id: mounted.form.id, version: 2 }));
            } else {
                mounted.fixture.destroy();
            }
            expect(request.isCurrent()).toBeFalse();
            let staleReset: FormResetResult;
            request.reset().then((result) => (staleReset = result));
            finish({ context: request, status: 'failed', items: [] });
            await flushPromises();
            expect(staleReset.status).toBe('unavailable');
            expect(reset).not.toHaveBeenCalled();
            expect(terminal).not.toHaveBeenCalled();
            expect(notifications).not.toHaveBeenCalled();
            if (stale === 'version' || stale === 'explicit-version' || stale === 'cancel') {
                expect(hasFormStateBinding(mounted.form, mounted.renderer, request.generation)).toBeTrue();
                provider.execute.and.callFake((next: FormInvocationRequest) => Promise.resolve({ context: next, status: 'complete', items: [] }));
                mounted.renderer.dispatchRulesOnlyOutcome(mounted.outcome, terminal);
                await flushPromises();
                expect(terminal).toHaveBeenCalledTimes(1);
            }
        });
    }

    for (const failure of ['throw', 'reject'] as const) {
        it(`should turn a provider ${failure} into one failed terminal result`, async () => {
            const mounted = mountRulesOnlyRenderer();
            const terminal = jasmine.createSpy('terminal');
            provider.execute.and.callFake(() => {
                if (failure === 'throw') {
                    throw new Error('provider failed');
                }
                return Promise.reject(new Error('provider failed'));
            });
            mounted.renderer.dispatchRulesOnlyOutcome(mounted.outcome, terminal);
            await flushPromises();
            expect(terminal).toHaveBeenCalledOnceWith(jasmine.objectContaining({ status: 'failed' }));
            expect(notifications).toHaveBeenCalledTimes(1);
        });
    }
});

describe('Form Renderer Component rules-only invocation without a rules manager', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [FormRendererComponent] });
    });

    it('should report unavailable when the renderer falls back to the bypass rules manager', async () => {
        const notifications = spyOn(TestBed.inject(NotificationService), 'showError');
        const mounted = mountRulesOnlyRenderer();

        const result = await new Promise<FormInvocationResult>((resolve) => mounted.renderer.dispatchRulesOnlyOutcome(mounted.outcome, resolve));

        expect(mounted.fixture.debugElement.injector.get(FormRulesManager)).toBeInstanceOf(ByPassFormRuleManager);
        expect(result.status).toBe('unavailable');
        expect(notifications).toHaveBeenCalledOnceWith('FORM.OUTCOME_EXECUTION_FAILED');
    });
});
