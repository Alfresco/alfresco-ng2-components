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

import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../models/general-user.model';
import { InitialUsernamePipe } from './user-initial.pipe';

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

    bypassSecurityTrustStyle(): any {
        return null;
    }

    bypassSecurityTrustScript(): any {
        return null;
    }

    bypassSecurityTrustUrl(): any {
        return null;
    }

    bypassSecurityTrustResourceUrl(): any {
        return null;
    }
}

describe('UserInitialPipe', () => {

    let pipe: InitialUsernamePipe;
    let fakeUser: User;

    beforeEach(() => {
        pipe = new InitialUsernamePipe(new FakeSanitizer());
        fakeUser = { username: '' } as User;
    });

    it('should return a div with the user initials', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = 'FAKE-SURNAME';
        const result = pipe.transform(fakeUser);
        expect(result).toBe('<div data-automation-id="user-initials-image" class="">FF</div>');
    });

    it('should apply the style class passed in input', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = 'FAKE-SURNAME';
        const result = pipe.transform(fakeUser, 'fake-class-to-check');
        expect(result).toBe('<div data-automation-id="user-initials-image" class="fake-class-to-check">FF</div>');
    });

    it('should return a single letter into div when lastName is undefined', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = undefined;
        const result = pipe.transform(fakeUser);
        expect(result).toBe('<div data-automation-id="user-initials-image" class="">F</div>');
    });

    it('should return a single letter into div when firstname is null', () => {
        fakeUser.firstName = undefined;
        fakeUser.lastName = 'FAKE-SURNAME';
        const result = pipe.transform(fakeUser);
        expect(result).toBe('<div data-automation-id="user-initials-image" class="">F</div>');
    });

    it('should return a single letter into div when only username is defined', () => {
        fakeUser.firstName = undefined;
        fakeUser.lastName = undefined;
        fakeUser.username = 'USERNAME-FAKE';
        const result = pipe.transform(fakeUser);
        expect(result).toBe('<div data-automation-id="user-initials-image" class="">U</div>');
    });

    it('should return a single letter into div of firstName when only firstName and username is defined', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = undefined;
        fakeUser.username = 'USERNAME-FAKE';
        const result = pipe.transform(fakeUser);
        expect(result).toBe('<div data-automation-id="user-initials-image" class="">F</div>');
    });

    it('should return two letter into div of username and lastName when firstName is undefined', () => {
        fakeUser.firstName = undefined;
        fakeUser.lastName = 'FAKE-SURNAME';
        fakeUser.username = 'USERNAME-FAKE';
        const result = pipe.transform(fakeUser);
        expect(result).toBe('<div data-automation-id="user-initials-image" class="">UF</div>');
    });

    it('should return a div with the user initials when firstName, lastName and username is defined', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = 'FAKE-SURNAME';
        fakeUser.username = 'USERNAME-FAKE';
        const result = pipe.transform(fakeUser);
        expect(result).toBe('<div data-automation-id="user-initials-image" class="">FF</div>');
    });

    it('should return an empty string when user is null', () => {
        const result = pipe.transform(null);
        expect(result).toBe('');
    });
});
