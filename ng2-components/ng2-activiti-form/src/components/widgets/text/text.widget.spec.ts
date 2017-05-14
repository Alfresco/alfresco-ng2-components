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

import { TextWidget } from './text.widget';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { InputMaskDirective } from './text-mask.component';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { FormFieldTypes } from '../core/form-field-types';

describe('TextWidget', () => {

    let widget: TextWidget;
    let componentHandler;

    beforeEach(() => {
        widget = new TextWidget();

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);

        window['componentHandler'] = componentHandler;
    });

    describe('when template is ready', () => {
        let textWidget: TextWidget;
        let fixture: ComponentFixture<TextWidget>;
        let element: HTMLElement;
        let componentHandler;

        beforeEach(async(() => {
            componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
            window['componentHandler'] = componentHandler;
            TestBed.configureTestingModule({
                imports: [CoreModule],
                declarations: [TextWidget, InputMaskDirective]
            }).compileComponents().then(() => {
                fixture = TestBed.createComponent(TextWidget);
                textWidget = fixture.componentInstance;
                element = fixture.nativeElement;
            });
        }));

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        describe('and typeahead is populated via taskId', () => {

            beforeEach(() => {
                textWidget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    params: { inputMask: '##-##0,00%' },
                    type: FormFieldTypes.TEXT,
                    readOnly: false
                });
                textWidget.field.isVisible = true;
                fixture.detectChanges();
            });

            fit('should show visible typeahead widget', () => {
                expect(element.querySelector('#typeahead-id')).toBeDefined();
                expect(element.querySelector('#typeahead-id')).not.toBeNull();
            });

        });

    });

});
