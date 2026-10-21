/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { hasLength, isBlank, isRecord } from './form-value-guards';

describe('form value guards', () => {
    it('should tell an object with properties from no value, a list or a primitive', () => {
        expect(isRecord({ id: 'IT' })).toBeTrue();
        expect(isRecord({})).toBeTrue();
        expect(isRecord(null)).toBeFalse();
        expect(isRecord(['IT'])).toBeFalse();
        expect(isRecord('IT')).toBeFalse();
        expect(isRecord(5)).toBeFalse();
    });

    it('should tell a list or text with at least one item', () => {
        expect(hasLength(['file'])).toBeTrue();
        expect(hasLength('text')).toBeTrue();
        expect(hasLength([])).toBeFalse();
        expect(hasLength('')).toBeFalse();
        expect(hasLength(null)).toBeFalse();
        expect(hasLength(5)).toBeFalse();
        expect(hasLength({ length: 2 })).toBeFalse();
    });

    it('should tell no value or an empty text from any other value, falsy ones included', () => {
        expect(isBlank(null)).toBeTrue();
        expect(isBlank(undefined)).toBeTrue();
        expect(isBlank('')).toBeTrue();
        expect(isBlank(' ')).toBeFalse();
        expect(isBlank(0)).toBeFalse();
        expect(isBlank(false)).toBeFalse();
        expect(isBlank([])).toBeFalse();
    });
});
