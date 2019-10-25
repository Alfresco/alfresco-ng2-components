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

import { FullNamePipe } from './full-name.pipe';
import { async } from '@angular/core/testing';

describe('FullNamePipe', () => {

    let pipe: FullNamePipe;

    beforeEach(async(() => {
        pipe = new FullNamePipe();
    }));

    it('should return empty string when there is no name', () => {
        const user = {};
        expect(pipe.transform(user)).toBe('');
    });

    it('should return only firstName as fullName when there is no lastName ', () => {
        const user = {firstName : 'Abc'};
        expect(pipe.transform(user)).toBe('Abc');
    });

    it('should return only lastName as fullName when there is no firstName ', () => {
        const user = {lastName : 'Xyz'};
        expect(pipe.transform(user)).toBe('Xyz');
    });

    it('should return fullName when firstName and lastName are available', () => {
        const user = {firstName : 'Abc', lastName : 'Xyz'};
        expect(pipe.transform(user)).toBe('Abc Xyz');
    });

    it('should return username when firstName and lastName are not available', () => {
        const user = {firstName : '', lastName : '', username: 'username'};
        expect(pipe.transform(user)).toBe('username');
    });

    it('should return user eamil when firstName, lastName and username are not available', () => {
        const user = {firstName : '', lastName : '', username: '', email: 'abcXyz@gmail.com'};
        expect(pipe.transform(user)).toBe('abcXyz@gmail.com');
    });
});
