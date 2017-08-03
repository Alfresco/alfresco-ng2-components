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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdInputModule } from '@angular/material';
import { CoreModule } from 'ng2-alfresco-core';
import { ErrorWidgetComponent } from '../widgets/error/error.component';
import { FormRenderingService } from './../../services/form-rendering.service';
import { WidgetVisibilityService } from './../../services/widget-visibility.service';
import { CheckboxWidgetComponent } from './../widgets/checkbox/checkbox.widget';
import { FormFieldModel, FormFieldTypes, FormModel } from './../widgets/core/index';
import { InputMaskDirective } from './../widgets/text/text-mask.component';
import { TextWidgetComponent } from './../widgets/text/text.widget';
import { FormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {

    let fixture: ComponentFixture<FormFieldComponent>;
    let component: FormFieldComponent;
    let form: FormModel;

    let formRenderingService: FormRenderingService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                imports: [CoreModule,
                    MdInputModule
                ],
                declarations: [
                    FormFieldComponent,
                    TextWidgetComponent,
                    CheckboxWidgetComponent,
                    InputMaskDirective,
                    ErrorWidgetComponent],
                providers: [
                    FormRenderingService,
                    WidgetVisibilityService
                ]
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormFieldComponent);
        component = fixture.componentInstance;
        formRenderingService = fixture.debugElement.injector.get(FormRenderingService);
        form = new FormModel();
    });

    xit('should create default component instance', () => {
        let field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT
        });

        component.field = field;
        fixture.detectChanges();

        expect(component.componentRef).toBeDefined();
        expect(component.componentRef.componentType).toBe(TextWidgetComponent);
    });

    xit('should create custom component instance', () => {
        let field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT
        });

        formRenderingService.setComponentTypeResolver(FormFieldTypes.TEXT, () => CheckboxWidgetComponent, true);
        component.field = field;
        fixture.detectChanges();

        expect(component.componentRef).toBeDefined();
        expect(component.componentRef.componentType).toBe(CheckboxWidgetComponent);
    });

    it('should require component type to be resolved', () => {
        let field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT
        });

        spyOn(formRenderingService, 'resolveComponentType').and.returnValue(null);
        component.field = field;
        fixture.detectChanges();

        expect(formRenderingService.resolveComponentType).toHaveBeenCalled();
        expect(component.componentRef).toBeUndefined();
    });

});
