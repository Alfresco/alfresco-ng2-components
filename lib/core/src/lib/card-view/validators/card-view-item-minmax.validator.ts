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
import { CardViewItemIntValidator } from './card-view-item-int.validator';

export interface MinMaxValidatorParams {
    minValue: number;
    maxValue: number;
}

export class CardViewItemMinMaxValidator implements CardViewItemValidator {
    message = 'CORE.CARDVIEW.VALIDATORS.MINMAX_VALIDATION_ERROR';
    private intValidator: CardViewItemIntValidator;

    constructor(private minValue: number, private maxValue: number) {
        this.intValidator = new CardViewItemIntValidator();
    }

    isValid(value: number | number[] | ''): boolean {
        if (Array.isArray(value)) {
            return value.every((val) => this.isInRange(val, this.minValue, this.maxValue));
        }

        return value === '' || (this.intValidator.isValid(value) && this.isInRange(value, this.minValue, this.maxValue));
    }

    private isInRange(value: number, min: number, max: number): boolean {
        return value >= min && value <= max;
    }
}
