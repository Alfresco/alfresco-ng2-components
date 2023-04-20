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

import { TestBed } from '@angular/core/testing';
import { CommentModel, setupTestBed, CoreTestingModule } from '@alfresco/adf-core';
import { fakeContentComment, fakeContentComments } from '../mocks/node-comments.mock';
import { TranslateModule } from '@ngx-translate/core';
import { NodeCommentsService } from './node-comments.service';

declare let jasmine: any;

describe('NodeCommentsService', () => {

    let service: NodeCommentsService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(NodeCommentsService);

        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('Node  comments', () => {

        it('should add a comment node ', (done) => {
            service.add('999', 'fake-comment-message').subscribe(
                (res: CommentModel) => {
                    expect(res).toBeDefined();
                    expect(res.id).not.toEqual(null);
                    expect(res.message).toEqual('fake-comment-message');
                    expect(res.created).not.toEqual(null);
                    expect(res.createdBy.email).toEqual('fake-email@dom.com');
                    expect(res.createdBy.firstName).toEqual('firstName');
                    expect(res.createdBy.lastName).toEqual('lastName');
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeContentComment)
            });
        });

        it('should return the nodes comments ', (done) => {
            service.get('999').subscribe(
                (res: CommentModel[]) => {
                    expect(res).toBeDefined();
                    expect(res.length).toEqual(2);
                    expect(res[0].message).toEqual('fake-message-1');
                    expect(res[1].message).toEqual('fake-message-2');
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeContentComments)
            });
        });
    });
});
