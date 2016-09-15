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

import { it, describe, expect } from '@angular/core/testing';
import { GroupUserModel } from './group-user.model';

describe('GroupUserModel', () => {

    it('should init with json', () => {
        let json = {
            company: '<company>',
            email: '<email>',
            firstName: '<firstName>',
            id: '<id>',
            lastName: '<lastName>'
        };

        let model = new GroupUserModel(json);
        expect(model.company).toBe(json.company);
        expect(model.email).toBe(json.email);
        expect(model.firstName).toBe(json.firstName);
        expect(model.id).toBe(json.id);
        expect(model.lastName).toBe(json.lastName);
    });

});
