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

describe('FullNamePipe', () => {

    let pipe: FullNamePipe;

    let user: UserLike;

    describe('Email address inclusion not requested', () => {

        beforeAll(() => {
            pipe = new FullNamePipe();
        });

        it('should return empty string when there is no name', () => {
            user = {};

            expect(pipe.transform(user)).toBe('');
        });

        it('should return only firstName as fullName when there is no lastName', () => {
            user = { firstName: 'Abc' };

            expect(pipe.transform(user)).toBe('Abc');
        });

        it('should return only lastName as fullName when there is no firstName', () => {
            user = { lastName: 'Xyz' };

            expect(pipe.transform(user)).toBe('Xyz');
        });

        it('should return fullName when firstName and lastName are available', () => {
            user = { firstName: 'Abc', lastName: 'Xyz' };

            expect(pipe.transform(user)).toBe('Abc Xyz');
        });

        it('should return username when firstName and lastName are not available', () => {
            user = { username: 'username' };

            expect(pipe.transform(user)).toBe('username');
        });

        it('should return user email when firstName, lastName and username are not available', () => {
            user = { email: 'abcXyz@gmail.com' };

            expect(pipe.transform(user)).toBe('abcXyz@gmail.com');
        });
    });

    describe('Email address inclusion requested via injection token', () => {

        beforeEach(() => {
            pipe = new FullNamePipe(true);
            user = { email: 'abcXyz@gmail.com' };
        });

        it('should return empty string when there is no name', () => {
            user = {};

            expect(pipe.transform(user)).toBe('');
        });

        it('should return only firstName and email address as fullName when there is no lastName', () => {
            user.firstName = 'Abc';

            expect(pipe.transform(user)).toBe('Abc <abcXyz@gmail.com>');
        });

        it('should return only lastName and email address as fullName when there is no firstName', () => {
            user.lastName = 'Xyz';

            expect(pipe.transform(user)).toBe('Xyz <abcXyz@gmail.com>');
        });

        it('should return fullName and email address when firstName and lastName are available', () => {
            user.firstName = 'Abc';
            user.lastName = 'Xyz';

            expect(pipe.transform(user)).toBe('Abc Xyz <abcXyz@gmail.com>');
        });

        it('should return username and email address when firstName and lastName are not available', () => {
            user.username = 'username';

            expect(pipe.transform(user)).toBe('username <abcXyz@gmail.com>');
        });

        it('should return user email when firstName, lastName and username are not available', () => {
            user = { email: 'abcXyz@gmail.com' };

            expect(pipe.transform(user)).toBe('abcXyz@gmail.com');
        });

        it('should not include email address when email address is not available', () => {
            user = { firstName: 'Abc', lastName: 'Xyz' };

            expect(pipe.transform(user)).toBe('Abc Xyz');
        });
    });

    describe('Email address inclusion requested via pipe parameter', () => {

        beforeEach(() => {
            pipe = new FullNamePipe();
            user = { email: 'abcXyz@gmail.com' };
        });

        it('should return empty string when there is no name', () => {
            user = {};

            expect(pipe.transform(user, true)).toBe('');
        });

        it('should return only firstName and email address as fullName when there is no lastName', () => {
            user.firstName = 'Abc';

            expect(pipe.transform(user, true)).toBe('Abc <abcXyz@gmail.com>');
        });

        it('should return only lastName and email address as fullName when there is no firstName', () => {
            user.lastName = 'Xyz';

            expect(pipe.transform(user, true)).toBe('Xyz <abcXyz@gmail.com>');
        });

        it('should return fullName and email address when firstName and lastName are available', () => {
            user.firstName = 'Abc';
            user.lastName = 'Xyz';

            expect(pipe.transform(user, true)).toBe('Abc Xyz <abcXyz@gmail.com>');
        });

        it('should return username and email address when firstName and lastName are not available', () => {
            user.username = 'username';

            expect(pipe.transform(user, true)).toBe('username <abcXyz@gmail.com>');
        });

        it('should return user email when firstName, lastName and username are not available', () => {
            user = { email: 'abcXyz@gmail.com' };

            expect(pipe.transform(user, true)).toBe('abcXyz@gmail.com');
        });

        it('should not include email address when email address is not available', () => {
            user = { firstName: 'Abc', lastName: 'Xyz' };

            expect(pipe.transform(user, true)).toBe('Abc Xyz');
        });
    });

    describe('Pipe parameter prevalence over token', () => {

        it('should include email when injection token is false and pipe parameter is true', () => {
            user = { firstName: 'Abc', lastName: 'Xyz', email: 'abcXyz@gmail.com' };
            pipe = new FullNamePipe(false);

            expect(pipe.transform(user, true)).toBe('Abc Xyz <abcXyz@gmail.com>');
        });

        it('should not include email when injection token is true and pipe parameter is false', () => {
            user = { firstName: 'Abc', lastName: 'Xyz' };
            pipe = new FullNamePipe(true);

            expect(pipe.transform(user, false)).toBe('Abc Xyz');
        });
    });

});
