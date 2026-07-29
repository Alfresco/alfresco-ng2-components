/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AlfrescoApi, CustomModelApi } from '../../src';
import assert from 'assert';
import { resetGlobalMockAgent } from '../mockObjects/base.mock';
import { EcmAuthMock, CustomModelMock } from '../mockObjects';

import { describe, it, beforeEach, afterEach } from 'node:test';

describe('Custom Model Api', () => {
    let authResponseMock: EcmAuthMock;
    let customModelMock: CustomModelMock;
    let customModelApi: CustomModelApi;

    beforeEach(async () => {
        const hostEcm = 'https://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        customModelMock = new CustomModelMock(hostEcm);

        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        await alfrescoJsApi.login('admin', 'admin');

        customModelApi = new CustomModelApi(alfrescoJsApi);
    });

    afterEach(() => {
        resetGlobalMockAgent();
    });

    describe('Get', () => {
        it('All Custom Model', async () => {
            customModelMock.get200AllCustomModel();

            const result = await customModelApi.getAllCustomModel();
            assert.ok(result, 'getAllCustomModel should return a result');
        });
    });

    describe('Create', () => {
        it('createCustomModel', async () => {
            customModelMock.create201CustomModel();

            const status = 'DRAFT';
            const description = 'Test model description';
            const name = 'testModel';
            const namespaceUri = 'https://www.alfresco.org/model/testNamespace/1.0';
            const namespacePrefix = 'test';

            const result = await customModelApi.createCustomModel(status, description, name, namespaceUri, namespacePrefix);
            assert.ok(result, 'createCustomModel should return a result');
            assert.equal(result.entry.name, name, 'Created model should have correct name');
        });
    });

    describe('PUT', () => {
        it('activateCustomModel', async () => {
            customModelMock.activateCustomModel200();

            const result = await customModelApi.activateCustomModel('testModel');
            assert.ok(result, 'activateCustomModel should return a result');
        });
    });
});
