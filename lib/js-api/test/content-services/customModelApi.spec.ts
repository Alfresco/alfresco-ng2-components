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
import { CustomModelApi } from '../../src/api/content-custom-api';
import { EcmAuthMock, CustomModelMock } from '../../test/mockObjects';

describe('Custom Model Api', () => {
    let authResponseMock: EcmAuthMock;
    let customModelMock: CustomModelMock;
    let customModelApi: CustomModelApi;

    beforeEach((done) => {
        const hostEcm = 'http://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        customModelMock = new CustomModelMock(hostEcm);

        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        alfrescoJsApi.login('admin', 'admin').then(
            () => {
                done();
            },
            (error) => {
                console.log('error ' + JSON.stringify(error));
            }
        );

        customModelApi = new CustomModelApi(alfrescoJsApi);
    });

    describe('Get', () => {
        it('All Custom Model', (done) => {
            customModelMock.get200AllCustomModel();

            customModelApi.getAllCustomModel().then(() => {
                done();
            }, console.error);
        });
    });

    describe('Create', () => {
        it('createCustomModel', (done) => {
            customModelMock.create201CustomModel();

            const status = 'DRAFT';
            const description = 'Test model description';
            const name = 'testModel';
            const namespaceUri = 'http://www.alfresco.org/model/testNamespace/1.0';
            const namespacePrefix = 'test';

            customModelApi.createCustomModel(status, description, name, namespaceUri, namespacePrefix).then(() => {
                done();
            }, console.error);
        });
    });

    describe('PUT', () => {
        it('activateCustomModel', (done) => {
            customModelMock.activateCustomModel200();

            customModelApi.activateCustomModel('testModel').then(() => {
                done();
            }, console.error);
        });
    });
});
