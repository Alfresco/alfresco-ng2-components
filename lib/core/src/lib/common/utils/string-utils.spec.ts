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

import { StringUtils } from './string-utils';

describe('StringUtils', () => {

    describe('capitalize', () => {
        it('should uppercase first letter of word and lowercase the rest', () => {
            const lowercaseWord = 'test';
            const uppercaseWord = 'TEST';
            const mixedWord = 'tEsT';

            expect(StringUtils.capitalize(lowercaseWord)).toBe('Test');
            expect(StringUtils.capitalize(uppercaseWord)).toBe('Test');
            expect(StringUtils.capitalize(mixedWord)).toBe('Test');
        });

        it('should uppercase first letter of first word in sentence and lowercase the rest', () => {
            const sentence = 'this is a sentence';

            expect(StringUtils.capitalize(sentence)).toBe('This is a sentence');
        });
    });

    describe('replaceAll', () => {
        it('should replace all instances provided in the delimiters obj', () => {
            const test = 'isClusterEnabled';
            const delimiters = {
                is: 'are',
                Enabled: 'Disabled'
            };

            expect(StringUtils.replaceAll(test, delimiters)).toBe('areClusterDisabled');
        });

        it('should return initial string if delimiters is not an oject', () => {
            const test = 'isClusterEnabled';
            const delimiters = 'test';

            expect(StringUtils.replaceAll(test, delimiters)).toBe('isClusterEnabled');
        });
    });

    describe('removeAll', () => {
        it('should remove all instances described in demiliters arguments in string', () => {
            const test = 'isClusterEnabled';
            const delimiters = ['is', 'Enabled'];

            expect(StringUtils.removeAll(test, ...delimiters)).toBe('Cluster');
        });
    });

    describe('prettifyBooleanEnabled', () => {
        it('should remove "is" and "enabled" from strings', () => {
            const test = 'isClusterEnabled';

            expect(StringUtils.prettifyBooleanEnabled(test)).toBe('Cluster');
        });
    });
});
