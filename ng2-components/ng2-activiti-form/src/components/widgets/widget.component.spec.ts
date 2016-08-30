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

import { it, describe, expect, beforeEach } from '@angular/core/testing';
import { WidgetComponent } from './widget.component';
import { FormFieldModel } from './core/form-field.model';
import { FormModel } from './core/form.model';

describe('WidgetComponent', () => {

    let componentHandler;

    beforeEach(() => {
        componentHandler =  jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);

        window['componentHandler'] = componentHandler;
    });

    it('should upgrade MDL content on view init', () => {
        let component = new WidgetComponent();
        component.ngAfterViewInit();
        expect(componentHandler.upgradeAllRegistered).toHaveBeenCalled();
    });

    it('should setup MDL content only if component handler available', () => {
        let component = new WidgetComponent();
        expect(component.setupMaterialComponents()).toBeTruthy();

        window['componentHandler'] = null;
        expect(component.setupMaterialComponents()).toBeFalsy();
    });

    it('should check field', () => {
        let component = new WidgetComponent();

        expect(component.hasField()).toBeFalsy();
        component.field = new FormFieldModel(null);
        expect(component.hasField()).toBeTruthy();
    });

    it('should send an event after view init', (done) => {
        let component = new WidgetComponent();
        let fakeForm = new FormModel();
        let fakeField = new FormFieldModel(fakeForm, {id: 'fakeField', value: 'fakeValue'});
        component.field = fakeField;

        component.fieldChanged.subscribe(field => {
            expect(field).not.toBe(null);
            expect(field.id).toBe('fakeField');
            expect(field.value).toBe('fakeValue');
            done();
        });

        component.ngAfterViewInit();
    });

    it('should send an event when a field is changed', (done) => {
        let component = new WidgetComponent();
        let fakeForm = new FormModel();
        let fakeField = new FormFieldModel(fakeForm, {id: 'fakeField', value: 'fakeValue'});
        component.fieldChanged.subscribe(field => {
            expect(field).not.toBe(null);
            expect(field.id).toBe('fakeField');
            expect(field.value).toBe('fakeValue');
            done();
        });

        component.checkVisibility(fakeField);
    });
});
