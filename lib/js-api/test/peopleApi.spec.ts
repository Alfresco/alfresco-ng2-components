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

import { AlfrescoApi } from '../src/alfrescoApi';
import { PersonBodyCreate } from '../src/api/content-rest-api/model/personBodyCreate';
import { PeopleApi } from '../src/api/content-rest-api/api/people.api';
import { PeopleMock } from './mockObjects';

describe('PeopleApi', () => {
    let peopleMock: PeopleMock;
    let peopleApi: PeopleApi;

    beforeEach(() => {
        peopleMock = new PeopleMock();

        const alfrescoApi = new AlfrescoApi({
            hostEcm: 'http://127.0.0.1:8080'
        });

        peopleApi = new PeopleApi(alfrescoApi);
    });

    it('should add a person', (done) => {
        const personBodyCreate = new PersonBodyCreate();
        peopleMock.get201Response();

        personBodyCreate.id = 'chewbe';
        personBodyCreate.email = 'chewbe@millenniumfalcon.com';
        personBodyCreate.lastName = 'Chewbe';
        personBodyCreate.firstName = 'chewbacca';
        personBodyCreate.password = 'Rrrrrrrghghghghgh';

        peopleApi.createPerson(personBodyCreate).then(
            () => {
                done();
            },
            (error) => {
                console.error(error);
            }
        );
    });
});
