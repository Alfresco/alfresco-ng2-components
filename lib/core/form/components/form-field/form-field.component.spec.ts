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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormRenderingService } from './../../services/form-rendering.service';
import { FormFieldModel, FormFieldTypes, FormModel } from './../widgets/core/index';
import { TextWidgetComponent, CheckboxWidgetComponent } from '../widgets/index';
import { FormFieldComponent } from './form-field.component';
import { setupTestBed } from '../../../testing/setup-test-bed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormBaseModule } from '../../form-base.module';
import { TranslationService } from '../../../services/translation.service';
import { TranslationMock } from '../../../mock/translation.service.mock';
import { TranslateStore } from '@ngx-translate/core';
import { formWithOneVisibleAndOneInvisibleFieldMock, formWithOneVisibleAndOneInvisibleTabMock } from '../mock/form-renderer.component.mock';

describe('FormFieldComponent', () => {

    let fixture: ComponentFixture<FormFieldComponent>;
    let component: FormFieldComponent;
    let form: FormModel;

    let formRenderingService: FormRenderingService;

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
        fixture = TestBed.createComponent(FormFieldComponent);
        component = fixture.componentInstance;
        formRenderingService = fixture.debugElement.injector.get(FormRenderingService);
        form = new FormModel();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should create default component instance', (done) => {
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.componentRef).toBeDefined();
            expect(component.componentRef.instance instanceof TextWidgetComponent).toBeTruthy();
            done();
        });
    });

    it('should create custom component instance', (done) => {
        formRenderingService.setComponentTypeResolver(FormFieldTypes.AMOUNT, () => CheckboxWidgetComponent, true);

        const field = new FormFieldModel(form, {
            type: FormFieldTypes.AMOUNT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.componentRef).toBeDefined();
            expect(component.componentRef.instance instanceof CheckboxWidgetComponent).toBeTruthy();
            done();
        });
    });

    it('should require component type to be resolved', (done) => {
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        spyOn(formRenderingService, 'resolveComponentType').and.returnValue(null);
        component.field = field;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(formRenderingService.resolveComponentType).toHaveBeenCalled();
            expect(component.componentRef).toBeUndefined();
            done();
        });
    });

    it('should hide the field when it is not visible', (done) => {
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;
        component.field.isVisible = false;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').hidden).toBeTruthy();
            done();
        });
    });

    it('should show the field when it is visible', (done) => {
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').hidden).toBeFalsy();
            done();
        });
    });

    it('should hide a visible element', () => {
        const field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').hidden).toBeFalsy();
        component.field.isVisible = false;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').hidden).toBeTruthy();
    });

    it('Should remove invisible field value from the form values', (done) => {
        const fakeFormWithField = new FormModel(formWithOneVisibleAndOneInvisibleFieldMock);
        const mockNameFiled = fakeFormWithField.getFormFields().find((field) => field.id === 'mockname');
        const mockMobileFiled = fakeFormWithField.getFormFields().find((field) => field.id === 'mockmobilenumber');

        expect(mockNameFiled.name).toBe('Mock Name', 'Visibile field');
        expect(mockMobileFiled.name).toBe('Mock Mobile Number', 'Invisible field');

        component.field = mockNameFiled;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.field.form.values).toEqual({ mockname: 'Mock value' });
            expect(component.field.form.values[mockNameFiled.id]).toBeDefined();
            expect(component.field.form.values[mockMobileFiled.id]).not.toBeDefined();
            done();
        });
    });

    it('Should remove invisible tab fields value from the form values', (done) => {
        const fakeFormWithTab = new FormModel(formWithOneVisibleAndOneInvisibleTabMock);

        const tabOneNameField = fakeFormWithTab.getFormFields().find((field) => field.id === 'mockname');
        const tabOneMobileField = fakeFormWithTab.getFormFields().find((field) => field.id === 'mockmobilenumber');

        const tabTwoAddressField = fakeFormWithTab.getFormFields().find((field) => field.id === 'mockaddress');
        const tabTwoEmailField = fakeFormWithTab.getFormFields().find((field) => field.id === 'mockemail');

        expect(tabOneNameField.name).toBe('Mock Name', 'Visibile field');
        expect(tabOneMobileField.name).toBe('Mock Mobile Number', 'Invisible field');

        expect(tabTwoEmailField.name).toBe('Mock Email', 'Invisible field');
        expect(tabTwoAddressField.name).toBe('Mock Address', 'Invisible field');

        component.field = tabOneNameField;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.field.form.values).toEqual({ mockname: null });
            expect(component.field.form.values[tabOneNameField.id]).toBeDefined();
            expect(component.field.form.values[tabOneMobileField.id]).not.toBeDefined();
            expect(component.field.form.values[tabTwoAddressField.id]).not.toBeDefined();
            expect(component.field.form.values[tabTwoEmailField.id]).not.toBeDefined();
            done();
        });
    });

    it('Should add tab invisible fields value to the form values if the tab get visible', (done) => {
        const fakeFormWithTab = new FormModel(formWithOneVisibleAndOneInvisibleTabMock);

        const tabOneNameField = fakeFormWithTab.getFormFields().find((field) => field.id === 'mockname');
        const tabOneMobileField = fakeFormWithTab.getFormFields().find((field) => field.id === 'mockmobilenumber');

        const tabTwoAddressField = fakeFormWithTab.getFormFields().find((field) => field.id === 'mockaddress');
        const tabTwoEmailField = fakeFormWithTab.getFormFields().find((field) => field.id === 'mockemail');

        expect(tabOneNameField.name).toBe('Mock Name', 'Visibile field');
        expect(tabOneMobileField.name).toBe('Mock Mobile Number', 'Invisible field');

        expect(tabTwoEmailField.name).toBe('Mock Email', 'Invisible field');
        expect(tabTwoAddressField.name).toBe('Mock Address', 'Invisible field');

        component.field = tabOneNameField;
        component.field.value = 'test';
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.field.form.values).toEqual({ mockname: 'test', mockmobilenumber: null, mockemail: null, mockaddress: null });
            done();
        });
    });

    it('[C213878] - Should fields be correctly rendered when filled with process variables', async () => {
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
        const hyperlink: HTMLLinkElement = fixture.nativeElement.querySelector('#field-label2-container hyperlink-widget a');
        expect(hyperlink).not.toBeNull();
        expect(hyperlink.href).toBe('http://testtest/');
        expect(hyperlink.textContent).toBe('testtest');
    });
});
