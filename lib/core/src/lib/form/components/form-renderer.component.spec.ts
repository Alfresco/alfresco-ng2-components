/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    displayTextWidgetFormVisibilityMock,
    formDateVisibility,
    formDisplayValueCombinedVisibility,
    formDisplayValueForm,
    formDisplayValueVisibility,
    formNumberTextJson,
    formNumberWidgetVisibility,
    formRequiredNumberWidget,
    multilineWidgetFormVisibilityMock,
    numberMinMaxForm,
    numberNotRequiredForm,
    numberWidgetVisibilityForm,
    radioWidgetVisibilityForm,
    textWidgetVisibility
} from './mock/form-renderer.component.mock';
import { TextWidgetComponent } from './widgets';
import { DebugElement } from '@angular/core';

const typeIntoInput = (debugElement: DebugElement, selector: string, message: string) => {
    UnitTestingUtils.fillInputByCSS(debugElement, selector, message);
};

const expectElementToBeHidden = (debugElement: DebugElement, selector: string): void => {
    const targetElement = UnitTestingUtils.getByCSS(debugElement, selector).nativeElement;
    expect(targetElement).toBeTruthy();
    expect(targetElement.style.visibility).toBe('hidden', `${targetElement.id} should be hidden but it is not`);
};

const expectElementToBeVisible = (debugElement: DebugElement, selector: string): void => {
    const targetElement = UnitTestingUtils.getByCSS(debugElement, selector).nativeElement;
    expect(targetElement).toBeTruthy();
    expect(targetElement.style.visibility).not.toBe('hidden', `${targetElement.id} should be visibile but it is not`);
};

const expectInputElementValueIs = (debugElement: DebugElement, selector: string, value: string): void => {
    const targetElement = UnitTestingUtils.getByCSS(debugElement, selector).nativeElement;
    expect(targetElement).toBeTruthy();
    expect(targetElement.value).toBe(value, `invalid value for ${targetElement.name}`);
};

const expectElementToBeInvalid = (debugElement: DebugElement, fieldId: string): void => {
    const invalidElementContainer = UnitTestingUtils.getByCSS(debugElement, `#field-${fieldId}-container .adf-invalid`);
    expect(invalidElementContainer).toBeTruthy();
};

const expectElementToBeValid = (debugElement: DebugElement, fieldId: string): void => {
    const invalidElementContainer = UnitTestingUtils.getByCSS(debugElement, `#field-${fieldId}-container .adf-invalid`);
    expect(invalidElementContainer).toBeFalsy();
};

describe('Form Renderer Component', () => {
    let formRendererComponent: FormRendererComponent<any>;
    let fixture: ComponentFixture<FormRendererComponent<any>>;
    let formService: FormService;
    let formRenderingService: FormRenderingService;
    let rulesManager: FormRulesManager<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule]
        });
        fixture = TestBed.createComponent(FormRendererComponent);
        formRendererComponent = fixture.componentInstance;
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

            expectElementToBeHidden(fixture.debugElement, '#field-Text0pqd1u-container');
            UnitTestingUtils.fillInputByCSS(fixture.debugElement, '#Date0hwq20', '2019-11-19');

            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#field-Text0pqd1u-container');
        });

        it('Should not be able to see a widget when the visibility condition refers to another fields with specific date', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDateVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#field-Text0uyqd3-container');

            UnitTestingUtils.fillInputByCSS(fixture.debugElement, '#Date0hwq20', '2019-11-19');

            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeHidden(fixture.debugElement, '#field-Text0uyqd3-container');
        });

        it('[C310336] - Should be able to set visibility conditions for Date widget', async () => {
            formRendererComponent.formDefinition = formService.parseForm(dateWidgetFormVisibilityMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#field-Text5asd0a-container');
            expectElementToBeHidden(fixture.debugElement, '#field-Date8wbe3d-container');

            typeIntoInput(fixture.debugElement, '#Text5asd0a', 'Date');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#field-Date8wbe3d-container');
        });
    });

    describe('Display Value Widget', () => {
        it('[C309862] - Should be able to see Display value widget when visibility condition refers to another field with specific value', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDisplayValueVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeHidden(fixture.debugElement, '#field-Displayvalue0g6092-container');
            typeIntoInput(fixture.debugElement, '#Text0bq3ar', 'DisplayValue');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#field-Displayvalue0g6092-container');
            expectInputElementValueIs(fixture.debugElement, '#Displayvalue0g6092', 'No field selected');
        });

        it('[C309863] - Should be able to see Display value widget when visibility condition refers to a form variable and a field', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDisplayValueForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-DisplayValueOne-container');

            typeIntoInput(fixture.debugElement, '#Text0howrc', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#field-DisplayValueOne-container');
            expectInputElementValueIs(fixture.debugElement, '#DisplayValueOne', 'No field selected');

            typeIntoInput(fixture.debugElement, '#Text0howrc', 'aaab');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-DisplayValueOne-container');
        });

        it('[C309864] - Should be able to see Display value widget when visibility condition refers to another field and form variable', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDisplayValueForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-DisplayValueVariableField-container');

            typeIntoInput(fixture.debugElement, '#TextOne', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#field-DisplayValueVariableField-container');
            expectInputElementValueIs(fixture.debugElement, '#DisplayValueVariableField', 'No field selected');

            typeIntoInput(fixture.debugElement, '#TextOne', 'aaab');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-DisplayValueVariableField-container');
        });

        it('[C309865] - Should be able to see Display value widget when has multiple visibility conditions and next condition operators', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDisplayValueCombinedVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#Text0bq3ar');
            expectElementToBeVisible(fixture.debugElement, '#TextTwo');
            expectElementToBeHidden(fixture.debugElement, '#field-Displayvalue0g6092-container');

            typeIntoInput(fixture.debugElement, '#Text0bq3ar', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            typeIntoInput(fixture.debugElement, '#Text0bq3ar', 'aaa');
            expectInputElementValueIs(fixture.debugElement, '#TextTwo', '');
            expectElementToBeVisible(fixture.debugElement, '#field-Displayvalue0g6092-container');

            typeIntoInput(fixture.debugElement, '#Text0bq3ar', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            typeIntoInput(fixture.debugElement, '#Text0bq3ar', 'bbb');
            expectInputElementValueIs(fixture.debugElement, '#TextTwo', '');
            expectElementToBeHidden(fixture.debugElement, '#field-Displayvalue0g6092-container');

            typeIntoInput(fixture.debugElement, '#TextTwo', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            typeIntoInput(fixture.debugElement, '#Text0bq3ar', 'bbb');
            expectInputElementValueIs(fixture.debugElement, '#TextTwo', 'aaa');
            expectElementToBeHidden(fixture.debugElement, '#field-Displayvalue0g6092-container');

            typeIntoInput(fixture.debugElement, '#Text0bq3ar', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            typeIntoInput(fixture.debugElement, '#Text0bq3ar', 'aaa');
            expectInputElementValueIs(fixture.debugElement, '#TextTwo', 'aaa');
            expectElementToBeHidden(fixture.debugElement, '#field-Displayvalue0g6092-container');

            typeIntoInput(fixture.debugElement, '#TextTwo', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            typeIntoInput(fixture.debugElement, '#Text0bq3ar', 'aaa');
            expectInputElementValueIs(fixture.debugElement, '#TextTwo', 'bbb');
            expectElementToBeVisible(fixture.debugElement, '#field-Displayvalue0g6092-container');
        });
    });

    describe('Number widget', () => {
        it('[C315169] - Should be able to complete a task with a form with number widgets', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberWidgetVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#Number1');
            expectElementToBeHidden(fixture.debugElement, '#field-Number2-container');
            expect(formRendererComponent.formDefinition.isValid).toBe(true, 'Form should be valid by default');

            typeIntoInput(fixture.debugElement, '#Number1', '5');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#Number1');
            expectElementToBeVisible(fixture.debugElement, '#field-Number2-container');
            expect(formRendererComponent.formDefinition.isValid).toBe(true, 'Form should be valid with a valid value');

            typeIntoInput(fixture.debugElement, '#Number1', 'az');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#Number1');
            expectElementToBeHidden(fixture.debugElement, '#field-Number2-container');
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should be invalid with an invalid value');
        });

        it('[C309663] - Should be able to see Number widget when visibility condition refers to another field with specific value', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberTextJson.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#Text');
            expectElementToBeHidden(fixture.debugElement, '#field-NumberFieldValue-container');

            typeIntoInput(fixture.debugElement, '#Text', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-NumberFieldValue-container');

            typeIntoInput(fixture.debugElement, '#Text', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-NumberFieldValue-container');
        });

        it('[C315170] - Should be able to complete a task with a form with required number widgets', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formRequiredNumberWidget.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeHidden(fixture.debugElement, '#field-Number2-container');
            expectElementToBeVisible(fixture.debugElement, '#Number1');

            typeIntoInput(fixture.debugElement, '#Number1', '5');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-Number2-container');

            typeIntoInput(fixture.debugElement, '#Number1', '123');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-Number2-container');
            const errorWidgetText = UnitTestingUtils.getByCSS(
                fixture.debugElement,
                '#field-Number1-container error-widget .adf-error-text'
            ).nativeElement;
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without mandatory field');
        });

        it('[C309653] - Should disable the save button when Number widget is required', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberTextJson.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#NumberReq');
            expectElementToBeVisible(fixture.debugElement, '#NumberNotReq');
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should be invalid with an empty required value');

            typeIntoInput(fixture.debugElement, '#NumberNotReq', '5');
            fixture.detectChanges();
            await fixture.whenStable();
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should be invalid with an empty required value');

            typeIntoInput(fixture.debugElement, '#NumberReq', '5');
            typeIntoInput(fixture.debugElement, '#NumberNotReq', '');
            fixture.detectChanges();
            await fixture.whenStable();
            expect(formRendererComponent.formDefinition.isValid).toBe(true, 'Form should be valid when required field are filled');
        });

        it('[C309654] - Should display Number widget spans on 2 columns when colspan is set to 2 and grid view is active', async () => {
            formRendererComponent.formDefinition = formService.parseForm(colspanForm.formRepresentation.formDefinition, null, false, true);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-2bc275fb-e113-4d7d-885f-6e74a7332d40-container div.adf-grid-list');
            const sectionGridElement: HTMLElement[] = UnitTestingUtils.getAllByCSS(
                fixture.debugElement,
                '#field-2bc275fb-e113-4d7d-885f-6e74a7332d40-container div .adf-grid-list-item'
            ).map((element) => element.nativeElement);
            sectionGridElement.forEach((element) => {
                expect(element.style['grid-area']).toBe('auto / auto / span 1 / span 1', 'Elemens is wrong sized for this section');
            });

            const fullWidthElement = UnitTestingUtils.getByCSS(
                fixture.debugElement,
                '#field-d52ada4e-cbdc-4f0c-a480-5b85fa00e4f8-container div.adf-grid-list .adf-grid-list-item'
            ).nativeElement;
            expect(fullWidthElement.style['grid-area']).toBe('auto / auto / span 1 / span 2');
        });

        it('[C309654] - Should display Number widget spans on 2 columns when colspan is set to 2 and grid view is not active', async () => {
            formRendererComponent.formDefinition = formService.parseForm(colspanForm.formRepresentation.formDefinition, null, false, false);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-2bc275fb-e113-4d7d-885f-6e74a7332d40-container section.adf-grid-list-column-view');
            const sectionGridElement = UnitTestingUtils.getAllByCSS(
                fixture.debugElement,
                '#field-2bc275fb-e113-4d-7d-885f-6e74a7332d40-container section .adf-grid-list-single-column'
            ).map((element) => element.nativeElement);
            sectionGridElement.forEach((element) => {
                expect(element.style['width']).toBe('50%', 'Elemens is wrong sized for this section');
            });
            const fullWidthElement = UnitTestingUtils.getByCSS(
                fixture.debugElement,
                '#field-d52ada4e-cbdc-4f0c-a480-5b85fa00e4f8-container section.adf-grid-list-column-view .adf-grid-list-single-column'
            ).nativeElement;
            expect(fullWidthElement.style['width']).toBe('100%');
        });

        it('[C309872] - Should display Text widget spans on 2 columns when colspan is set to 2', () => {
            formRendererComponent.formDefinition = formService.parseForm(colspanForm.formRepresentation.formDefinition, null, false, false);
            fixture.detectChanges();

            const twoSpanTextWidgetContainerId = '#field-1ff21afc-7df4-4607-8363-1dc8576e1c8e-container';
            const oneSpanTextWidgetContainerId = '#field-f4285ad-g123-1a73-521d-7nm4a7231aul0-container';

            expectElementToBeVisible(fixture.debugElement, `${oneSpanTextWidgetContainerId} section.adf-grid-list-column-view`);
            const sectionGridElement = UnitTestingUtils.getAllByCSS(
                fixture.debugElement,
                `${oneSpanTextWidgetContainerId} section .adf-grid-list-single-column`
            ).map((element) => element.nativeElement);
            sectionGridElement.forEach((element) => {
                expect(element.style['width']).toBe('50%');
            });
            const fullWidthElement = UnitTestingUtils.getByCSS(
                fixture.debugElement,
                `${twoSpanTextWidgetContainerId} section.adf-grid-list-column-view .adf-grid-list-single-column`
            ).nativeElement;
            expect(fullWidthElement.style['width']).toBe('100%');
        });

        it('[C309655] - Should display validation error message when Number widget has invalid value', async () => {
            formRendererComponent.formDefinition = formService.parseForm(numberNotRequiredForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#Number0x8cbv');
            expectElementToBeValid(fixture.debugElement, 'Number0x8cbv');

            UnitTestingUtils.blurByCSS(fixture.debugElement, '#Number0x8cbv');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeInvalid(fixture.debugElement, 'Number0x8cbv');

            typeIntoInput(fixture.debugElement, '#Number0x8cbv', '5');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeValid(fixture.debugElement, 'Number0x8cbv');

            typeIntoInput(fixture.debugElement, '#Number0x8cbv', 'a');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeInvalid(fixture.debugElement, 'Number0x8cbv');
            let errorWidgetText = UnitTestingUtils.getByCSS(
                fixture.debugElement,
                '#field-Number0x8cbv-container error-widget .adf-error-text'
            ).nativeElement;
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.INVALID_NUMBER`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without mandatory field');

            typeIntoInput(fixture.debugElement, '#Number0x8cbv', '?');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeInvalid(fixture.debugElement, 'Number0x8cbv');
            errorWidgetText = UnitTestingUtils.getByCSS(
                fixture.debugElement,
                '#field-Number0x8cbv-container error-widget .adf-error-text'
            ).nativeElement;
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.INVALID_NUMBER`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without mandatory field');

            typeIntoInput(fixture.debugElement, '#Number0x8cbv', '-5');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeValid(fixture.debugElement, 'Number0x8cbv');
        });

        it('[C309660] - Should display validation error message when Number widget value is not respecting min max interval', async () => {
            formRendererComponent.formDefinition = formService.parseForm(numberMinMaxForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#Number0him2z');
            expectElementToBeValid(fixture.debugElement, 'Number0him2z');

            UnitTestingUtils.blurByCSS(fixture.debugElement, '#Number0him2z');
            typeIntoInput(fixture.debugElement, '#Number0him2z', '9');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeInvalid(fixture.debugElement, 'Number0him2z');
            let errorWidgetText = UnitTestingUtils.getByCSS(
                fixture.debugElement,
                '#field-Number0him2z-container error-widget .adf-error-text'
            ).nativeElement;
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.NOT_LESS_THAN`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without valid field');

            typeIntoInput(fixture.debugElement, '#Number0him2z', '10');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeValid(fixture.debugElement, 'Number0him2z');

            typeIntoInput(fixture.debugElement, '#Number0him2z', '60');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeValid(fixture.debugElement, 'Number0him2z');

            typeIntoInput(fixture.debugElement, '#Number0him2z', '61');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeInvalid(fixture.debugElement, 'Number0him2z');
            errorWidgetText = UnitTestingUtils.getByCSS(
                fixture.debugElement,
                '#field-Number0him2z-container error-widget .adf-error-text'
            ).nativeElement;
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without valid field');
        });

        it('[C309664] - Should be able to see Number widget when visibility condition refers to a form variable and a field', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberTextJson.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            const inputText = UnitTestingUtils.getByCSS(fixture.debugElement, '#Text').nativeElement;
            expect(inputText).not.toBeNull();
            expectElementToBeHidden(fixture.debugElement, '#field-NumberFieldValue-container');

            typeIntoInput(fixture.debugElement, '#Text', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-NumberFieldValue-container');

            typeIntoInput(fixture.debugElement, '#Text', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-NumberFieldValue-container');
        });

        it('[C309665] - Should be able to see Number widget when visibility condition refers to another field and form variable', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberTextJson.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            const inputText = UnitTestingUtils.getByCSS(fixture.debugElement, '#Text').nativeElement;
            expect(inputText).not.toBeNull();
            expectElementToBeHidden(fixture.debugElement, '#field-NumberFieldVariable-container');

            typeIntoInput(fixture.debugElement, '#Text', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-NumberFieldVariable-container');

            typeIntoInput(fixture.debugElement, '#Text', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-NumberFieldVariable-container');
        });

        it('[C309666] - Should be able to see Number widget when has multiple visibility conditions and next condition operators', async () => {
            formRendererComponent.formDefinition = formService.parseForm(numberWidgetVisibilityForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-Number0wxaur-container');

            typeIntoInput(fixture.debugElement, '#Text0hs0gt', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-Number0wxaur-container');

            typeIntoInput(fixture.debugElement, '#Text0hs0gt', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-Number0wxaur-container');

            typeIntoInput(fixture.debugElement, '#Text0cuqet', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-Number0wxaur-container');
            expectInputElementValueIs(fixture.debugElement, '#Text0hs0gt', 'bbb');

            typeIntoInput(fixture.debugElement, '#Text0hs0gt', 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            expectInputElementValueIs(fixture.debugElement, '#Text0hs0gt', 'aaa');
            expectInputElementValueIs(fixture.debugElement, '#Text0cuqet', 'aaa');
            expectElementToBeHidden(fixture.debugElement, '#field-Number0wxaur-container');
        });
    });

    describe('Text widget', () => {
        it('[C309669] - Should be able to set visibility conditions for Text widget', async () => {
            formRendererComponent.formDefinition = formService.parseForm(textWidgetVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#textOne');
            expectElementToBeHidden(fixture.debugElement, '#field-textThree-container');
            expectElementToBeHidden(fixture.debugElement, '#field-textTwo-container');
            expectElementToBeVisible(fixture.debugElement, '#field-textFour-container');

            typeIntoInput(fixture.debugElement, '#textOne', 'Test');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-textOne-container');
            expectElementToBeVisible(fixture.debugElement, '#field-textTwo-container');
            expectElementToBeVisible(fixture.debugElement, '#field-textThree-container');
            expectElementToBeHidden(fixture.debugElement, '#field-textFour-container');

            typeIntoInput(fixture.debugElement, '#textTwo', 'Test');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-textOne-container');
            expectElementToBeVisible(fixture.debugElement, '#field-textTwo-container');
            expectElementToBeVisible(fixture.debugElement, '#field-textFour-container');
            expectElementToBeHidden(fixture.debugElement, '#field-textThree-container');
        });
    });

    describe('Radio widget', () => {
        it('[C310352] - Should be able to set visibility conditions for Radio Button widget', async () => {
            formRendererComponent.formDefinition = formService.parseForm(radioWidgetVisibilityForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-Text0cee7g-container');
            expectElementToBeHidden(fixture.debugElement, '#field-Radiobuttons03rkbo-container');

            typeIntoInput(fixture.debugElement, '#Text0cee7g', 'Radio');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-Radiobuttons03rkbo-container');
        });
    });

    describe('Custom Widget', () => {
        it('Should be able to correctly display a custom process cloud widget', async () => {
            formRenderingService.register({ bananaforevah: () => TextWidgetComponent }, true);
            formRendererComponent.formDefinition = formService.parseForm(customWidgetForm.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#Text0vdi18');
            expectElementToBeVisible(fixture.debugElement, '#bananaforevah0k8gui');
        });

        it('Should be able to correctly use visibility in a custom process cloud widget ', async () => {
            formRenderingService.register({ bananaforevah: () => TextWidgetComponent }, true);
            formRendererComponent.formDefinition = formService.parseForm(customWidgetFormWithVisibility.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-bananaforevah0k8gui-container');
            typeIntoInput(fixture.debugElement, '#Text0vdi18', 'no');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-bananaforevah0k8gui-container');
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

            expectElementToBeVisible(fixture.debugElement, '#field-Text0id3ic-container');
            expectElementToBeVisible(fixture.debugElement, '#field-Number0yggl7-container');
            expectElementToBeHidden(fixture.debugElement, '#field-Amount0kceqc-container');

            typeIntoInput(fixture.debugElement, '#Text0id3ic', 'text1');
            typeIntoInput(fixture.debugElement, '#Number0yggl7', '77');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-Amount0kceqc-container');
        });
    });

    describe('Checkbox widget', () => {
        it('[C315208] - Should be possible to set the visibility conditions with Form fields for Checkbox Widget', async () => {
            formRendererComponent.formDefinition = formService.parseForm(checkboxWidgetFormVisibilityMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#field-Checkbox0pr51m-container');
            expectElementToBeVisible(fixture.debugElement, '#field-Checkbox0fp0zf-container');
            expectElementToBeHidden(fixture.debugElement, '#field-Checkbox0lb7ze-container');

            UnitTestingUtils.clickByCSS(fixture.debugElement, '#Checkbox0pr51m-input');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-Checkbox0lb7ze-container');

            UnitTestingUtils.clickByCSS(fixture.debugElement, '#Checkbox0fp0zf-input');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-Checkbox0lb7ze-container');
        });
    });

    describe('Multiline widget', () => {
        it('[C309670] - Should be able to set the Visibility Conditions of the Multiline Text Widget', async () => {
            formRendererComponent.formDefinition = formService.parseForm(multilineWidgetFormVisibilityMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#field-Text-container');
            expectElementToBeVisible(fixture.debugElement, '#field-MultilineTextId-container');

            typeIntoInput(fixture.debugElement, '#Text', 'textwrong');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-MultilineTextId-container');

            typeIntoInput(fixture.debugElement, '#Text', 'text');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-MultilineTextId-container');
        });
    });

    describe('Display Text (readonly) widget', () => {
        it('[C309868] - Should be able to see Display text widget when visibility condition refers to another field with specific value', async () => {
            formRendererComponent.formDefinition = formService.parseForm(displayTextWidgetFormVisibilityMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#field-Text0tzu53-container');
            expectElementToBeHidden(fixture.debugElement, '#field-Displaytext0q4w02-container');

            typeIntoInput(fixture.debugElement, '#Text0tzu53', 'aaa-value');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-Displaytext0q4w02-container');

            typeIntoInput(fixture.debugElement, '#Text0tzu53', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-Displaytext0q4w02-container');
        });

        it('[C309870] - Should be able to see Display text widget when visibility condition refers to another field and form variable', async () => {
            formRendererComponent.formDefinition = formService.parseForm(displayTextWidgetFormVisibilityMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeVisible(fixture.debugElement, '#field-Text0tzu53-container');
            expectElementToBeHidden(fixture.debugElement, '#field-Displaytext8bac2e-container');

            typeIntoInput(fixture.debugElement, '#Text0tzu53', 'aaa-variable');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeVisible(fixture.debugElement, '#field-Displaytext8bac2e-container');

            typeIntoInput(fixture.debugElement, '#Text0tzu53', 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeHidden(fixture.debugElement, '#field-Displaytext8bac2e-container');
        });
    });

    describe('Display Bigdecimal Widget', () => {
        it('should round decimal field value to correct precision', async () => {
            formRendererComponent.formDefinition = formService.parseForm(displayBigDecimalWidgetMock.formRepresentation.formDefinition);
            fixture.detectChanges();
            await fixture.whenStable();

            const decimalInputElement = UnitTestingUtils.getByCSS(fixture.debugElement, '#Decimal0tzu53').nativeElement;
            expect(decimalInputElement.value).toBeTruthy('10.12');
        });
    });
});
