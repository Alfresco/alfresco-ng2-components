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

import { expect } from 'chai';
import { AlfrescoApi, TagBody, TagEntry, TagPaging, TagsApi } from '../../src';
import { EcmAuthMock, TagMock } from '../mockObjects';

describe('Tags', () => {
    let authResponseMock: EcmAuthMock;
    let tagMock: TagMock;
    let tagsApi: TagsApi;

    beforeEach((done) => {
        const hostEcm = 'http://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        tagMock = new TagMock();

        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        alfrescoJsApi.login('admin', 'admin').then(() => {
            done();
        });

        tagsApi = new TagsApi(alfrescoJsApi);
    });

    describe('listTags', () => {
        it('should load list of tags', (done) => {
            tagMock.get200Response();

            tagsApi.listTags().then((data) => {
                expect(data.list.pagination.count).equal(2);
                expect(data.list.entries[0].entry.tag).equal('tag-test-1');
                expect(data.list.entries[1].entry.tag).equal('tag-test-2');
                done();
            });
        });

        it('should handle 401 error', (done) => {
            tagMock.get401Response();

            tagsApi.listTags().then(
                () => {},
                () => {
                    done();
                }
            );
        });

        it('should return specified tag', (done) => {
            tagMock.getTagsByNamesFilterByExactTag200Response();

            tagsApi
                .listTags({
                    tag: 'tag-test-1'
                })
                .then((data) => {
                    expect(data.list.entries[0].entry.tag).to.equal('tag-test-1');
                    expect(data.list.entries[0].entry.id).to.equal('0d89aa82-f2b8-4a37-9a54-f4c5148174d6');
                    done();
                });
        });

        it('should return tags contained specified value', (done) => {
            tagMock.getTagsByNameFilteredByMatching200Response();

            tagsApi
                .listTags({
                    tag: '*tag-test*',
                    matching: true
                })
                .then((data) => {
                    expect(data?.list.entries.length).to.equal(2);

                    expect(data.list.entries[0].entry.tag).to.equal('tag-test-1');
                    expect(data.list.entries[0].entry.id).to.equal('0d89aa82-f2b8-4a37-9a54-f4c5148174d6');

                    expect(data.list.entries[1].entry.tag).to.equal('tag-test-2');
                    expect(data.list.entries[1].entry.id).to.equal('d79bdbd0-9f55-45bb-9521-811e15bf48f6');

                    done();
                });
        });
    });

    describe('createTags', () => {
        it('should return created tags', (done: Mocha.Done) => {
            tagMock.createTags201Response();
            tagsApi.createTags([new TagBody(), new TagBody()]).then((tags: TagEntry[]) => {
                expect(tags).length(2);
                expect(tags[0].entry.tag).equal('tag-test-1');
                expect(tags[1].entry.tag).equal('tag-test-2');
                done();
            });
        });

        it('should throw error if tags are not passed', () => {
            expect(tagsApi.createTags.bind(tagsApi, null)).throw();
        });
    });

    describe('assignTagsToNode', () => {
        it('should return tags after assigning them to node', (done) => {
            const tag1 = new TagBody();
            tag1.tag = 'tag-test-1';
            const tag2 = new TagBody();
            tag2.tag = 'tag-test-2';
            const tags = [tag1, tag2];
            tagMock.get201ResponseForAssigningTagsToNode(tags);

            tagsApi.assignTagsToNode('someNodeId', tags).then((data) => {
                const tagPaging = data as TagPaging;
                expect(tagPaging.list.pagination.count).equal(2);
                expect(tagPaging.list.entries[0].entry.tag).equal(tag1.tag);
                expect(tagPaging.list.entries[1].entry.tag).equal(tag2.tag);
                done();
            });
        });

        it('should return tag after assigning it to node', (done) => {
            const tag = new TagBody();
            tag.tag = 'tag-test-1';
            const tags = [tag];
            tagMock.get201ResponseForAssigningTagsToNode(tags);

            tagsApi.assignTagsToNode('someNodeId', tags).then((data) => {
                const tagEntry = data as TagEntry;
                expect(tagEntry.entry.tag).equal(tag.tag);
                done();
            });
        });
    });
});
