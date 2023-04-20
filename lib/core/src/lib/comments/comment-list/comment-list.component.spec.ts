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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CommentModel } from '../../models/comment.model';
import { CommentListComponent } from './comment-list.component';
import { By } from '@angular/platform-browser';
import { setupTestBed } from '../../testing/setup-test-bed';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import {
    commentUserNoPictureDefined,
    commentUserPictureDefined,
    mockCommentOne,
    mockCommentTwo,
    testUser
} from './mocks/comment-list.mock';
import { CommentListServiceMock } from './mocks/comment-list.service.mock';
import { ADF_COMMENTS_SERVICE } from '../interfaces/comments.token';

describe('CommentListComponent', () => {

    let commentList: CommentListComponent;
    let fixture: ComponentFixture<CommentListComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
            {
                provide: ADF_COMMENTS_SERVICE,
                useClass: CommentListServiceMock
            }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CommentListComponent);
        commentList = fixture.componentInstance;

        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should emit row click event', fakeAsync(() => {
        commentList.comments = [Object.assign({}, mockCommentOne)];

        commentList.clickRow.subscribe((selectedComment: CommentModel) => {
            expect(selectedComment.id).toEqual(1);
            expect(selectedComment.message).toEqual('Test Comment');
            expect(selectedComment.createdBy).toEqual(testUser);
            expect(selectedComment.isSelected).toBeTruthy();
        });

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const comment = fixture.debugElement.query(By.css('#adf-comment-1'));
            comment.triggerEventHandler('click', null);
        });
    }));

    it('should deselect the previous selected comment when a new one is clicked', fakeAsync(() => {
        mockCommentOne.isSelected = true;
        const commentOne = Object.assign({}, mockCommentOne);
        const commentTwo = Object.assign({}, mockCommentTwo);
        commentList.selectedComment = commentOne;
        commentList.comments = [commentOne, commentTwo];

        commentList.clickRow.subscribe(() => {
            fixture.detectChanges();
            const commentSelectedList = fixture.nativeElement.querySelectorAll('.adf-is-selected');
            expect(commentSelectedList.length).toBe(1);
            expect(commentSelectedList[0].textContent).toContain('2nd Test Comment');
        });

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const comment = fixture.debugElement.query(By.css('#adf-comment-2'));
            comment.triggerEventHandler('click', null);
        });
    }));

    it('should not show comment list if no input is given', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('adf-datatable')).toBeNull();
    });

    it('should show comment message when input is given', async () => {
        commentList.comments = [Object.assign({}, mockCommentOne)];

        fixture.detectChanges();
        await fixture.whenStable();

        const elements = fixture.nativeElement.querySelectorAll('.adf-comment-message');
        expect(elements.length).toBe(1);
        expect(elements[0].innerText).toBe(mockCommentOne.message);
        expect(fixture.nativeElement.querySelector('.adf-comment-message:empty')).toBeNull();
    });

    it('should show comment user when input is given', async () => {
        commentList.comments = [Object.assign({}, mockCommentOne)];

        fixture.detectChanges();
        await fixture.whenStable();

        const elements = fixture.nativeElement.querySelectorAll('.adf-comment-user-name');
        expect(elements.length).toBe(1);
        expect(elements[0].innerText).toBe(mockCommentOne.createdBy.firstName + ' ' + mockCommentOne.createdBy.lastName);
        expect(fixture.nativeElement.querySelector('.adf-comment-user-name:empty')).toBeNull();
    });

    it('comment date time should start with few seconds ago when comment date is few seconds ago', async () => {
        const commentFewSecond = Object.assign({}, mockCommentOne);
        commentFewSecond.created = new Date();

        commentList.comments = [commentFewSecond];

        fixture.detectChanges();
        await fixture.whenStable();

        element = fixture.nativeElement.querySelector('.adf-comment-message-time');
        expect(element.innerText).toContain('a few seconds ago');
    });

    it('comment date time should start with Yesterday when comment date is yesterday', async () => {
        const commentOld = Object.assign({}, mockCommentOne);
        commentOld.created = new Date((Date.now() - 24 * 3600 * 1000));
        commentList.comments = [commentOld];

        fixture.detectChanges();
        await fixture.whenStable();

        element = fixture.nativeElement.querySelector('.adf-comment-message-time');
        expect(element.innerText).toContain('a day ago');
    });

    it('comment date time should not start with Today/Yesterday when comment date is before yesterday', async () => {
        const commentOld = Object.assign({}, mockCommentOne);
        commentOld.created = new Date((Date.now() - 24 * 3600 * 1000 * 2));
        commentList.comments = [commentOld];

        fixture.detectChanges();
        await fixture.whenStable();

        element = fixture.nativeElement.querySelector('.adf-comment-message-time');
        expect(element.innerText).not.toContain('Today');
        expect(element.innerText).not.toContain('Yesterday');
    });

    it('should show user icon when input is given', async () => {
        commentList.comments = [Object.assign({}, mockCommentOne)];

        fixture.detectChanges();
        await fixture.whenStable();

        const elements = fixture.nativeElement.querySelectorAll('.adf-comment-img-container');
        expect(elements.length).toBe(1);
        expect(elements[0].innerText).toContain(commentList.getUserShortName(mockCommentOne.createdBy));
        expect(fixture.nativeElement.querySelector('.adf-comment-img-container:empty')).toBeNull();
    });

    it('should return picture when is a user with a picture', async () => {
        commentList.comments = [commentUserPictureDefined];

        fixture.detectChanges();
        await fixture.whenStable();

        const elements = fixture.nativeElement.querySelectorAll('.adf-people-img');
        expect(elements.length).toBe(1);
    });

    it('should return short name when is a user without a picture', async () => {
        commentList.comments = [commentUserNoPictureDefined];

        fixture.detectChanges();
        await fixture.whenStable();

        const elements = fixture.nativeElement.querySelectorAll('.adf-comment-user-icon');
        expect(elements.length).toBe(1);
    });
});
