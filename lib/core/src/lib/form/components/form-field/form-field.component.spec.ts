/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { FormRenderingService } from '../../services/form-rendering.service';
import { FormFieldModel, FormFieldTypes, FormModel } from '../widgets/core';
import { TextWidgetComponent, CheckboxWidgetComponent } from '../widgets';
import { FormFieldComponent } from './form-field.component';
import { setupTestBed } from '../../../testing/setup-test-bed';
import { FormBaseModule } from '../../form-base.module';
import { CoreTestingModule } from '../../../testing';
import { TranslateModule } from '@ngx-translate/core';

describe('FormFieldComponent', () => {

    let fixture: ComponentFixture<FormFieldComponent>;
    let component: FormFieldComponent;
    let form: FormModel;

    let formRenderingService: FormRenderingService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            FormBaseModule
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
            const debugElement = fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').style;
            expect(debugElement.visibility).toEqual('hidden');
            expect(debugElement.display).toEqual('none');
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
            expect(fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').style.visibility).toEqual('visible');
            expect(fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').style.display).toEqual('block');
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
        expect(fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').style.visibility).toEqual('visible');
        expect(fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').style.display).toEqual('block');
        component.field.isVisible = false;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').style.visibility).toEqual('hidden');
        expect(fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').style.display).toEqual('none');
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
