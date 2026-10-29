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

import assert from 'assert';
import { resetGlobalMockAgent } from '../mockObjects/base.mock';
import { AlfrescoApi, CascadingDictionariesApi, CascadingDictionaryContentBody, CascadingDictionaryEntry, CascadingDictionaryList } from '../../src';
import { EcmAuthMock, CascadingDictionariesMock } from '../mockObjects';
import { describe, it, beforeEach, afterEach } from 'node:test';

describe('CascadingDictionaries', () => {
    const aspectId = 'cdict:account';

    let authResponseMock: EcmAuthMock;
    let cascadingDictionariesMock: CascadingDictionariesMock;
    let cascadingDictionariesApi: CascadingDictionariesApi;

    const contentBody: CascadingDictionaryContentBody = {
        definition: {
            levels: [
                { level: 0, properties: ['cdict:accountCategory'] },
                { level: 1, properties: ['cdict:accountNumber', 'cdict:accountName'] }
            ]
        },
        data: [
            {
                properties: { 'cdict:accountCategory': 'Current Assets' },
                children: [{ properties: { 'cdict:accountNumber': 1000, 'cdict:accountName': 'Cash' } }]
            }
        ]
    };

    beforeEach(async () => {
        const hostEcm = 'https://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        cascadingDictionariesMock = new CascadingDictionariesMock(hostEcm);

        authResponseMock.get201Response();
        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        await alfrescoJsApi.login('admin', 'admin');
        cascadingDictionariesApi = new CascadingDictionariesApi(alfrescoJsApi);
    });

    afterEach(() => {
        resetGlobalMockAgent();
    });

    it('should return 200 while listing registered cascading dictionaries', async () => {
        cascadingDictionariesMock.get200ResponseList();
        const response: CascadingDictionaryList = await cascadingDictionariesApi.listCascadingDictionaries();
        assert.equal(response.list.pagination.count, 2);
        assert.equal(response.list.entries[0].entry.aspect, 'cdict:account');
        assert.equal(response.list.entries[0].entry.version, '1.5');
        assert.equal(response.list.entries[1].entry.aspect, 'cdict:department');
    });

    it('should pass paging parameters when listing cascading dictionaries', async () => {
        cascadingDictionariesMock.get200ResponseListPaged(1, 1);
        const response: CascadingDictionaryList = await cascadingDictionariesApi.listCascadingDictionaries({ skipCount: 1, maxItems: 1 });
        assert.equal(response.list.pagination.skipCount, 1);
        assert.equal(response.list.pagination.maxItems, 1);
        assert.equal(response.list.entries.length, 1);
    });

    it('should parse levels and dates when listing cascading dictionaries', async () => {
        cascadingDictionariesMock.get200ResponseList();
        const response: CascadingDictionaryList = await cascadingDictionariesApi.listCascadingDictionaries();
        const entry = response.list.entries[0].entry;
        assert.equal(entry.levels.length, 2);
        assert.equal(entry.levels[1].level, 1);
        assert.deepEqual(entry.levels[1].properties, ['cdict:accountNumber', 'cdict:accountName']);
        assert.ok(entry.createdAt instanceof Date);
        assert.ok(entry.modifiedAt instanceof Date);
    });

    it('should return 200 while getting a cascading dictionary with a prefixed aspectId', async () => {
        cascadingDictionariesMock.get200ResponseDictionary(aspectId);
        const response: CascadingDictionaryEntry = await cascadingDictionariesApi.getCascadingDictionary(aspectId);
        assert.equal(response.entry.aspect, aspectId);
        assert.equal(response.entry.keyProperty, 'cdict:accountNumber');
        assert.equal(response.entry.data, undefined);
    });

    it('should return dictionary data when include=data is requested', async () => {
        cascadingDictionariesMock.get200ResponseDictionaryWithData(aspectId);
        const response: CascadingDictionaryEntry = await cascadingDictionariesApi.getCascadingDictionary(aspectId, { include: ['data'] });
        assert.equal(response.entry.data.length, 1);
        assert.equal(response.entry.data[0].properties['cdict:accountCategory'], 'Current Assets');
        assert.equal(response.entry.data[0].children.length, 2);
        assert.equal(response.entry.data[0].children[0].properties['cdict:accountNumber'], 1000);
    });

    it('should return 404 while getting a cascading dictionary that is not registered', async () => {
        cascadingDictionariesMock.get404DictionaryNotExist('cdict:missing');
        try {
            await cascadingDictionariesApi.getCascadingDictionary('cdict:missing');
            assert.fail('Expected getCascadingDictionary to reject with 404');
        } catch (error: any) {
            assert.equal(error.status, 404);
        }
    });

    it('should throw when aspectId is not provided', () => {
        assert.throws(() => cascadingDictionariesApi.getCascadingDictionary(undefined), /Missing param 'aspectId'/);
    });

    it('should return 200 while getting a specific version of a cascading dictionary', async () => {
        cascadingDictionariesMock.get200ResponseVersion(aspectId, '1.0');
        const response: CascadingDictionaryEntry = await cascadingDictionariesApi.getCascadingDictionaryVersion(aspectId, '1.0');
        assert.equal(response.entry.version, '1.0');
        assert.equal(response.entry.aspect, aspectId);
    });

    it('should return 404 while getting a version that does not exist', async () => {
        cascadingDictionariesMock.get404VersionNotExist(aspectId, '9.9');
        try {
            await cascadingDictionariesApi.getCascadingDictionaryVersion(aspectId, '9.9');
            assert.fail('Expected getCascadingDictionaryVersion to reject with 404');
        } catch (error: any) {
            assert.equal(error.status, 404);
        }
    });

    it('should return 201 while creating a cascading dictionary definition', async () => {
        cascadingDictionariesMock.get201ResponseCreate();
        const response = await cascadingDictionariesApi.createCascadingDictionary({
            name: 'Accounts',
            aspect: aspectId,
            keyProperty: 'cdict:accountNumber',
            versionProperty: 'cdict:accountDictVersion'
        });
        assert.ok(response.entry.createdAt instanceof Date);
    });

    it('should return 409 while creating a cascading dictionary that already exists', async () => {
        cascadingDictionariesMock.get409ResponseCreateAlreadyExists();
        try {
            await cascadingDictionariesApi.createCascadingDictionary({
                name: 'Accounts',
                aspect: aspectId,
                keyProperty: 'cdict:accountNumber',
                versionProperty: 'cdict:accountDictVersion'
            });
            assert.fail('Expected createCascadingDictionary to reject with 409');
        } catch (error: any) {
            assert.equal(error.status, 409);
        }
    });

    it('should return 422 while creating a cascading dictionary for an unknown aspect', async () => {
        cascadingDictionariesMock.get422ResponseCreateModelIntegrity();
        try {
            await cascadingDictionariesApi.createCascadingDictionary({
                name: 'Accounts',
                aspect: 'cdict:missing',
                keyProperty: 'cdict:accountNumber',
                versionProperty: 'cdict:accountDictVersion'
            });
            assert.fail('Expected createCascadingDictionary to reject with 422');
        } catch (error: any) {
            assert.equal(error.status, 422);
        }
    });

    it('should return 403 while creating a cascading dictionary without admin rights', async () => {
        cascadingDictionariesMock.get403ResponseCreateForbidden();
        try {
            await cascadingDictionariesApi.createCascadingDictionary({
                name: 'Accounts',
                aspect: aspectId,
                keyProperty: 'cdict:accountNumber',
                versionProperty: 'cdict:accountDictVersion'
            });
            assert.fail('Expected createCascadingDictionary to reject with 403');
        } catch (error: any) {
            assert.equal(error.status, 403);
        }
    });

    it('should return 200 while updating a cascading dictionary definition', async () => {
        cascadingDictionariesMock.get200ResponseUpdate(aspectId);
        const response = await cascadingDictionariesApi.updateCascadingDictionary(aspectId, { name: 'Chart of Accounts' });
        assert.ok(response.entry.modifiedAt instanceof Date);
    });

    it('should return 201 and create a minor version when majorVersion is not provided', async () => {
        cascadingDictionariesMock.get201ResponseContent(aspectId);
        const response: CascadingDictionaryEntry = await cascadingDictionariesApi.createCascadingDictionaryContent(aspectId, contentBody);
        assert.equal(response.entry.version, '1.1');
        assert.equal(response.entry.data.length, 1);
    });

    it('should return 201 and create a major version when majorVersion is true', async () => {
        cascadingDictionariesMock.get201ResponseContentMajorVersion(aspectId);
        const response: CascadingDictionaryEntry = await cascadingDictionariesApi.createCascadingDictionaryContent(aspectId, contentBody, {
            majorVersion: true
        });
        assert.equal(response.entry.version, '2.0');
    });

    it('should return 413 while uploading content that exceeds the size limit', async () => {
        cascadingDictionariesMock.get413ResponseContentTooLarge(aspectId);
        try {
            await cascadingDictionariesApi.createCascadingDictionaryContent(aspectId, contentBody);
            assert.fail('Expected createCascadingDictionaryContent to reject with 413');
        } catch (error: any) {
            assert.equal(error.status, 413);
        }
    });

    it('should return 422 while uploading content that fails validation', async () => {
        cascadingDictionariesMock.get422ResponseContentInvalid(aspectId);
        try {
            await cascadingDictionariesApi.createCascadingDictionaryContent(aspectId, contentBody);
            assert.fail('Expected createCascadingDictionaryContent to reject with 422');
        } catch (error: any) {
            assert.equal(error.status, 422);
        }
    });

    it('should return 204 while deleting a cascading dictionary', async () => {
        cascadingDictionariesMock.get204ResponseDelete(aspectId);
        await cascadingDictionariesApi.deleteCascadingDictionary(aspectId);
    });

    it('should return 403 while deleting a cascading dictionary without admin rights', async () => {
        cascadingDictionariesMock.get403ResponseDeleteForbidden(aspectId);
        try {
            await cascadingDictionariesApi.deleteCascadingDictionary(aspectId);
            assert.fail('Expected deleteCascadingDictionary to reject with 403');
        } catch (error: any) {
            assert.equal(error.status, 403);
        }
    });
});
