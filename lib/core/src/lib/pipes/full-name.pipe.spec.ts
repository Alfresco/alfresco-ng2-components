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
import { cloneDeep } from 'lodash';

interface TestCase {
    title: string;
    user: UserLike;
    result: string;
};

describe('FullNamePipe', () => {

    let pipe: FullNamePipe;

    const emptyUserTestCase: TestCase = {
        title: 'should return empty string when there is no name',
        user: {},
        result: ''
    };

    const onlyUserEmailTestCase: TestCase = {
        title: 'should return user email when firstName, lastName and username are not available',
        user: { email: 'abcXyz@gmail.com' },
        result: 'abcXyz@gmail.com'
    };

    const baseTestCases: TestCase[] = [
        {
            title: 'should return only firstName as fullName when there is no lastName',
            user: { firstName: 'Abc', lastName: '', username: '' },
            result: 'Abc'
        },
        {
            title: 'should return only lastName as fullName when there is no firstName',
            user: { firstName: '', lastName: 'Xyz', username: '' },
            result: 'Xyz'
        },
        {
            title: 'should return fullName when firstName and lastName are available',
            user: { firstName: 'Abc', lastName: 'Xyz', username: '' },
            result: 'Abc Xyz'
        },
        {
            title: 'should return username when firstName and lastName are not available',
            user: { firstName: '', lastName: '', username: 'username' },
            result: 'username'
        }
    ];

    [undefined, false, true].forEach(injectionToken => {
        [undefined, false, true].forEach(pipeParameter => {
            [undefined, '', 'abcXyz@gmail.com'].forEach(emailAddress => {
                const testCases: TestCase[] = getTestCases(baseTestCases, emailAddress, pipeParameter, injectionToken, emptyUserTestCase, onlyUserEmailTestCase);

                testCases.forEach(testCase => {
                    it(`${testCase.title} and injection token is ${injectionToken} and pipe parameter is ${pipeParameter} and email address is ${emailAddress}`, () => {
                        pipe = new FullNamePipe(injectionToken);
                        expect(pipe.transform(testCase.user, pipeParameter)).toBe(testCase.result);
                    });
                });
            });
        });
    });
});

function getTestCases(baseTestCases: TestCase[], emailAddress: string | undefined, pipeParameter: boolean | undefined, injectionToken: boolean | undefined, emptyUserTestCase: TestCase, onlyUserEmailTestCase: TestCase) {
    let testCases: TestCase[] = cloneDeep(baseTestCases).map(testCase => ({ ...testCase, user: { ...testCase.user, email: emailAddress } }));

    const patchEmailInResult = !!(pipeParameter === undefined ? injectionToken : pipeParameter) && emailAddress?.length;
    if (patchEmailInResult) {
        testCases = testCases.map(testCase => ({ ...testCase, result: testCase.result.concat(' <abcXyz@gmail.com>') }));
    }

    testCases.push(emptyUserTestCase);
    testCases.push(onlyUserEmailTestCase);

    return testCases;
}

