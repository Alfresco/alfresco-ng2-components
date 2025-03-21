/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { CardViewItemValidator } from '../interfaces/card-view.interfaces';

export interface LengthValidatorParams {
    minLength: number;
    maxLength: number;
}

export class CardViewItemLengthValidator implements CardViewItemValidator {
    message = 'CORE.CARDVIEW.VALIDATORS.LENGTH_VALIDATION_ERROR';

    constructor(private minLength: number, private maxLength: number) {}

    isValid(value: string | string[]): boolean {
        if (Array.isArray(value)) {
            return value.every((val) => this.isCorrectLength(val, this.minLength, this.maxLength));
        }

        return value === '' || this.isCorrectLength(value, this.minLength, this.maxLength);
    }

    private isCorrectLength(value: string, min: number, max: number): boolean {
        const length = value.length;
        return length >= min && length <= max;
    }
}
