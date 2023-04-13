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

import { Subject } from 'rxjs';
import { FormFieldEvent } from '../events/form-field.event';
import { ValidateFormFieldEvent } from '../events/validate-form-field.event';
import { ValidateFormEvent } from '../events/validate-form.event';

export interface FormValidationService {
    formFieldValueChanged: Subject<FormFieldEvent>;
    validateForm: Subject<ValidateFormEvent>;
    validateFormField: Subject<ValidateFormFieldEvent>;
}
