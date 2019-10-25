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

import { FormatSpacePipe } from './format-space.pipe';

describe('FormatSpacePipe', () => {

    let pipe: FormatSpacePipe;

    beforeEach(() => {
        pipe = new FormatSpacePipe();
    });

    it('should replace the white space with an underscore by default', () => {
        const result = pipe.transform('FAKE TEST');
        expect(result).toBe('fake_test');
    });

    it('should replace all the white spaces with an underscore by default', () => {
        const result = pipe.transform('FAKE TEST CHECK ');
        expect(result).toBe('fake_test_check');
    });

    it('should trim the space at the end of the string and replace the ones in the middle', () => {
        const result = pipe.transform(' FAKE TEST CHECK ');
        expect(result).toBe('fake_test_check');
    });

    it('should return a lower case string by default', () => {
        const testString = 'FAKE_TEST_LOWERCASE';
        const result = pipe.transform(testString);
        expect(result).toBe(testString.toLocaleLowerCase());
    });

    it('should replace the empty space with the character given', () => {
        const testString = 'FAKE TEST LOWERCASE';
        const result = pipe.transform(testString, '+');
        expect(result).toBe('fake+test+lowercase');
    });

    it('should leave the string uppercase if explicitly set', () => {
        const testString = 'FAKE TEST LOWERCASE';
        const result = pipe.transform(testString, '-', false);
        expect(result).toBe('FAKE-TEST-LOWERCASE');
    });

    it('should return an empty string when input is null', () => {
        const result = pipe.transform(null);
        expect(result).toBe('');
    });
});
