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

import { CardViewItemMinMaxValidator } from './card-view-item-minmax.validator';

describe('CardViewItemMinMaxValidator', () => {
    const validator = new CardViewItemMinMaxValidator(1, 3);

    it('should validate empty value', () => {
        expect(validator.isValid('')).toBeTrue();
    });

    it('should validate correct value', () => {
        expect(validator.isValid(1)).toBeTrue();
    });

    it('should not validate value below min', () => {
        expect(validator.isValid(-1)).toBeFalse();
    });

    it('should not validate value above max', () => {
        expect(validator.isValid(4)).toBeFalse();
    });

    it('should validate arrays', () => {
        expect(validator.isValid([2, 3])).toBeTrue();
        expect(validator.isValid([1, 0])).toBeFalse();
    });
});
