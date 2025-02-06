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

import { CardViewItemLengthValidator } from './card-view-item-length.validator';

describe('CardViewItemLengthValidator', () => {
    const validator = new CardViewItemLengthValidator(2, 3);

    it('should validate empty value', () => {
        expect(validator.isValid('')).toBeTrue();
    });

    it('should validate correct value', () => {
        expect(validator.isValid('12')).toBeTrue();
    });

    it('should not validate too short value', () => {
        expect(validator.isValid('1')).toBeFalse();
    });

    it('should not validate too long value', () => {
        expect(validator.isValid('1234')).toBeFalse();
    });

    it('should validate arrays', () => {
        expect(validator.isValid(['12', '123'])).toBeTrue();
        expect(validator.isValid(['12', '1234'])).toBeFalse();
    });
});
