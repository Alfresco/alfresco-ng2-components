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

export class CardViewItemLongValidator implements CardViewItemValidator {
    message = 'CORE.CARDVIEW.VALIDATORS.LONG_VALIDATION_ERROR';

    isValid(value: number | number[] | ''): boolean {
        if (Array.isArray(value)) {
            return value.every(this.isLongNumber);
        }

        return value === '' || (!isNaN(value) && this.isLongNumber(value) && this.isNotSpaceOnly(value));
    }

    private isLongNumber(value: number): boolean {
        const longNumber = Number(value);
        return Math.trunc(longNumber) === longNumber && longNumber >= Number.MIN_SAFE_INTEGER && longNumber <= Number.MAX_SAFE_INTEGER;
    }

    private isNotSpaceOnly(value: number): boolean {
        return String(value).trim() !== '';
    }
}
