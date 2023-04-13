/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ContentLinkModel } from '../components/widgets/core/content-link.model';
import { FormOutcomeEvent } from '../components/widgets/core/form-outcome-event.model';
import { FormValues } from '../components/widgets/core/form-values';
import { FormModel } from '../components/widgets/core/form.model';
import { FormOutcomeModel } from '../components/widgets/core/form-outcome.model';
import { FormEvent } from '../events/form.event';
import { FormFieldEvent } from '../events/form-field.event';
import { FormErrorEvent } from '../events/form-error.event';
import { ValidateFormEvent } from '../events/validate-form.event';
import { ValidateFormFieldEvent } from '../events/validate-form-field.event';
import { FormValidationService } from './form-validation-service.interface';
import { FormRulesEvent } from '../events/form-rules.event';

@Injectable({
    providedIn: 'root'
})
export class FormService implements FormValidationService {

    formLoaded = new Subject<FormEvent>();
    formDataRefreshed = new Subject<FormEvent>();
    formFieldValueChanged = new Subject<FormFieldEvent>();
    formEvents = new Subject<Event>();
    taskCompleted = new Subject<FormEvent>();
    taskCompletedError = new Subject<FormErrorEvent>();
    taskSaved = new Subject<FormEvent>();
    taskSavedError = new Subject<FormErrorEvent>();
    formContentClicked = new Subject<ContentLinkModel>();

    validateForm = new Subject<ValidateFormEvent>();
    validateFormField = new Subject<ValidateFormFieldEvent>();
    validateDynamicTableRow = new Subject<FormFieldEvent>();

    executeOutcome = new Subject<FormOutcomeEvent>();

    updateFormValuesRequested = new Subject<FormValues>();

    formRulesEvent = new Subject<FormRulesEvent>();

    constructor() {
    }

    /**
     * Parses JSON data to create a corresponding Form model.
     *
     * @param json JSON to create the form
     * @param data Values for the form fields
     * @param readOnly Should the form fields be read-only?
     * @param fixedSpace
     * @returns Form model created from input data
     */
    parseForm(json: any, data?: FormValues, readOnly: boolean = false, fixedSpace?: boolean): FormModel {
        if (json) {
            const form = new FormModel(json, data, readOnly, this, fixedSpace);
            if (!json.fields) {
                form.outcomes = [
                    new FormOutcomeModel(form, {
                        id: '$save',
                        name: FormOutcomeModel.SAVE_ACTION,
                        isSystem: true
                    })
                ];
            }
            return form;
        }
        return null;
    }
}
