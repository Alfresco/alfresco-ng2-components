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

import { FieldValueInfo } from './fieldValueInfo';
import { FormFieldRepresentation } from './formFieldRepresentation';
import { FormJavascriptEventRepresentation } from './formJavascriptEventRepresentation';
import { FormOutcomeRepresentation } from './formOutcomeRepresentation';
import { FormTabRepresentation } from './formTabRepresentation';
import { FormVariableRepresentation } from './formVariableRepresentation';

export class FormDefinitionRepresentation {
    className?: string;
    customFieldTemplates?: { [key: string]: string };
    customFieldsValueInfo?: { [key: string]: FieldValueInfo };
    fields?: FormFieldRepresentation[];
    globalDateFormat?: string;
    gridsterForm?: boolean;
    id?: number;
    javascriptEvents?: FormJavascriptEventRepresentation[];
    metadata?: { [key: string]: string };
    name?: string;
    outcomeTarget?: string;
    outcomes?: FormOutcomeRepresentation[];
    processDefinitionId?: string;
    processDefinitionKey?: string;
    processDefinitionName?: string;
    selectedOutcome?: string;
    style?: string;
    tabs?: FormTabRepresentation[];
    taskDefinitionKey?: string;
    taskId?: string;
    taskName?: string;
    variables?: FormVariableRepresentation[];

    constructor(input?: Partial<FormDefinitionRepresentation>) {
        if (input) {
            Object.assign(this, input);
            if (input.fields) {
                this.fields = input.fields.map((item) => new FormFieldRepresentation(item));
            }
            if (input.javascriptEvents) {
                this.javascriptEvents = input.javascriptEvents.map((item) => new FormJavascriptEventRepresentation(item));
            }
            if (input.outcomes) {
                this.outcomes = input.outcomes.map((item) => new FormOutcomeRepresentation(item));
            }
            if (input.tabs) {
                this.tabs = input.tabs.map((item) => new FormTabRepresentation(item));
            }
            if (input.variables) {
                this.variables = input.variables.map((item) => new FormVariableRepresentation(item));
            }
        }
    }
}
