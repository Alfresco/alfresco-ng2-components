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

export class CardViewItemIntValidator implements CardViewItemValidator {
    message = 'CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR';

    isValid(value: any | any[]): boolean {
        if (Array.isArray(value)) {
            return value.every(this.isIntegerNumber);
        }

        return value === '' || (!isNaN(value) && this.isIntegerNumber(value) && this.isNotOnlySpace(value));
    }

    isIntegerNumber(value: any): boolean {
        const parsedNumber = Number(value);
        return (parsedNumber | 0) === parsedNumber;
    }

    isNotOnlySpace(value: any): boolean {
        return String(value).trim() !== '';
    }
}
