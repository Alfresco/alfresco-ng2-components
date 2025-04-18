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
import { CoreTestingModule, UnitTestingUtils } from '../../testing';
import { FormRulesManager } from '../models/form-rules.model';
import { FormRenderingService } from '../services/form-rendering.service';
import { FormService } from '../services/form.service';
import { FormRendererComponent } from './form-renderer.component';
import {
    amountWidgetFormVisibilityMock,
    checkboxWidgetFormVisibilityMock,
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
    multilineWidgetFormVisibilityMock,
    numberMinMaxForm,
    numberNotRequiredForm,
    numberWidgetVisibilityForm,
    radioWidgetVisibilityForm,
    textWidgetVisibility
} from './mock/form-renderer.component.mock';
import { FormModel, TextWidgetComponent } from './widgets';

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

describe('Form Renderer Component', () => {
    let formRendererComponent: FormRendererComponent<any>;
    let fixture: ComponentFixture<FormRendererComponent<any>>;
    let formService: FormService;
    let formRenderingService: FormRenderingService;
    let rulesManager: FormRulesManager<any>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule]
        });
        fixture = TestBed.createComponent(FormRendererComponent);
        formRendererComponent = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        formService = TestBed.inject(FormService);
        formRenderingService = TestBed.inject(FormRenderingService);
        rulesManager = fixture.debugElement.injector.get(FormRulesManager);
    });

    afterEach(() => {
        fixture.destroy();
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
            const errorWidgetText = testingUtils.getByCSS('#field-Number1-container error-widget .adf-error-text').nativeElement;
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`);
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
            let errorWidgetText = testingUtils.getByCSS('#field-Number0x8cbv-container error-widget .adf-error-text').nativeElement;
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.INVALID_NUMBER`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without mandatory field');

            typeIntoInput(testingUtils, '#Number0x8cbv', '?');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeInvalid(testingUtils, 'Number0x8cbv');
            errorWidgetText = testingUtils.getByCSS('#field-Number0x8cbv-container error-widget .adf-error-text').nativeElement;
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.INVALID_NUMBER`);
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
            let errorWidgetText = testingUtils.getByCSS('#field-Number0him2z-container error-widget .adf-error-text').nativeElement;
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.NOT_LESS_THAN`);
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
            errorWidgetText = testingUtils.getByCSS('#field-Number0him2z-container error-widget .adf-error-text').nativeElement;
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`);
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
            formRenderingService.register({ bananaforevah: () => TextWidgetComponent }, true);
            formRendererComponent.formDefinition = formService.parseForm(customWidgetForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'Text0vdi18');
            expectElementToBeVisible(testingUtils, 'bananaforevah0k8gui');
        });

        it('Should be able to correctly use visibility in a custom process cloud widget ', async () => {
            formRenderingService.register({ bananaforevah: () => TextWidgetComponent }, true);
            formRendererComponent.formDefinition = formService.parseForm(customWidgetFormWithVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(testingUtils, 'bananaforevah0k8gui');
            typeIntoInput(testingUtils, '#Text0vdi18', 'no');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(testingUtils, 'bananaforevah0k8gui');
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
});
