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
import { Observable } from 'rxjs/Rx';
import { FormService } from '../../../services/form.service';
import { RadioButtonsWidget } from './radio-buttons.widget';
import { FormModel } from './../core/form.model';
import { FormFieldModel } from './../core/form-field.model';

describe('RadioButtonsWidget', () => {

    let formService: FormService;
    let widget: RadioButtonsWidget;

    beforeEach(() => {
        formService = new FormService(null, null);
        widget = new RadioButtonsWidget(formService);
        widget.field = new FormFieldModel(new FormModel(), { restUrl: '<url>' });
    });

    it('should request field values from service', () => {
        const taskId = '<form-id>';
        const fieldId = '<field-id>';

        let form = new FormModel({
            taskId: taskId
        });

        widget.field = new FormFieldModel(form, {
            id: fieldId,
            restUrl: '<url>'
        });

        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.create(observer => {
            observer.next(null);
            observer.complete();
        }));
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalledWith(taskId, fieldId);
    });

    it('should update form on values fetched', () => {
        let form = widget.field;
        spyOn(form, 'updateForm').and.stub();

        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.create(observer => {
            observer.next(null);
            observer.complete();
        }));
        widget.ngOnInit();
        expect(form.updateForm).toHaveBeenCalled();
    });

    it('should require field with rest URL to fetch data', () => {
        spyOn(formService, 'getRestFieldValues').and.returnValue(Observable.create(observer => {
            observer.next(null);
            observer.complete();
        }));

        let field = widget.field;
        widget.field = null;
        widget.ngOnInit();
        expect(formService.getRestFieldValues).not.toHaveBeenCalled();
        widget.field = field;

        widget.field.restUrl = null;
        widget.ngOnInit();
        expect(formService.getRestFieldValues).not.toHaveBeenCalled();

        widget.field.restUrl = '<url>';
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalled();
    });

    it('should log error to console by default', () => {
        spyOn(console, 'error').and.stub();
        widget.handleError('Err');
        expect(console.error).toHaveBeenCalledWith('Err');
    });

});
