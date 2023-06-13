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

import { IsIncludedPipe } from './is-included.pipe';

describe('IsIncludedPipe', () => {

    let pipe: IsIncludedPipe<any>;
    const array = [1, 2, 'test', [null], {}];

    beforeEach(() => {
        pipe = new IsIncludedPipe();
    });

    it('should return true if the string is contained in an array', () => {
        expect(pipe.transform('test', array)).toBeTruthy();
    });

    it('should return false if the string is not contained in an array', () => {
        expect(pipe.transform('test 1', array)).toBeFalsy();
    });

    it('should return true if the number is in the array', () => {
        expect(pipe.transform(2, array)).toBeTruthy();
    });

    it('should return false if the number is not contained in an array', () => {
        expect(pipe.transform(50, array)).toBeFalsy();
    });
});
