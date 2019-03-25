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

});
