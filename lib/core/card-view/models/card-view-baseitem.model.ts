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

import { CardViewItemProperties, CardViewItemValidator } from '../interfaces/card-view.interfaces';

export abstract class CardViewBaseItemModel {
    label: string;
    value: any;
    key: any;
    default: any;
    editable: boolean;
    clickable: boolean;
    icon?: string;
    validators?: CardViewItemValidator[];
    data?: any;

    constructor(obj: CardViewItemProperties) {
        this.label = obj.label || '';
        this.value = obj.value;
        this.key = obj.key;
        this.default = obj.default;
        this.editable = !!obj.editable;
        this.clickable = !!obj.clickable;
        this.icon = obj.icon || '';
        this.validators = obj.validators || [];
        this.data = obj.data || null;
    }

    isEmpty(): boolean {
        return this.value === undefined || this.value === null || this.value === '';
    }

    isValid(newValue: any): boolean {
        if (!this.validators.length) {
            return true;
        }

        return this.validators
            .map(validator => validator.isValid(newValue))
            .reduce((isValidUntilNow, isValid) => isValidUntilNow && isValid, true);
    }

    getValidationErrors(value): string[] {
        if (!this.validators.length) {
            return [];
        }

        return this.validators.filter(validator => !validator.isValid(value)).map(validator => validator.message);
    }
}
