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

import { CardViewItemMatchValidator } from './card-view-item-match.validator';

describe('CardViewItemMatchValidator', () => {
    const validator = new CardViewItemMatchValidator('^[a-zA-Z]+$', undefined, true);

    it('should validate empty value', () => {
        expect(validator.isValid('')).toBeTrue();
    });

    it('should validate correct value', () => {
        expect(validator.isValid('aA')).toBeTrue();
    });

    it('should not validate incorrect value', () => {
        expect(validator.isValid('1a')).toBeFalse();
    });

    it('should validate arrays', () => {
        expect(validator.isValid(['aa', 'BB'])).toBeTrue();
        expect(validator.isValid(['b2', 'aB'])).toBeFalse();
    });
});
