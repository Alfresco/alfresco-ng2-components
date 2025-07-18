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
import { UnitTestingUtils } from '../../../testing';
import { FormRenderingService } from '../../services/form-rendering.service';
import { CheckboxWidgetComponent, FormFieldModel, FormFieldTypes, FormModel, TextWidgetComponent } from '../widgets';
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
});
