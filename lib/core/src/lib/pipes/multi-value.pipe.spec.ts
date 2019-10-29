/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

describe('FullNamePipe', () => {

    let pipe: MultiValuePipe;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        pipe = TestBed.get(MultiValuePipe);

    });

    it('should add the separator when a list is provided', () => {
        const values = ['cat', 'house', 'dog'];
        expect(pipe.transform(values)).toBe('cat, house, dog');
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
