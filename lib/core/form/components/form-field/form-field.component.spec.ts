/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { setupTestBed } from '../../../testing/setupTestBed';
import { CoreModule } from '../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FormFieldComponent', () => {

    let fixture: ComponentFixture<FormFieldComponent>;
    let component: FormFieldComponent;
    let form: FormModel;

    let formRenderingService: FormRenderingService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
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

    it('should create default component instance', () => {
        let field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;
        fixture.detectChanges();

        expect(component.componentRef).toBeDefined();
        expect(component.componentRef.componentType).toBe(TextWidgetComponent);
    });

    it('should create custom component instance', () => {
        let field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        formRenderingService.setComponentTypeResolver(FormFieldTypes.TEXT, () => CheckboxWidgetComponent, true);
        component.field = field;
        fixture.detectChanges();

        expect(component.componentRef).toBeDefined();
        expect(component.componentRef.componentType).toBe(CheckboxWidgetComponent);
    });

    it('should require component type to be resolved', () => {
        let field = new FormFieldModel(form, {
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
        let field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;
        component.field.isVisible = false;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').hidden).toBeTruthy();
    });

    it('should show the field when it is visible', () => {
        let field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT,
            id: 'FAKE-TXT-WIDGET'
        });

        component.field = field;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('#field-FAKE-TXT-WIDGET-container').hidden).toBeFalsy();
    });

    it('should hide a visible element', () => {
        let field = new FormFieldModel(form, {
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

});
