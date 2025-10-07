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

import { CardViewItemPositiveIntValidator } from './card-view-item-only-positive-int.validator';

describe('CardViewItemPositiveIntValidator', () => {
    const validator = new CardViewItemPositiveIntValidator();

    it('should return false for invalid integer value', () => {
        expect(validator.isValid('a')).toBeFalse();
    });

    it('should return false for negative value', () => {
        expect(validator.isValid(-1)).toBeFalse();
    });

    it('should return true for positive value', () => {
        expect(validator.isValid(1)).toBeTrue();
    });

    it('should return true for empty value', () => {
        expect(validator.isValid('')).toBeTrue();
    });

    it('should work for negative string value', () => {
        expect(validator.isValid('-1')).toBeFalse();
    });

    it('should work for positive string value', () => {
        expect(validator.isValid('1')).toBeTrue();
    });

    it('should validate arrays', () => {
        expect(validator.isValid(['-1', 1])).toBeFalse();
        expect(validator.isValid(['1', 2])).toBeTrue();
    });
});
