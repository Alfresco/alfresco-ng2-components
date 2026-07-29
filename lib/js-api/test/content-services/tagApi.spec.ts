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
import { AlfrescoApi, TagBody, TagEntry, TagsApi } from '../../src';
import { EcmAuthMock, TagMock } from '../mockObjects';
import { describe, it, beforeEach, afterEach } from 'node:test';

describe('Tags', () => {
    let authResponseMock: EcmAuthMock;
    let tagMock: TagMock;
    let tagsApi: TagsApi;

    beforeEach(async () => {
        const hostEcm = 'https://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        tagMock = new TagMock(hostEcm);

        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        await alfrescoJsApi.login('admin', 'admin');

        tagsApi = new TagsApi(alfrescoJsApi);
    });

    afterEach(() => {
        resetGlobalMockAgent();
    });

    describe('listTags', () => {
        it('should load list of tags', async () => {
            tagMock.get200Response();

            const data = await tagsApi.listTags();
            assert.equal(data.list.pagination.count, 2);
            assert.equal(data.list.entries[0].entry.tag, 'tag-test-1');
            assert.equal(data.list.entries[1].entry.tag, 'tag-test-2');
        });

        it('should handle 401 error', async () => {
            tagMock.get401Response();

            try {
                await tagsApi.listTags();
                assert.fail('Expected listTags to throw error on 401 response');
            } catch (error: any) {
                assert.equal(error.status, 401, 'Error should have 401 status');
            }
        });

        it('should return specified tag', async () => {
            tagMock.getTagsByNamesFilterByExactTag200Response();

            const data = await tagsApi.listTags({
                tag: 'tag-test-1'
            });
            assert.equal(data.list.entries[0].entry.tag, 'tag-test-1');
            assert.equal(data.list.entries[0].entry.id, '0d89aa82-f2b8-4a37-9a54-f4c5148174d6');
        });

        it('should return tags contained specified value', async () => {
            tagMock.getTagsByNameFilteredByMatching200Response();

            const data = await tagsApi.listTags({
                tag: '*tag-test*',
                matching: true
            });
            assert.equal(data?.list.entries.length, 2);

            assert.equal(data.list.entries[0].entry.tag, 'tag-test-1');
            assert.equal(data.list.entries[0].entry.id, '0d89aa82-f2b8-4a37-9a54-f4c5148174d6');

            assert.equal(data.list.entries[1].entry.tag, 'tag-test-2');
            assert.equal(data.list.entries[1].entry.id, 'd79bdbd0-9f55-45bb-9521-811e15bf48f6');
        });
    });

    describe('createTags', () => {
        it('should return created tags', async () => {
            tagMock.createTags201Response();
            const tags = await tagsApi.createTags([new TagBody(), new TagBody()]);
            assert.equal(tags.list.entries.length, 2);
            assert.equal(tags.list.entries[0].entry.tag, 'tag-test-1');
            assert.equal(tags.list.entries[1].entry.tag, 'tag-test-2');
        });

        it('should throw error if tags are not passed', () => {
            assert.throws(tagsApi.createTags.bind(tagsApi, null));
        });
    });

    describe('assignTagsToNode', () => {
        it('should return tags after assigning them to node', async () => {
            const tag1 = new TagBody();
            tag1.tag = 'tag-test-1';
            const tag2 = new TagBody();
            tag2.tag = 'tag-test-2';
            const tags = [tag1, tag2];
            tagMock.get201ResponseForAssigningTagsToNode(tags);

            const tagPaging = await tagsApi.assignTagsToNode('someNodeId', tags);
            assert.equal(tagPaging.list.pagination.count, 2);
            assert.equal(tagPaging.list.entries[0].entry.tag, tag1.tag);
            assert.equal(tagPaging.list.entries[1].entry.tag, tag2.tag);
        });

        it('should return tag after assigning it to node', async () => {
            const tag = new TagBody();
            tag.tag = 'tag-test-1';
            const tags = [tag];
            tagMock.get201ResponseForAssigningTagsToNode(tags);

            const data = await tagsApi.assignTagsToNode('someNodeId', tags);
            const tagEntry = data as TagEntry;
            assert.equal(tagEntry.entry.tag, tag.tag);
        });
    });
});
