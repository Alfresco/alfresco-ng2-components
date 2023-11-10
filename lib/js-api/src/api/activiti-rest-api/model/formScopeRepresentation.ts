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

import { FormFieldRepresentation } from './formFieldRepresentation';
import { FormOutcomeRepresentation } from './formOutcomeRepresentation';

export class FormScopeRepresentation {
    description?: string;
    fieldVariables?: FormFieldRepresentation[];
    fields?: FormFieldRepresentation[];
    id?: number;
    name?: string;
    outcomes?: FormOutcomeRepresentation[];

    constructor(input?: Partial<FormScopeRepresentation>) {

        if (input) {
            Object.assign(this, input);
            if (input.fieldVariables) {
                this.fieldVariables = input.fieldVariables.map((item) => {
                    return new FormFieldRepresentation(item);
                });
            }
            if (input.fields) {
                this.fields = input.fields.map((item) => {
                    return new FormFieldRepresentation(item);
                });
            }
            if (input.outcomes) {
                this.outcomes = input.outcomes.map((item) => {
                    return new FormOutcomeRepresentation(item);
                });
            }
        }
    }

}
