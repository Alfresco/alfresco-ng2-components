/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export interface MatchValidatorParams {
    expression: string;
    flags?: string;
    requiresMatch?: boolean;
}

export class CardViewItemMatchValidator implements CardViewItemValidator {
    message = 'CORE.CARDVIEW.VALIDATORS.MATCH_VALIDATION_ERROR';

    constructor(private expression: string, private flags?: string, private requiresMatch?: boolean) { /* empty */ }

    isValid(value: string | string[]): boolean {
        const regex = new RegExp(this.expression, this?.flags);

        if (Array.isArray(value)) {
            return value.every((val) => (this.requiresMatch ? this.matchRegex(val, regex) : !this.matchRegex(val, regex)));
        }

        return value === '' || (this.requiresMatch ? this.matchRegex(value, regex) : !this.matchRegex(value, regex));
    }

    private matchRegex(value: string, regex: RegExp): boolean {
        return regex.test(value);
    }
}
