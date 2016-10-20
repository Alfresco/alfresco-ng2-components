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

import { Observable } from 'rxjs/Rx';
import { TypeaheadWidget } from './typeahead.widget';
import { FormService } from '../../../services/form.service';
import { FormModel } from '../core/form.model';
import { FormFieldModel } from '../core/form-field.model';
import { FormFieldOption } from '../core/form-field-option';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FakeFormService } from './assets/formService.service.mock';
import { CoreModule } from 'ng2-alfresco-core';
// import { fakeFormJson } from '../../../services/assets/widget-visibility.service.mock';

describe('TypeaheadWidget', () => {

    let formService: FormService;
    let widget: TypeaheadWidget;

    beforeEach(() => {
        formService = new FormService(null, null);
        widget = new TypeaheadWidget(formService);
        widget.field = new FormFieldModel(new FormModel());
    });

    it('should request field values from service', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        let form = new FormModel({
            taskId: taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId
        });

        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.create(observer => {
            observer.next(null);
            observer.complete();
        }));
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalledWith(taskId, fieldId);
    });

    it('should handle error when requesting fields', () => {
        const err = 'Error';
        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.throw(err));
        spyOn(widget, 'handleError').and.callThrough();

        widget.ngOnInit();

        expect(formService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.handleError).toHaveBeenCalledWith(err);
    });

    it('should log error to console by default', () => {
        spyOn(console, 'error').and.stub();
        widget.handleError('Err');
        expect(console.error).toHaveBeenCalledWith('Err');
    });

    it('should show popup on key up', () => {

        spyOn(widget, 'getOptions').and.returnValue([{}, {}]);

        widget.minTermLength = 1;
        widget.value = 'some value';

        widget.popupVisible = false;
        widget.onKeyUp(null);
        expect(widget.popupVisible).toBeTruthy();
    });

    it('should require items to show popup', () => {
        widget.minTermLength = 1;
        widget.value = 'some value';

        widget.popupVisible = false;
        widget.onKeyUp(null);
        expect(widget.popupVisible).toBeFalsy();
    });

    it('should require value to show popup', () => {
        widget.minTermLength = 1;
        widget.value = '';

        widget.popupVisible = false;
        widget.onKeyUp(null);
        expect(widget.popupVisible).toBeFalsy();
    });

    it('should require value to be of min length to show popup', () => {
        spyOn(widget, 'getOptions').and.returnValue([{}, {}]);

        widget.minTermLength = 3;
        widget.value = 'v';

        // value less than constraint
        widget.popupVisible = false;
        widget.onKeyUp(null);
        expect(widget.popupVisible).toBeFalsy();

        // value satisfies constraint
        widget.value = 'value';
        widget.onKeyUp(null);
        expect(widget.popupVisible).toBeTruthy();

        // value gets less than allowed again
        widget.value = 'va';
        widget.onKeyUp(null);
        expect(widget.popupVisible).toBeFalsy();
    });

    it('should flush value on blur', (done) => {
        spyOn(widget, 'flushValue').and.stub();
        widget.onBlur();

        setTimeout(() => {
            expect(widget.flushValue).toHaveBeenCalled();
            done();
        }, 200);
    });

    it('should prevent default behaviour on option item click', () => {
        let event = jasmine.createSpyObj('event', ['preventDefault']);
        widget.onItemClick(null, event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should update values on option item click', () => {
        let option: FormFieldOption = <FormFieldOption> {
            id: '1',
            name: 'name'
        };

        widget.onItemClick(option, null);
        expect(widget.field.value).toBe(option.id);
        expect(widget.value).toBe(option.name);
    });

    it('should setup initial value', () => {
        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.create(observer => {
            observer.next([
                {id: '1', name: 'One'},
                {id: '2', name: 'Two'}
            ]);
            observer.complete();
        }));

        widget.field.value = '2';
        widget.ngOnInit();

        expect(formService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.value).toBe('Two');
    });

    it('should not setup initial value due to missing option', () => {
        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.create(observer => {
            observer.next([
                {id: '1', name: 'One'},
                {id: '2', name: 'Two'}
            ]);
            observer.complete();
        }));

        widget.field.value = '3';
        widget.ngOnInit();

        expect(formService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.value).toBeUndefined();
    });

    it('should setup field options on load', () => {
        let options: FormFieldOption[] = [
            {id: '1', name: 'One'},
            {id: '2', name: 'Two'}
        ];

        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.create(observer => {
            observer.next(options);
            observer.complete();
        }));

        widget.ngOnInit();
        expect(widget.field.options).toEqual(options);
    });

    it('should update form upon options setup', () => {
        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.create(observer => {
            observer.next([]);
            observer.complete();
        }));

        spyOn(widget.field, 'updateForm').and.callThrough();
        widget.ngOnInit();
        expect(widget.field.updateForm).toHaveBeenCalled();
    });

    it('should get filtered options', () => {
        let options: FormFieldOption[] = [
            {id: '1', name: 'Item one'},
            {id: '2', name: 'Item two'}
        ];
        widget.field.options = options;
        widget.value = 'tw';

        let filtered = widget.getOptions();
        expect(filtered.length).toBe(1);
        expect(filtered[0]).toEqual(options[1]);
    });

    it('should be case insensitive when filtering options', () => {
        let options: FormFieldOption[] = [
            {id: '1', name: 'Item one'},
            {id: '2', name: 'iTEM TWo'}
        ];
        widget.field.options = options;
        widget.value = 'tW';

        let filtered = widget.getOptions();
        expect(filtered.length).toBe(1);
        expect(filtered[0]).toEqual(options[1]);
    });

    it('should hide popup on flush', () => {
        widget.popupVisible = true;
        widget.flushValue();
        expect(widget.popupVisible).toBeFalsy();
    });

    it('should update form on value flush', () => {
        spyOn(widget.field, 'updateForm').and.callThrough();
        widget.flushValue();
        expect(widget.field.updateForm).toHaveBeenCalled();
    });

    it('should flush selected value', () => {
        let options: FormFieldOption[] = [
            {id: '1', name: 'Item one'},
            {id: '2', name: 'Item Two'}
        ];

        widget.field.options = options;
        widget.value = 'Item Two';
        widget.flushValue();

        expect(widget.value).toBe(options[1].name);
        expect(widget.field.value).toBe(options[1].id);
    });

    it('should be case insensitive when flushing value', () => {
        let options: FormFieldOption[] = [
            {id: '1', name: 'Item one'},
            {id: '2', name: 'iTEM TWo'}
        ];

        widget.field.options = options;
        widget.value = 'ITEM TWO';
        widget.flushValue();

        expect(widget.value).toBe(options[1].name);
        expect(widget.field.value).toBe(options[1].id);
    });

    it('should reset fields when flushing missing option value', () => {
        widget.field.options = [
            {id: '1', name: 'Item one'},
            {id: '2', name: 'Item two'}
        ];
        widget.value = 'Missing item';
        widget.flushValue();

        expect(widget.value).toBeNull();
        expect(widget.field.value).toBeNull();
    });

    it('should reset fields when flushing incorrect value', () => {
        widget.field.options = [
            {id: '1', name: 'Item one'},
            {id: '2', name: 'Item two'}
        ];
        widget.field.value = 'Item two';
        widget.value = 'Item two!';
        widget.flushValue();

        expect(widget.value).toBeNull();
        expect(widget.field.value).toBeNull();
    });

    it('should reset fields when flushing value having no options', () => {
        widget.field.options = null;
        widget.field.value = 'item 1';
        widget.value = 'new item';
        widget.flushValue();

        expect(widget.value).toBeNull();
        expect(widget.field.value).toBeNull();
    });

    it('should emit field change event on item click', () => {
        let event = jasmine.createSpyObj('event', ['preventDefault']);
        let fakeField = new FormFieldModel(new FormModel(), {id: 'fakeField', value: 'fakeValue'});
        widget.field = fakeField;
        let item = {id: 'fake-id-opt', name: 'fake-name-opt'};
        widget.onItemClick(item, event);

        widget.fieldChanged.subscribe((field) => {
            expect(field).toBeDefined();
            expect(field.id).toEqual('fakeField');
            expect(field.value).toEqual('fake-id-opt');
        });
    });

    it('should emit field change event on blur', (done) => {
        spyOn(widget, 'flushValue').and.stub();
        let fakeField = new FormFieldModel(new FormModel(), {id: 'fakeField', value: 'fakeValue'});
        widget.field = fakeField;
        widget.onBlur();

        setTimeout(() => {
            widget.fieldChanged.subscribe((field) => {
                expect(field).toBeDefined();
                expect(field.id).toEqual('field-id');
                expect(field.value).toEqual('field-value');
            });
            done();
        }, 200);
    });
});
