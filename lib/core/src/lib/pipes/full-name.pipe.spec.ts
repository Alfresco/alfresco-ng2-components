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

import { FullNamePipe } from './full-name.pipe';
import { UserLike } from './user-like.interface';

interface TestCases {
    [key: string]: {
        title: string;
        includeEmailToken: boolean | undefined;
        includeEmailParameter: boolean | undefined;
        testCases: TestCase[];
    };
};

interface TestCase {
    title: string;
    user: UserLike;
    result: string;
};

describe('FullNamePipe', () => {

    let pipe: FullNamePipe;

    const cosntBaseTestCases: TestCase[] = [
        {
            title: 'should return empty string when there is no name',
            user: { firstName: '', lastName: '', username: '', email: '' },
            result: ''
        },
        {
            title: 'should return only firstName as fullName when there is no lastName',
            user: { firstName: 'Abc', lastName: '', username: '', email: '' },
            result: 'Abc'
        },
        {
            title: 'should return only lastName as fullName when there is no firstName',
            user: { firstName: '', lastName: 'Xyz', username: '', email: '' },
            result: 'Xyz'
        },
        {
            title: 'should return fullName when firstName and lastName are available',
            user: { firstName: 'Abc', lastName: 'Xyz', username: '', email: '' },
            result: 'Abc Xyz'
        },
        {
            title: 'should return username when firstName and lastName are not available',
            user: { firstName: '', lastName: '', username: 'username', email: '' },
            result: 'username'
        },
        {
            title: 'should return user email when firstName, lastName and username are not available',
            user: { firstName: '', lastName: '', username: '', email: 'abcXyz@gmail.com' },
            result: 'abcXyz@gmail.com'
        }
    ];

    function patchEmailAddress(testCase: TestCase): TestCase {
        return {
            ...testCase,
            user: { ...testCase.user, email: 'abcXyz@gmail.com' }
        };
    }

    function patchEmailResult(testCase: TestCase): TestCase {
        return {
            ...testCase,
            result: testCase.result + ' <abcXyz@gmail.com>'
        };
    }

    function patchEmail(testCase: TestCase): TestCase {
        return patchEmailResult(patchEmailAddress(testCase));
    }

    function getTestCasesWithEmailPatched(): TestCase[] {
        return cosntBaseTestCases.slice(1, cosntBaseTestCases.length - 1).map(testCase => patchEmail(testCase)).concat([{
            title: 'should return user email when firstName, lastName and username are not available',
            user: { firstName: '', lastName: '', username: '', email: 'abcXyz@gmail.com' },
            result: 'abcXyz@gmail.com'
        }]);
    }

    const testCases: TestCases = {
        undefinedIncludeEmailTokenUndefinedIncludeEmailParameter: {
            title: 'and include email token is undefined and include email is undefined',
            includeEmailToken: undefined,
            includeEmailParameter: undefined,
            testCases: cosntBaseTestCases
        },
        undefinedIncludeEmailTokenFalseIncludeEmailParameter: {
            title: 'and include email token is undefined and include email is false',
            includeEmailToken: undefined,
            includeEmailParameter: false,
            testCases: cosntBaseTestCases
        },
        undefinedIncludeEmailTokenFTrueIncludeEmailParameter: {
            title: 'and include email token is undefined and include email is true',
            includeEmailToken: undefined,
            includeEmailParameter: true,
            testCases: getTestCasesWithEmailPatched()
        },
        falseIncludeEmailTokenUndefinedIncludeEmailParameter: {
            title: 'and include email token is false and include email is undefined',
            includeEmailToken: false,
            includeEmailParameter: undefined,
            testCases: cosntBaseTestCases
        },
        falseIncludeEmailTokenFalseIncludeEmailParameter: {
            title: 'and include email token is false and include email is false',
            includeEmailToken: false,
            includeEmailParameter: false,
            testCases: cosntBaseTestCases
        },
        falseIncludeEmailTokenTrueIncludeEmailParameter: {
            title: 'and include email token is false and include email is true',
            includeEmailToken: false,
            includeEmailParameter: true,
            testCases: getTestCasesWithEmailPatched()
        },
        trueIncludeEmailTokennUndefinedIncludeEmailParameterButEmailAddressNotPresent: {
            title: 'and include email token is true and include email is undefined but email is not provided',
            includeEmailToken: true,
            includeEmailParameter: undefined,
            testCases: cosntBaseTestCases.slice(0, cosntBaseTestCases.length - 1)
        },
        trueIncludeEmailTokennFalseIncludeEmailParameterButEmailAddressNotPresent: {
            title: 'and include email token is true and include email is false but email is not provided',
            includeEmailToken: true,
            includeEmailParameter: false,
            testCases: cosntBaseTestCases.slice(0, cosntBaseTestCases.length - 1)
        },
        trueIncludeEmailTokennTrueIncludeEmailParameterButEmailAddressNotPresent: {
            title: 'and include email token is true and include email is true but email is not provided',
            includeEmailToken: true,
            includeEmailParameter: true,
            testCases: cosntBaseTestCases.slice(0, cosntBaseTestCases.length - 1)
        },
        trueIncludeEmailTokenUndefinedIncludeEmailParameterAndEmailAddressPresent: {
            title: 'and include email token is true and include email is undefined and email is provided',
            includeEmailToken: true,
            includeEmailParameter: undefined,
            testCases: getTestCasesWithEmailPatched()
        },
        trueIncludeEmailTokenFalseIncludeEmailParameterAndEmailAddressPresent: {
            title: 'and include email token is true and include email is false and email is provided',
            includeEmailToken: true,
            includeEmailParameter: false,
            testCases: cosntBaseTestCases.slice(1, cosntBaseTestCases.length - 1).map(testCase => patchEmailAddress(testCase))
        },
        trueIncludeEmailTokenTrueIncludeEmailParameterAndEmailAddressPresent: {
            title: 'and include email token is true and include email is true and email is provided',
            includeEmailToken: true,
            includeEmailParameter: true,
            testCases: getTestCasesWithEmailPatched()
        }
    };

    Object.keys(testCases).forEach(block => {
        const testCasesToExecute = testCases[block].testCases;
        testCasesToExecute.forEach(testCase => {
            it(`${testCase.title} ${testCases[block].title}`, () => {
                pipe = new FullNamePipe(testCases[block].includeEmailToken);
                expect(pipe.transform(testCase.user, testCases[block].includeEmailParameter)).toBe(testCase.result);
            });
        });
    });
});
