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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ValidateFormEvent,
        ValidateFormFieldEvent,
        ValidateDynamicTableRowEvent,
        FormFieldEvent,
        FormEvent,
        FormErrorEvent,
        ContentLinkModel,
        FormOutcomeEvent } from '..';

@Injectable({
    providedIn: 'root'
})
export class FormControlService {

    formFieldValueChanged = new Subject<FormFieldEvent>();
    validateForm = new Subject<ValidateFormEvent>();
    validateFormField = new Subject<ValidateFormFieldEvent>();
    validateDynamicTableRow = new Subject<ValidateDynamicTableRowEvent>();
    formEvents = new Subject<Event>();

    formLoaded = new Subject<FormEvent>();
    formDataRefreshed = new Subject<FormEvent>();
    taskCompleted = new Subject<FormEvent>();
    taskCompletedError = new Subject<FormErrorEvent>();
    taskSaved = new Subject<FormEvent>();
    taskSavedError = new Subject<FormErrorEvent>();
    formContentClicked = new Subject<ContentLinkModel>();
    executeOutcome = new Subject<FormOutcomeEvent>();

}
