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

import { CardViewItemProperties, CardViewItemValidator } from '../interfaces/card-view.interfaces';
import validatorsMap from '../validators/validators.map';

export abstract class CardViewBaseItemModel<T = any> {
    label: string;
    value: T;
    key: any;
    default: any;
    editable: boolean;
    clickable: boolean;
    icon?: string;
    hint?: string;
    validators?: CardViewItemValidator[];
    data?: any;
    type?: string;
    multivalued?: boolean;

    constructor(props: CardViewItemProperties) {
        this.label = props.label || '';
        this.value = props.value?.displayName || props.value;
        this.key = props.key;
        this.default = props.default;
        this.editable = !!props.editable;
        this.clickable = !!props.clickable;
        this.icon = props.icon || '';
        this.hint = props.hint || '';
        this.validators = props.validators || [];
        this.data = props.data || null;
        this.multivalued = !!props.multivalued;

        if (props?.constraints?.length ?? 0) {
            for (const constraint of props.constraints) {
                if (constraint.type !== 'LIST') {
                    this.validators.push(validatorsMap[constraint.type.toLowerCase()](constraint.parameters));
                }
            }
        }
    }

    isEmpty(): boolean {
        return (
            this.value === undefined ||
            this.value === null ||
            (typeof this.value === 'string' && this.value.length === 0) ||
            (Array.isArray(this.value) && this.value.length === 0)
        );
    }

    isValid(newValue: T): boolean {
        if (!this.validators.length) {
            return true;
        }

        return this.validators.map((validator) => validator.isValid(newValue)).reduce((isValidUntilNow, isValid) => isValidUntilNow && isValid, true);
    }

    getValidationErrors(value: T): CardViewItemValidator[] {
        if (!this.validators.length) {
            return [];
        }

        return this.validators.filter((validator) => !validator.isValid(value)).map((validator) => validator);
    }
}
