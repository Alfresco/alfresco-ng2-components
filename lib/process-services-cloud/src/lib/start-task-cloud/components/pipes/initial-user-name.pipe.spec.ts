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

import { InitialUserNamePipe } from './initial-user-name.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { UserCloudModel } from '../../models/user-cloud.model';

class FakeSanitizer extends DomSanitizer {

    constructor() {
        super();
    }

    sanitize(html) {
        return html;
    }

    bypassSecurityTrustHtml(value: string): any {
        return value;
    }

    bypassSecurityTrustStyle(value: string): any {
        return null;
    }

    bypassSecurityTrustScript(value: string): any {
        return null;
    }

    bypassSecurityTrustUrl(value: string): any {
        return null;
    }

    bypassSecurityTrustResourceUrl(value: string): any {
        return null;
    }
}

describe('InitialUserNamePipe', () => {

    let pipe: InitialUserNamePipe;
    let fakeUser: UserCloudModel;

    beforeEach(() => {
        pipe = new InitialUserNamePipe(new FakeSanitizer());
        fakeUser = {username: 'username', firstName: 'first-name', lastName: 'last-name'};
    });

    it('should return a div with the user initials', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = 'FAKE-SURNAME';
        let result = pipe.transform(fakeUser);
        expect(result).toBe('<div id="user-initials-image" class="">FF</div>');
    });

    it('should apply the style class passed in input', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = 'FAKE-SURNAME';
        let result = pipe.transform(fakeUser, 'fake-class-to-check');
        expect(result).toBe('<div id="user-initials-image" class="fake-class-to-check">FF</div>');
    });

    it('should return a single letter into div when lastName is undefined', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = undefined;
        let result = pipe.transform(fakeUser);
        expect(result).toBe('<div id="user-initials-image" class="">F</div>');
    });

    it('should return a single letter into div when firstname is null', () => {
        fakeUser.firstName = undefined;
        fakeUser.lastName = 'FAKE-SURNAME';
        let result = pipe.transform(fakeUser);
        expect(result).toBe('<div id="user-initials-image" class="">F</div>');
    });

    it('should return an empty string when user is null', () => {
        let result = pipe.transform(null);
        expect(result).toBe('');
    });
});
