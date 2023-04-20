/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { MultiValuePipe } from './multi-value.pipe';
import { TestBed } from '@angular/core/testing';
import { setupTestBed } from '../testing/setup-test-bed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('FullNamePipe', () => {

    let pipe: MultiValuePipe;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        pipe = TestBed.inject(MultiValuePipe);
   });

    it('should add the separator when a string list is provided', () => {
        const values = ['cat', 'house', 'dog'];
        expect(pipe.transform(values)).toBe('cat, house, dog');
    });

    it('should add the separator when a number list is provided', () => {
        const values = [1, 2, 3];
        expect(pipe.transform(values)).toBe('1, 2, 3');
    });

    it('should add custom separator when set', () => {
        const values = ['cat', 'house', 'dog'];
        const customSeparator = ' - ';
        expect(pipe.transform(values, customSeparator)).toBe('cat - house - dog');
    });

    it('should not add separator when the list has only one item', () => {
        const values = ['cat'];
        expect(pipe.transform(values)).toBe('cat');
    });

    it('should return empty string when an empty list is passed', () => {
        const values = [];
        expect(pipe.transform(values)).toBe('');
    });

    it('should return empty string when an empty string is passed', () => {
        const values = '';
        expect(pipe.transform(values)).toBe('');
    });

    it('should return same string when the value passed is a string', () => {
        const values = 'cat';
        expect(pipe.transform(values)).toBe('cat');
    });
});
