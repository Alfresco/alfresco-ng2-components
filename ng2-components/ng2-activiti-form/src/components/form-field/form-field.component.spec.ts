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

import { CoreModule } from 'ng2-alfresco-core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';
import { FormRenderingService } from './../../services/form-rendering.service';
import { FormModel, FormFieldModel, FormFieldTypes } from './../widgets/core/index';
import { TextWidget } from './../widgets/text/text.widget';
import { InputMaskDirective } from './../widgets/text/text-mask.component';
import { CheckboxWidget } from './../widgets/checkbox/checkbox.widget';
import { WidgetVisibilityService } from './../../services/widget-visibility.service';

describe('FormFieldComponent', () => {

    let fixture: ComponentFixture<FormFieldComponent>;
    let component: FormFieldComponent;
    let componentHandler: any;
    let form: FormModel;

    let formRenderingService: FormRenderingService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                imports: [CoreModule],
                declarations: [FormFieldComponent, TextWidget, CheckboxWidget, InputMaskDirective],
                providers: [
                    FormRenderingService,
                    WidgetVisibilityService
                ]
            })
            .compileComponents();
    }));

    beforeEach(() => {
        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;

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
        expect(component.componentRef.componentType).toBe(TextWidget);
    });

    xit('should create custom component instance', () => {
        let field = new FormFieldModel(form, {
            type: FormFieldTypes.TEXT
        });

        formRenderingService.setComponentTypeResolver(FormFieldTypes.TEXT, () => CheckboxWidget, true);
        component.field = field;
        fixture.detectChanges();

        expect(component.componentRef).toBeDefined();
        expect(component.componentRef.componentType).toBe(CheckboxWidget);
    });

    it('should require field to create component', () => {
        component.field = null;
        fixture.detectChanges();

        expect(component.componentRef).toBeUndefined();
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
