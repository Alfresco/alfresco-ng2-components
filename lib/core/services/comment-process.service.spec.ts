/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { CommentModel } from '../models/comment.model';
import { fakeProcessComment, fakeTasksComment, fakeUser1 } from '../mock/comment-process.mock';
import { CommentProcessService } from './comment-process.service';
import { setupTestBed } from '../testing/setup-test-bed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('Comment ProcessService Service', () => {

    let service: CommentProcessService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(CommentProcessService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('Process comments', () => {

        const processId = '1001';

        describe('get comments', () => {

            let getProcessInstanceComments: jasmine.Spy;

            beforeEach(() => {
                getProcessInstanceComments = spyOn(service['commentsApi'], 'getProcessInstanceComments')
                    .and
                    .returnValue(Promise.resolve({ data: [fakeProcessComment, fakeProcessComment] }) as any);
            });

            it('should return the correct number of comments', (done) => {
                service.getProcessInstanceComments(processId).subscribe((tasks) => {
                    expect(tasks.length).toBe(2);
                    done();
                });
            });

            it('should return the correct comment data', (done) => {
                service.getProcessInstanceComments(processId).subscribe((comments) => {
                    const comment: any = comments[0];
                    expect(comment.id).toBe(fakeProcessComment.id);
                    expect(comment.created).toBe(fakeProcessComment.created);
                    expect(comment.message).toBe(fakeProcessComment.message);
                    expect(comment.createdBy.id).toBe(fakeProcessComment.createdBy.id);
                    done();
                });
            });

            it('should call service to fetch process instance comments', () => {
                service.getProcessInstanceComments(processId);
                expect(getProcessInstanceComments).toHaveBeenCalledWith(processId);
            });

            it('should return a default error if no data is returned by the API', (done) => {
                getProcessInstanceComments = getProcessInstanceComments.and.returnValue(Promise.reject(null));
                service.getProcessInstanceComments(processId).subscribe(
                    () => {
                    },
                    (res) => {
                        expect(res).toBe('Server error');
                        done();
                    }
                );
            });

        });

        describe('add comment', () => {

            const message = 'Test message';
            let addProcessInstanceComment: jasmine.Spy;

            beforeEach(() => {
                addProcessInstanceComment = spyOn(service['commentsApi'], 'addProcessInstanceComment')
                    .and
                    .returnValue(Promise.resolve(fakeProcessComment) as any);
            });

            it('should call service to add comment', () => {
                service.addProcessInstanceComment(processId, message);
                expect(addProcessInstanceComment).toHaveBeenCalledWith({
                    message
                }, processId);
            });

            it('should return the created comment', (done) => {
                service.addProcessInstanceComment(processId, message).subscribe((comment) => {
                    expect(comment.id).toBe(fakeProcessComment.id);
                    expect(comment.created).toBe(fakeProcessComment.created);
                    expect(comment.message).toBe(fakeProcessComment.message);
                    expect(comment.createdBy).toBe(fakeProcessComment.createdBy);
                    done();
                });
            });

            it('should return a default error if no data is returned by the API', (done) => {
                addProcessInstanceComment = addProcessInstanceComment.and.returnValue(Promise.reject(null));
                service.addProcessInstanceComment(processId, message).subscribe(
                    () => {
                    },
                    (res) => {
                        expect(res).toBe('Server error');
                        done();
                    }
                );
            });

        });
    });

    describe('Task  comments', () => {

        it('should add a comment task ', (done) => {
            service.addTaskComment('999', 'fake-comment-message').subscribe(
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
                responseText: JSON.stringify({
                    id: '111', message: 'fake-comment-message',
                    createdBy: fakeUser1,
                    created: '2016-07-15T11:19:17.440+0000'
                })
            });
        });

        it('should return the tasks comments ', (done) => {
            service.getTaskComments('999').subscribe(
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
                responseText: JSON.stringify(fakeTasksComment)
            });
        });
    });
});
