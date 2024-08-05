/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import assert from 'assert';
import { AlfrescoApi, QueriesApi } from '../../src';
import { EcmAuthMock, FindNodesMock } from '../mockObjects';

describe('Queries', () => {
    let authResponseMock: EcmAuthMock;
    let nodesMock: FindNodesMock;
    let queriesApi: QueriesApi;

    beforeEach((done) => {
        const hostEcm = 'https://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        nodesMock = new FindNodesMock(hostEcm);

        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        alfrescoJsApi.login('admin', 'admin').then(() => {
            done();
        });

        queriesApi = new QueriesApi(alfrescoJsApi);
    });

    describe('nodes', () => {
        const searchTerm = 'test';

        it('should throw exception if no search term is provided', () => {
            assert.throws(() => {
                queriesApi.findNodes(null);
            }, `Error: Missing param 'term'`);
        });

        it('should invoke error handler on a server error', (done) => {
            nodesMock.get401Response();

            queriesApi.findNodes(searchTerm).then(
                () => { /* empty */ },
                () => {
                    done();
                }
            );
        });

        it('should return query results', (done) => {
            nodesMock.get200Response();

            queriesApi.findNodes(searchTerm).then((data) => {
                assert.equal(data.list.pagination.count, 2);
                assert.equal(data.list.entries[0].entry.name, 'coins1.JPG');
                assert.equal(data.list.entries[1].entry.name, 'coins2.JPG');
                done();
            });
        });
    });
});
