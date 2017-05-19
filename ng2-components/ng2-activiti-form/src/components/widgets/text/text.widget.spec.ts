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
        let element: HTMLInputElement;
        let componentHandler;

        beforeEach(async(() => {
            componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
            window['componentHandler'] = componentHandler;
        }));

        beforeEach(async(() => {
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

        describe('and mask is configured on text element', () => {

            let inputElement: HTMLInputElement;

            beforeEach(() => {
                textWidget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    params: { inputMask: '##-##0,00%' },
                    type: FormFieldTypes.TEXT,
                    readOnly: false
                });

                fixture.detectChanges();
                inputElement = <HTMLInputElement>element.querySelector('#text-id');
            });

            it('should show text widget', () => {
                expect(element.querySelector('#text-id')).toBeDefined();
                expect(element.querySelector('#text-id')).not.toBeNull();
            });

            it('should prevent text to be written if is not allowed by the mask on keyUp event', async(() => {
                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = 'F';
                textWidget.field.value = 'F';
                let event: any = new Event('keyup');
                event.keyCode = '70';
                inputElement.dispatchEvent(event);
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    inputElement = <HTMLInputElement>element.querySelector('#text-id');
                    expect(inputElement.value).toBe('');
                });
            }));

            it('should prevent text to be written if is not allowed by the mask on input event', async(() => {
                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = 'F';
                textWidget.field.value = 'F';
                inputElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    inputElement = <HTMLInputElement>element.querySelector('#text-id');
                    expect(inputElement.value).toBe('');
                });
            }));

            it('should allow masked configured value on keyUp event', async(() => {
                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = '1';
                textWidget.field.value = '1';
                let event: any = new Event('keyup');
                event.keyCode = '49';
                inputElement.dispatchEvent(event);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let inputElement: HTMLInputElement = <HTMLInputElement>element.querySelector('#text-id');
                    expect(inputElement.value).toBe('1');
                });
            }));

            it('should autofill masked configured value on keyUp event', async(() => {
                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = '12345678';
                textWidget.field.value = '12345678';
                let event: any = new Event('keyup');
                event.keyCode = '49';
                inputElement.dispatchEvent(event);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let inputElement: HTMLInputElement = <HTMLInputElement>element.querySelector('#text-id');
                    expect(inputElement.value).toBe('12-345,67%');
                });
            }));
        });

        describe('when the mask is reversed ', () => {

            let inputElement: HTMLInputElement;

            beforeEach(() => {
                textWidget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    params: { existingColspan: 1, maxColspan: 2, inputMask: "#.##0,00%", inputMaskReversed: true },
                    type: FormFieldTypes.TEXT,
                    readOnly: false
                });

                fixture.detectChanges();
                inputElement = <HTMLInputElement>element.querySelector('#text-id');
            });

            afterEach(() => {
                fixture.destroy();
                TestBed.resetTestingModule();
            });

            it('should be able to apply the mask reversed', async(() => {
                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = '1234';
                textWidget.field.value = '1234';
                let event: any = new Event('keyup');
                event.keyCode = '49';
                inputElement.dispatchEvent(event);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let inputElement: HTMLInputElement = <HTMLInputElement>element.querySelector('#text-id');
                    expect(inputElement.value).toBe('12,34%');
                });
            }));
        });
    });

});
