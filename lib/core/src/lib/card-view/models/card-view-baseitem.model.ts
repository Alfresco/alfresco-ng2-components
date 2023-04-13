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

export abstract class CardViewBaseItemModel {
    label: string;
    value: any;
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

    constructor(cardViewItemProperties: CardViewItemProperties) {
        this.label = cardViewItemProperties.label || '';
        this.value = cardViewItemProperties.value && cardViewItemProperties.value.displayName || cardViewItemProperties.value;
        this.key = cardViewItemProperties.key;
        this.default = cardViewItemProperties.default;
        this.editable = !!cardViewItemProperties.editable;
        this.clickable = !!cardViewItemProperties.clickable;
        this.icon = cardViewItemProperties.icon || '';
        this.hint = cardViewItemProperties.hint || '';
        this.validators = cardViewItemProperties.validators || [];
        this.data = cardViewItemProperties.data || null;
        this.multivalued = !!cardViewItemProperties.multivalued;

        if (cardViewItemProperties?.constraints?.length ?? 0) {
            for (const constraint of cardViewItemProperties.constraints) {
                if (constraint.type !== 'LIST') {
                    this.validators.push(validatorsMap[constraint.type.toLowerCase()](constraint.parameters));
                }
            }
        }
    }

    isEmpty(): boolean {
        return this.value === undefined || this.value === null || this.value.length === 0;
    }

    isValid(newValue: any): boolean {
        if (!this.validators.length) {
            return true;
        }

        return this.validators
            .map((validator) => validator.isValid(newValue))
            .reduce((isValidUntilNow, isValid) => isValidUntilNow && isValid, true);
    }

    getValidationErrors(value): CardViewItemValidator[] {
        if (!this.validators.length) {
            return [];
        }

        return this.validators.filter((validator) => !validator.isValid(value)).map((validator) => validator);
    }
}
