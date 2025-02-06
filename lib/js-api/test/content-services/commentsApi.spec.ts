/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AlfrescoApi, CommentsApi } from '../../src';
import { CommentMock, EcmAuthMock } from '../mockObjects';

describe('Comments', () => {
    let authResponseMock: EcmAuthMock;
    let commentMock: CommentMock;
    let commentsApi: CommentsApi;

    beforeEach((done) => {
        const hostEcm = 'https://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        commentMock = new CommentMock(hostEcm);

        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        commentsApi = new CommentsApi(alfrescoJsApi);

        alfrescoJsApi.login('admin', 'admin').then(() => {
            done();
        });
    });

    it('should add a comment', (done) => {
        commentMock.post201Response();

        commentsApi
            .createComment('74cd8a96-8a21-47e5-9b3b-a1b3e296787d', {
                content: 'This is a comment'
            })
            .then((data) => {
                assert.equal(data.entry.content, 'This is a comment');
                done();
            });
    });

    it('should get a comment', (done) => {
        commentMock.get200Response();

        commentsApi.listComments('74cd8a96-8a21-47e5-9b3b-a1b3e296787d').then((data) => {
            assert.equal(data.list.entries[0].entry.content, 'This is another comment');
            done();
        });
    });
});
