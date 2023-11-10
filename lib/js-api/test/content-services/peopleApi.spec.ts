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

import { AlfrescoApi } from '../../src/alfrescoApi';
import { PersonBodyCreate } from '../../src/api/content-rest-api/model/personBodyCreate';
import { PeopleApi } from '../../src/api/content-rest-api';
import { EcmAuthMock, PeopleMock } from '../../test/mockObjects';

describe('PeopleApi', () => {
    let authResponseMock: EcmAuthMock;
    let peopleMock: PeopleMock;
    let peopleApi: PeopleApi;

    beforeEach((done) => {
        const hostEcm = 'http://adfdev.lab.alfresco.me';

        authResponseMock = new EcmAuthMock(hostEcm);
        peopleMock = new PeopleMock(hostEcm);
        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        alfrescoJsApi.login('admin', 'admin').then(() => {
            done();
        });

        peopleApi = new PeopleApi(alfrescoJsApi);
    });

    it('should add a person', (done) => {
        peopleMock.get201Response();

        const payload = new PersonBodyCreate();
        payload.id = 'chewbe';
        payload.email = 'chewbe@millenniumfalcon.com';
        payload.lastName = 'Chewbe';
        payload.firstName = 'chewbacca';
        payload.password = 'Rrrrrrrghghghghgh';

        peopleApi.createPerson(payload).then(() => {
            done();
        });
    });

    it('should get list of people', (done) => {
        peopleMock.get200ResponsePersons();

        peopleApi.listPeople().then(() => {
            peopleMock.play();
            done();
        });
    });
});
