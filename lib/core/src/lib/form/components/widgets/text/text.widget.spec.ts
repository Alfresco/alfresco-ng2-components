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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldTypes } from '../core/form-field-types';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { TextWidgetComponent } from './text.widget';
import { setupTestBed } from '../../../../testing/setupTestBed';
import { CoreModule } from '../../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TextWidgetComponent', () => {

    let widget: TextWidgetComponent;
    let fixture: ComponentFixture<TextWidgetComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TextWidgetComponent);

        widget = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    describe('when template is ready', () => {

        describe('and no mask is configured on text element', () => {

            let inputElement: HTMLInputElement;

            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({taskId: 'fake-task-id'}), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: false
                });

                fixture.detectChanges();
                inputElement = <HTMLInputElement> element.querySelector('#text-id');
            });

            it('should raise ngModelChange event', async(() => {
                inputElement.value = 'TEXT';
                expect(widget.field.value).toBe('');
                inputElement.dispatchEvent(new Event('input'));
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(widget.field).not.toBeNull();
                    expect(widget.field.value).not.toBeNull();
                    expect(widget.field.value).toBe('TEXT');
                });
            }));

        });

        describe('and no mask is configured on text element', () => {

            let inputElement: HTMLInputElement;

            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({taskId: 'fake-task-id'}), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    type: FormFieldTypes.TEXT,
                    readOnly: true
                });

                fixture.detectChanges();
                inputElement = <HTMLInputElement> element.querySelector('#text-id');
            });

            it('should be disabled on readonly forms', async(() => {
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(inputElement).toBeDefined();
                    expect(inputElement).not.toBeNull();
                    expect(inputElement.disabled).toBeTruthy();
                });
            }));

        });

        describe('and mask is configured on text element', () => {

            let inputElement: HTMLInputElement;

            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({taskId: 'fake-task-id'}), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    params: {inputMask: '##-##0,00%'},
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    placeholder: 'simple placeholder'
                });

                fixture.detectChanges();
                inputElement = <HTMLInputElement> element.querySelector('#text-id');
            });

            it('should show text widget', () => {
                expect(element.querySelector('#text-id')).toBeDefined();
                expect(element.querySelector('#text-id')).not.toBeNull();
            });

            it('should show the field placeholder', () => {
                expect(inputElement).toBeDefined();
                expect(inputElement).not.toBeNull();
                expect(inputElement.placeholder).toBe('simple placeholder');
            });

            it('should show the field placeholder when clicked', async(() => {
                inputElement.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(inputElement).toBeDefined();
                    expect(inputElement).not.toBeNull();
                    expect(inputElement.placeholder).toBe('simple placeholder');
                });
            }));

            it('should prevent text to be written if is not allowed by the mask on keyUp event', async(() => {
                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = 'F';
                widget.field.value = 'F';
                const event: any = new Event('keyup');
                event.keyCode = '70';
                inputElement.dispatchEvent(event);
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    inputElement = <HTMLInputElement> element.querySelector('#text-id');
                    expect(inputElement.value).toBe('');
                });
            }));

            it('should prevent text to be written if is not allowed by the mask on input event', async(() => {
                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = 'F';
                widget.field.value = 'F';
                inputElement.dispatchEvent(new Event('input'));
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    inputElement = <HTMLInputElement> element.querySelector('#text-id');
                    expect(inputElement.value).toBe('');
                });
            }));

            it('should allow masked configured value on keyUp event', async(() => {
                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = '1';
                widget.field.value = '1';
                const event: any = new Event('keyup');
                event.keyCode = '49';
                inputElement.dispatchEvent(event);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    const textEle: HTMLInputElement = <HTMLInputElement> element.querySelector('#text-id');
                    expect(textEle.value).toBe('1');
                });
            }));

            it('should auto-fill masked configured value on keyUp event', async(() => {
                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = '12345678';
                widget.field.value = '12345678';
                const event: any = new Event('keyup');
                event.keyCode = '49';
                inputElement.dispatchEvent(event);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    const textEle: HTMLInputElement = <HTMLInputElement> element.querySelector('#text-id');
                    expect(textEle.value).toBe('12-345,67%');
                });
            }));
        });

        describe('when the mask is reversed ', () => {

            let inputElement: HTMLInputElement;

            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({taskId: 'fake-task-id'}), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    params: {existingColspan: 1, maxColspan: 2, inputMask: '#.##0,00%', inputMaskReversed: true},
                    type: FormFieldTypes.TEXT,
                    readOnly: false
                });

                fixture.detectChanges();
                inputElement = <HTMLInputElement> element.querySelector('#text-id');
            });

            afterEach(() => {
                fixture.destroy();
                TestBed.resetTestingModule();
            });

            it('should be able to apply the mask reversed', async(() => {
                expect(element.querySelector('#text-id')).not.toBeNull();

                inputElement.value = '1234';
                widget.field.value = '1234';
                const event: any = new Event('keyup');
                event.keyCode = '49';
                inputElement.dispatchEvent(event);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    const textEle: HTMLInputElement = <HTMLInputElement> element.querySelector('#text-id');
                    expect(textEle.value).toBe('12,34%');
                });
            }));
        });

        describe('and a mask placeholder is configured', () => {

            let inputElement: HTMLInputElement;

            beforeEach(() => {
                widget.field = new FormFieldModel(new FormModel({taskId: 'fake-task-id'}), {
                    id: 'text-id',
                    name: 'text-name',
                    value: '',
                    params: {inputMask: '##-##0,00%', inputMaskPlaceholder: 'Phone : (__) ___-___'},
                    type: FormFieldTypes.TEXT,
                    readOnly: false,
                    placeholder: 'simple placeholder'
                });

                fixture.detectChanges();
                inputElement = <HTMLInputElement> element.querySelector('#text-id');
            });

            it('should show the input mask placeholder', () => {
                expect(inputElement).toBeDefined();
                expect(inputElement).not.toBeNull();
                expect(inputElement.placeholder).toBe('Phone : (__) ___-___');
            });

            it('should show the input mask placeholder when clicked', async(() => {
                inputElement.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(inputElement).toBeDefined();
                    expect(inputElement).not.toBeNull();
                    expect(inputElement.placeholder).toBe('Phone : (__) ___-___');
                });
            }));
        });
    });
});
