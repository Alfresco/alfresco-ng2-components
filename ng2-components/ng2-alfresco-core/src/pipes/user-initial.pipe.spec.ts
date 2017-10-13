/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { LightUserRepresentation } from '../models/user-process.model';
import { InitialUsernamePipe } from './user-initial.pipe';

fdescribe('UserInitialPipe', () => {

    let pipe: InitialUsernamePipe;
    let fakeUser: LightUserRepresentation;

    beforeEach(() => {
        pipe = new InitialUsernamePipe();
        fakeUser = new LightUserRepresentation();
    });

    it('should return a div with the user initials', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = 'FAKE-SURNAME';
        let result = pipe.transform(fakeUser);
        expect(result).toBe('<div class="">FF</div>');
    });

    it('should apply the style class passed in input', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = 'FAKE-SURNAME';
        let result = pipe.transform(fakeUser, 'fake-class-to-check');
        expect(result).toBe('<div class="fake-class-to-check">FF</div>');
    });

    it('should return a single letter into div when lastname is undefined', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = undefined;
        let result = pipe.transform(fakeUser);
        expect(result).toBe('<div class="">F</div>');
    });

    it('should return a single letter into div when firstname is null', () => {
        fakeUser.firstName = undefined;
        fakeUser.lastName = 'FAKE-SURNAME';
        let result = pipe.transform(fakeUser);
        expect(result).toBe('<div class="">F</div>');
    });

    it('should return an empty string when user is null', () => {
        let result = pipe.transform(null);
        expect(result).toBe('');
    });
});
