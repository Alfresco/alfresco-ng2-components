/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { setupTestBed } from '../../testing/setupTestBed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormRendererComponent } from './form-renderer.component';
import { FormBaseModule } from '../form-base.module';
import { formDisplayValueVisibility,
         formDisplayValueForm,
         formDisplayValueCombinedVisibility,
         formNumberWidgetVisibility,
         formNumberTextJson,
         formRequiredNumberWidget,
         colspanForm,
         numberNotRequiredForm,
         numberMinMaxForm } from './mock/form-renderer.component.mock';
import { TranslationService } from 'core/services';
import { TranslationMock } from 'core/mock';
import { TranslateStore } from '@ngx-translate/core';
import { FormService } from '../services/form.service';

function typeIntoInput(targetInput: HTMLInputElement, message: string ) {
    expect(targetInput).not.toBeNull('Expected input to set to be valid and not null');
    targetInput.value = message;
    targetInput.dispatchEvent(new Event('input'));
}

function expectElementToBeHidden(targetElement: HTMLElement): void {
    expect(targetElement).not.toBeNull();
    expect(targetElement).toBeDefined();
    expect(targetElement.hidden).toBe(true, `${targetElement.id} should be hidden but it is not`);
}

function expectElementToBeVisible(targetElement: HTMLElement): void {
    expect(targetElement).not.toBeNull();
    expect(targetElement).toBeDefined();
    expect(targetElement.hidden).toBe(false, `${targetElement.id} should be visibile but it is not`);
}

function expectInputElementValueIs(targetElement: HTMLInputElement, value: string): void {
    expect(targetElement).not.toBeNull();
    expect(targetElement).toBeDefined();
    expect(targetElement.value).toBe(value, `invalid value for ${targetElement.name}`);
}

function expectElementToBeInvalid(fieldId: string, fixture: ComponentFixture<FormRendererComponent>): void {
    const invalidElementContainer = fixture.nativeElement.querySelector(`#field-${fieldId}-container .adf-invalid`);
    expect(invalidElementContainer).not.toBeNull();
    expect(invalidElementContainer).toBeDefined();
}

function expectElementToBeValid(fieldId: string, fixture: ComponentFixture<FormRendererComponent>): void {
    const invalidElementContainer = fixture.nativeElement.querySelector(`#field-${fieldId}-container .adf-invalid`);
    expect(invalidElementContainer).toBeNull();
}

describe('Form Renderer Component', () => {

    let formRendererComponent: FormRendererComponent;
    let fixture: ComponentFixture<FormRendererComponent>;
    let formService: FormService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            FormBaseModule
        ],
        providers: [
            { provide: TranslationService, useClass: TranslationMock },
            TranslateStore
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormRendererComponent);
        formRendererComponent = fixture.componentInstance;
        formService = TestBed.get(FormService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Display Value Widget', () => {
        it('[C309862] - Should be able to see Display value widget when visibility condition refers to another field with specific value', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDisplayValueVisibility);
            fixture.detectChanges();
            await fixture.whenStable();

            let displayValueElementContainer: HTMLDivElement = fixture.nativeElement.querySelector('#field-Displayvalue0g6092-container');
            const formInputText: HTMLInputElement = fixture.nativeElement.querySelector('#Text0bq3ar');
            expectElementToBeHidden(displayValueElementContainer);
            typeIntoInput(formInputText, 'DisplayValue');
            fixture.detectChanges();
            await fixture.whenStable();

            displayValueElementContainer = fixture.nativeElement.querySelector('#field-Displayvalue0g6092-container');
            expectElementToBeVisible(displayValueElementContainer);
            const displayValueElement: HTMLInputElement = fixture.nativeElement.querySelector('#Displayvalue0g6092');
            expectInputElementValueIs(displayValueElement, 'No field selected');
        });

        it('[C309863] - Should be able to see Display value widget when visibility condition refers to a form variable and a field', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDisplayValueForm);
            fixture.detectChanges();
            await fixture.whenStable();
            let displayValueElementContainer: HTMLDivElement = fixture.nativeElement.querySelector('#field-DisplayValueOne-container');
            expectElementToBeHidden(displayValueElementContainer);

            const formInputText: HTMLInputElement = fixture.nativeElement.querySelector('#Text0howrc');
            typeIntoInput(formInputText, 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();

            displayValueElementContainer = fixture.nativeElement.querySelector('#field-DisplayValueOne-container');
            expectElementToBeVisible(displayValueElementContainer);
            const displayValueElement: HTMLInputElement = fixture.nativeElement.querySelector('#DisplayValueOne');
            expectInputElementValueIs(displayValueElement, 'No field selected');

            typeIntoInput(formInputText, 'aaab');
            fixture.detectChanges();
            await fixture.whenStable();
            displayValueElementContainer = fixture.nativeElement.querySelector('#field-DisplayValueOne-container');
            expectElementToBeHidden(displayValueElementContainer);
        });

        it('[C309864] - Should be able to see Display value widget when visibility condition refers to another field and form variable', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDisplayValueForm);
            fixture.detectChanges();
            await fixture.whenStable();
            let displayValueElementContainer: HTMLDivElement = fixture.nativeElement.querySelector('#field-DisplayValueVariableField-container');
            expectElementToBeHidden(displayValueElementContainer);

            const formInputText: HTMLInputElement = fixture.nativeElement.querySelector('#TextOne');
            typeIntoInput(formInputText, 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();

            displayValueElementContainer = fixture.nativeElement.querySelector('#field-DisplayValueVariableField-container');
            expectElementToBeVisible(displayValueElementContainer);
            const displayValueElement: HTMLInputElement = fixture.nativeElement.querySelector('#DisplayValueVariableField');
            expectInputElementValueIs(displayValueElement, 'No field selected');

            typeIntoInput(formInputText, 'aaab');
            fixture.detectChanges();
            await fixture.whenStable();
            displayValueElementContainer = fixture.nativeElement.querySelector('#field-DisplayValueVariableField-container');
            expectElementToBeHidden(displayValueElementContainer);
        });

        it('[C309865] - Should be able to see Display value widget when has multiple visibility conditions and next condition operators', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formDisplayValueCombinedVisibility);
            fixture.detectChanges();
            await fixture.whenStable();
            const textInputElement: HTMLInputElement = fixture.nativeElement.querySelector('#Text0bq3ar');
            const textTwoInputElement: HTMLInputElement = fixture.nativeElement.querySelector('#TextTwo');
            let displayValueHiddenContainer: HTMLDivElement = fixture.nativeElement.querySelector('#field-Displayvalue0g6092-container');
            expectElementToBeVisible(textInputElement);
            expectElementToBeVisible(textTwoInputElement);
            expectElementToBeHidden(displayValueHiddenContainer);

            typeIntoInput(textInputElement, 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            displayValueHiddenContainer = fixture.nativeElement.querySelector('#field-Displayvalue0g6092-container');
            expectInputElementValueIs(textInputElement, 'aaa');
            expectInputElementValueIs(textTwoInputElement, '');
            expectElementToBeVisible(displayValueHiddenContainer);

            typeIntoInput(textInputElement, 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            displayValueHiddenContainer = fixture.nativeElement.querySelector('#field-Displayvalue0g6092-container');
            expectInputElementValueIs(textInputElement, 'bbb');
            expectInputElementValueIs(textTwoInputElement, '');
            expectElementToBeHidden(displayValueHiddenContainer);

            typeIntoInput(textTwoInputElement, 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            displayValueHiddenContainer = fixture.nativeElement.querySelector('#field-Displayvalue0g6092-container');
            expectInputElementValueIs(textInputElement, 'bbb');
            expectInputElementValueIs(textTwoInputElement, 'aaa');
            expectElementToBeHidden(displayValueHiddenContainer);

            typeIntoInput(textInputElement, 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            displayValueHiddenContainer = fixture.nativeElement.querySelector('#field-Displayvalue0g6092-container');
            expectInputElementValueIs(textInputElement, 'aaa');
            expectInputElementValueIs(textTwoInputElement, 'aaa');
            expectElementToBeHidden(displayValueHiddenContainer);

            typeIntoInput(textTwoInputElement, 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            displayValueHiddenContainer = fixture.nativeElement.querySelector('#field-Displayvalue0g6092-container');
            expectInputElementValueIs(textInputElement, 'aaa');
            expectInputElementValueIs(textTwoInputElement, 'bbb');
            expectElementToBeVisible(displayValueHiddenContainer);
        });
    });

    describe('Number widget', () => {

        it('[C315169] - Should be able to complete a task with a form with number widgets', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberWidgetVisibility);
            fixture.detectChanges();
            await fixture.whenStable();

            let inputNumberOne = fixture.nativeElement.querySelector('#Number1');
            let inputNumber2Container = fixture.nativeElement.querySelector('#field-Number2-container');
            expectElementToBeVisible(inputNumberOne);
            expectElementToBeHidden(inputNumber2Container);
            expect(formRendererComponent.formDefinition.isValid).toBe(true, 'Form should be valid by default');

            typeIntoInput(inputNumberOne, '5');
            fixture.detectChanges();
            await fixture.whenStable();

            inputNumberOne = fixture.nativeElement.querySelector('#Number1');
            inputNumber2Container = fixture.nativeElement.querySelector('#field-Number2-container');
            expectElementToBeVisible(inputNumberOne);
            expectElementToBeVisible(inputNumber2Container);
            expect(formRendererComponent.formDefinition.isValid).toBe(true, 'Form should be valid with a valid value');

            typeIntoInput(inputNumberOne, 'az');
            fixture.detectChanges();
            await fixture.whenStable();

            inputNumberOne = fixture.nativeElement.querySelector('#Number1');
            inputNumber2Container = fixture.nativeElement.querySelector('#field-Number2-container');
            expectElementToBeVisible(inputNumberOne);
            expectElementToBeHidden(inputNumber2Container);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should be invalid with an invalid value');
        });

        it('[C309663] - Should be able to see Number widget when visibility condition refers to another field with specific value', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberTextJson);
            fixture.detectChanges();
            await fixture.whenStable();

            const textInput: HTMLInputElement = fixture.nativeElement.querySelector('#Text');
            let numberFieldContainer: HTMLDivElement = fixture.nativeElement.querySelector('#field-NumberFieldValue-container');
            expectElementToBeVisible(textInput);
            expectElementToBeHidden(numberFieldContainer);

            typeIntoInput(textInput, 'aaa');
            fixture.detectChanges();
            await fixture.whenStable();
            numberFieldContainer = fixture.nativeElement.querySelector('#field-NumberFieldValue-container');
            expectElementToBeVisible(numberFieldContainer);

            typeIntoInput(textInput, 'bbb');
            fixture.detectChanges();
            await fixture.whenStable();
            numberFieldContainer = fixture.nativeElement.querySelector('#field-NumberFieldValue-container');
            expectElementToBeHidden(numberFieldContainer);
        });

        it('[C315170] - Should be able to complete a task with a form with required number widgets', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formRequiredNumberWidget);
            fixture.detectChanges();
            await fixture.whenStable();

            const inputElementNumber: HTMLInputElement = fixture.nativeElement.querySelector('#Number1');
            let numberContainerElement: HTMLDivElement = fixture.nativeElement.querySelector('#field-Number2-container');
            expectElementToBeHidden(numberContainerElement);
            expectElementToBeVisible(inputElementNumber);

            typeIntoInput(inputElementNumber, '5');
            fixture.detectChanges();
            await fixture.whenStable();
            numberContainerElement = fixture.nativeElement.querySelector('#field-Number2-container');
            expectElementToBeVisible(numberContainerElement);

            typeIntoInput(inputElementNumber, '123');
            fixture.detectChanges();
            await fixture.whenStable();
            numberContainerElement = fixture.nativeElement.querySelector('#field-Number2-container');
            expectElementToBeHidden(numberContainerElement);
            const errorWidetText: HTMLDivElement = fixture.nativeElement.querySelector('#field-Number1-container error-widget .adf-error-text');
            expect(errorWidetText.textContent).toBe(`FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without mandatory field');
        });

        it('[C309653] - Should disable the save button when Number widget is required', async () => {
            formRendererComponent.formDefinition = formService.parseForm(formNumberTextJson);
            fixture.detectChanges();
            await fixture.whenStable();
            const numberRequired: HTMLInputElement = fixture.nativeElement.querySelector('#NumberReq');
            const numberNotRequired: HTMLInputElement = fixture.nativeElement.querySelector('#NumberNotReq');
            expectElementToBeVisible(numberRequired);
            expectElementToBeVisible(numberNotRequired);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should be invalid with an empty required value');

            typeIntoInput(numberNotRequired, '5');
            fixture.detectChanges();
            await fixture.whenStable();
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should be invalid with an empty required value');

            typeIntoInput(numberRequired, '5');
            typeIntoInput(numberNotRequired, '');
            fixture.detectChanges();
            await fixture.whenStable();
            expect(formRendererComponent.formDefinition.isValid).toBe(true, 'Form should be valid when required field are filled');
        });

        it('[C309654] - Should display Number widget spans on 2 columns when colspan is set to 2', async () => {
            formRendererComponent.formDefinition = formService.parseForm(colspanForm);
            fixture.detectChanges();
            await fixture.whenStable();
            const formSizedElement = fixture.nativeElement.querySelector('#field-2bc275fb-e113-4d7d-885f-6e74a7332d40-container section.adf-grid-list');
            expectElementToBeVisible(formSizedElement);
            const sectionGridElement: HTMLElement[] = fixture.nativeElement.querySelectorAll('#field-2bc275fb-e113-4d7d-885f-6e74a7332d40-container section .adf-grid-list-item');
            sectionGridElement.forEach((element) => {
                expect(element.style['width']).toBe('50%', 'Elemens is wrong sized for this section');
            });

            const fullWidthElement = fixture.nativeElement.querySelector('#field-d52ada4e-cbdc-4f0c-a480-5b85fa00e4f8-container section.adf-grid-list .adf-grid-list-item');
            expect(fullWidthElement.style['width']).toBe('100%');
        });

        it('[C309655] - Should display validation error message when Number widget has invalid value', async () => {
            formRendererComponent.formDefinition = formService.parseForm(numberNotRequiredForm);
            fixture.detectChanges();
            await fixture.whenStable();

            const numberInputRequired: HTMLInputElement = fixture.nativeElement.querySelector('#Number0x8cbv');
            expectElementToBeVisible(numberInputRequired);
            expectElementToBeInvalid('Number0x8cbv', fixture);

            typeIntoInput(numberInputRequired, '5');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeValid('Number0x8cbv', fixture);

            typeIntoInput(numberInputRequired, 'a');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeInvalid('Number0x8cbv', fixture);
            let errorWidgetText: HTMLDivElement = fixture.nativeElement.querySelector('#field-Number0x8cbv-container error-widget .adf-error-text');
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.INVALID_NUMBER`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without mandatory field');

            typeIntoInput(numberInputRequired, '?');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeInvalid('Number0x8cbv', fixture);
            errorWidgetText = fixture.nativeElement.querySelector('#field-Number0x8cbv-container error-widget .adf-error-text');
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.INVALID_NUMBER`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without mandatory field');

            typeIntoInput(numberInputRequired, '-5');
            fixture.detectChanges();
            await fixture.whenStable();
            expectElementToBeValid('Number0x8cbv', fixture);
        });

        it('[C309660] - Should display validation error message when Number widget value is not respecting min max interval', async () => {
            formRendererComponent.formDefinition = formService.parseForm(numberMinMaxForm);
            fixture.detectChanges();
            await fixture.whenStable();
            const numberInputElement: HTMLInputElement = fixture.nativeElement.querySelector('#Number0him2z');
            expectElementToBeVisible(numberInputElement);
            expectElementToBeValid('Number0him2z', fixture);

            typeIntoInput(numberInputElement, '9');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeInvalid('Number0him2z', fixture);
            let errorWidgetText = fixture.nativeElement.querySelector('#field-Number0him2z-container error-widget .adf-error-text');
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.NOT_LESS_THAN`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without valid field');

            typeIntoInput(numberInputElement, '10');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeValid('Number0him2z', fixture);

            typeIntoInput(numberInputElement, '60');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeValid('Number0him2z', fixture);

            typeIntoInput(numberInputElement, '61');
            fixture.detectChanges();
            await fixture.whenStable();

            expectElementToBeInvalid('Number0him2z', fixture);
            errorWidgetText = fixture.nativeElement.querySelector('#field-Number0him2z-container error-widget .adf-error-text');
            expect(errorWidgetText.textContent).toBe(`FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`);
            expect(formRendererComponent.formDefinition.isValid).toBe(false, 'Form should not be valid without valid field');
        });

    });
});
