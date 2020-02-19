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
import { formDisplayValueVisibility, formDisplayValueForm, formDisplayValueCombinedVisibility } from './mock/form-renderer.component.mock';
import { TranslationService } from 'core/services';
import { TranslationMock } from 'core/mock';
import { TranslateStore } from '@ngx-translate/core';
import { FormService } from '../services/form.service';

function typeIntoInput(targetInput: HTMLInputElement, message: string ) {
    expect(targetInput).not.toBeNull();
    targetInput.value = message;
    targetInput.dispatchEvent(new Event('input'));
}

function expectElementToBeHidden(targetElement: HTMLElement): void {
    expect(targetElement).not.toBeNull();
    expect(targetElement).toBeDefined();
    expect(targetElement.hidden).toBe(true);
}

function expectElementToBeVisible(targetElement: HTMLElement): void {
    expect(targetElement).not.toBeNull();
    expect(targetElement).toBeDefined();
    expect(targetElement.hidden).toBe(false);
}

function expectInputElementValueIs(targetElement: HTMLInputElement, value: string): void {
    expect(targetElement).not.toBeNull();
    expect(targetElement).toBeDefined();
    expect(targetElement.value).toBe(value);
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

    it('Should be able to see Display value widget when visibility condition refers to another field with specific value', async () => {
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

    it('Should be able to see Display value widget when visibility condition refers to a form variable and a field', async () => {
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

    it('Should be able to see Display value widget when visibility condition refers to another field and form variable', async () => {
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

    it('Should be able to see Display value widget when has multiple visibility conditions and next condition operators', async () => {
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
