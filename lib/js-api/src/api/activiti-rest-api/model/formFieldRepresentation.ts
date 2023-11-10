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

import { ConditionRepresentation } from './conditionRepresentation';
import { LayoutRepresentation } from './layoutRepresentation';
import { OptionRepresentation } from './optionRepresentation';

export class FormFieldRepresentation {
    fieldType?: string;
    /* Child fields, when `fieldType` is set to `ContainerRepresentation` */
    fields?: { [key: string]: Array<FormFieldRepresentation> };
    className?: string;
    col?: number;
    colspan?: number;
    dateDisplayFormat?: string;
    hasEmptyValue?: boolean;
    id?: string;
    layout?: LayoutRepresentation;
    maxLength?: number;
    maxValue?: string;
    minLength?: number;
    minValue?: string;
    name?: string;
    optionType?: string;
    options?: OptionRepresentation[];
    overrideId?: boolean;
    params?: any;
    placeholder?: string;
    readOnly?: boolean;
    regexPattern?: string;
    required?: boolean;
    restIdProperty?: string;
    restLabelProperty?: string;
    restResponsePath?: string;
    restUrl?: string;
    row?: number;
    sizeX?: number;
    sizeY?: number;
    tab?: string;
    type?: string;
    value?: any;
    visibilityCondition?: ConditionRepresentation;

    constructor(input?: Partial<FormFieldRepresentation>) {
        if (input) {
            Object.assign(this, input);

            this.layout = input.layout ? new LayoutRepresentation(input.layout) : undefined;

            if (input.options) {
                this.options = input.options.map((item) => new OptionRepresentation(item));
            }

            this.visibilityCondition = input.visibilityCondition ? new ConditionRepresentation(input.visibilityCondition) : undefined;
        }
    }
}
