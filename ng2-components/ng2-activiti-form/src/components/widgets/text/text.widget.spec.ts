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

import { ElementRef } from '@angular/core';
import { TextWidget } from './text.widget';
import { FormFieldModel } from './../core/form-field.model';
import { FormFieldTypes } from '../core/form-field-types';

describe('TextWidget', () => {

    let widget: TextWidget;
    let elementRef: ElementRef;
    let componentHandler;

    beforeEach(() => {
        elementRef = new ElementRef(null);
        widget = new TextWidget(elementRef);

        componentHandler =  jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);

        window['componentHandler'] = componentHandler;
    });

    it('should upgrade material textfield', () => {
        spyOn(widget, 'setupMaterialTextField').and.stub();

        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.TEXT,
            value: '<text>'
        });
        widget.ngAfterViewInit();
        expect(widget.setupMaterialTextField).toHaveBeenCalled();
    });

    it('should require mdl component handler to setup textfield', () => {
        expect(widget.setupMaterialComponents(null)).toBeFalsy();
    });

    it('should require element reference to setup textfield', () => {
        widget = new TextWidget(null);
        expect(widget.setupMaterialComponents(componentHandler)).toBeFalsy();
    });

    it('should require field value to setup textfield', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.TEXT,
            value: null
        });
        expect(widget.setupMaterialComponents(componentHandler)).toBeFalsy();
    });

});
