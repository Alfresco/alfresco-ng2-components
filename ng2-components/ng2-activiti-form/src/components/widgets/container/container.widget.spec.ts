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
import { ContainerWidget } from './container.widget';
import { FormModel } from './../core/form.model';
import { ContainerModel } from './../core/container.model';
import { FormFieldTypes } from './../core/form-field-types';
import { FormFieldModel } from './../core/form-field.model';

describe('ContainerWidget', () => {

    let componentHandler;

    beforeEach(() => {
        componentHandler =  jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);

        window['componentHandler'] = componentHandler;
    });

    it('should upgrade MDL content on view init', () => {
        let container = new ContainerWidget();
        container.ngAfterViewInit();
        expect(componentHandler.upgradeAllRegistered).toHaveBeenCalled();
    });

    it('should setup MDL content only if component handler available', () => {
        let container = new ContainerWidget();
        expect(container.setupMaterialComponents()).toBeTruthy();

        window['componentHandler'] = null;
        expect(container.setupMaterialComponents()).toBeFalsy();
    });

    it('should toggle underlying group container', () => {
        let container = new ContainerModel(new FormModel(), {
            type:  FormFieldTypes.GROUP,
            params: {
                allowCollapse: true
            }
        });

        let widget = new ContainerWidget();
        widget.content = container;

        expect(container.isExpanded).toBeTruthy();
        widget.onExpanderClicked();
        expect(container.isExpanded).toBeFalsy();
        widget.onExpanderClicked();
        expect(container.isExpanded).toBeTruthy();
    });

    it('should toggle only collapsible container', () => {
        let container = new ContainerModel(new FormModel(), {
            type:  FormFieldTypes.GROUP
        });

        let widget = new ContainerWidget();
        widget.content = container;

        expect(container.isExpanded).toBeTruthy();
        widget.onExpanderClicked();
        expect(container.isExpanded).toBeTruthy();
    });

    it('should toggle only group container', () => {
        let container = new ContainerModel(new FormModel(), {
            type:  FormFieldTypes.CONTAINER,
            params: {
                allowCollapse: true
            }
        });

        let widget = new ContainerWidget();
        widget.content = container;

        expect(container.isExpanded).toBeTruthy();
        widget.onExpanderClicked();
        expect(container.isExpanded).toBeTruthy();
    });

    it('should send an event when a value is changed in the form', (done) => {
        let widget = new ContainerWidget();
        let fakeForm = new FormModel();
        let fakeField = new FormFieldModel(fakeForm, {id: 'fakeField', value: 'fakeValue'});
        widget.formValueChanged.subscribe(field => {
            expect(field).not.toBe(null);
            expect(field.id).toBe('fakeField');
            expect(field.value).toBe('fakeValue');
            done();
        });

        widget.fieldChanged(fakeField);
    });

});
