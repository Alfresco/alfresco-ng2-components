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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentModel } from '../../models/comment.model';
import { CommentListComponent } from './comment-list.component';
import { commentUserNoPictureDefined, commentUserPictureDefined, mockCommentOne, testUser } from './mocks/comment-list.mock';
import { CommentListServiceMock } from './mocks/comment-list.service.mock';
import { ADF_COMMENTS_SERVICE } from '../interfaces/comments.token';
import { NoopTranslateModule } from '../../testing/noop-translate.module';
import { UnitTestingUtils } from '../../testing/unit-testing-utils';

describe('CommentListComponent', () => {
    let commentList: CommentListComponent;
    let fixture: ComponentFixture<CommentListComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule],
            providers: [
                {
                    provide: ADF_COMMENTS_SERVICE,
                    useClass: CommentListServiceMock
                }
            ]
        });
        fixture = TestBed.createComponent(CommentListComponent);
        commentList = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);

        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should emit row click event', (done) => {
        commentList.comments = [mockCommentOne];

        commentList.clickRow.subscribe((selectedComment: CommentModel) => {
            expect(selectedComment.id).toEqual(1);
            expect(selectedComment.message).toEqual('Test Comment');
            expect(selectedComment.createdBy).toEqual(testUser);
            done();
        });

        fixture.detectChanges();

        testingUtils.clickByCSS('.adf-comment-list-item');
    });

    it('should not show comment list if no input is given', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(testingUtils.getByCSS('adf-datatable')).toBeNull();
    });

    it('should show comment message when input is given', async () => {
        commentList.comments = [mockCommentOne];

        fixture.detectChanges();
        await fixture.whenStable();

        const elements = testingUtils.getAllByCSS('.adf-comment-message');
        expect(elements.length).toBe(1);
        expect(elements[0].nativeElement.innerText).toBe(mockCommentOne.message);
        expect(testingUtils.getByCSS('.adf-comment-message:empty')).toBeNull();
    });

    it('should show comment user when input is given', async () => {
        commentList.comments = [mockCommentOne];

        fixture.detectChanges();
        await fixture.whenStable();

        const elements = testingUtils.getAllByCSS('.adf-comment-user-name');
        expect(elements.length).toBe(1);
        expect(elements[0].nativeElement.innerText).toBe(mockCommentOne.userDisplayName);
        expect(testingUtils.getByCSS('.adf-comment-user-name:empty')).toBeNull();
    });

    it('comment date time should start with few seconds ago when comment date is few seconds ago', async () => {
        const commentFewSecond = new CommentModel(mockCommentOne);
        commentFewSecond.created = new Date();

        commentList.comments = [commentFewSecond];

        fixture.detectChanges();
        await fixture.whenStable();

        expect(testingUtils.getInnerTextByCSS('.adf-comment-message-time')).toContain('less than a minute ago');
    });

    it('comment date time should start with Yesterday when comment date is yesterday', async () => {
        const commentOld = new CommentModel(mockCommentOne);
        commentOld.created = new Date(Date.now() - 24 * 3600 * 1000);
        commentList.comments = [commentOld];

        fixture.detectChanges();
        await fixture.whenStable();

        expect(testingUtils.getInnerTextByCSS('.adf-comment-message-time')).toContain('1 day ago');
    });

    it('comment date time should not start with Today/Yesterday when comment date is before yesterday', async () => {
        const commentOld = new CommentModel(mockCommentOne);
        commentOld.created = new Date(Date.now() - 24 * 3600 * 1000 * 2);
        commentList.comments = [commentOld];

        fixture.detectChanges();
        await fixture.whenStable();

        const msgTime = testingUtils.getInnerTextByCSS('.adf-comment-message-time');
        expect(msgTime).not.toContain('Today');
        expect(msgTime).not.toContain('Yesterday');
    });

    it('should show user icon when input is given', async () => {
        commentList.comments = [mockCommentOne];

        fixture.detectChanges();
        await fixture.whenStable();

        const elements = testingUtils.getAllByCSS('.adf-comment-img-container');
        expect(elements.length).toBe(1);
        expect(elements[0].nativeElement.innerText).toContain(mockCommentOne.userInitials);
        expect(testingUtils.getByCSS('.adf-comment-img-container:empty')).toBeNull();
    });

    it('should return picture when is a user with a picture', async () => {
        commentList.comments = [commentUserPictureDefined];

        fixture.detectChanges();
        await fixture.whenStable();

        const elements = testingUtils.getAllByCSS('.adf-people-img');
        expect(elements.length).toBe(1);
    });

    it('should return short name when is a user without a picture', async () => {
        commentList.comments = [commentUserNoPictureDefined];

        fixture.detectChanges();
        await fixture.whenStable();

        const elements = testingUtils.getAllByCSS('.adf-comment-user-icon');
        expect(elements.length).toBe(1);
    });

    it('should display image using pictureId if available', async () => {
        const comment = new CommentModel({
            id: 1,
            message: 'With pictureId only',
            created: new Date(),
            createdBy: {
                firstName: 'Pic',
                lastName: 'User',
                pictureId: 1001
            }
        });

        commentList.comments = [comment];
        fixture.detectChanges();
        await fixture.whenStable();

        const img = testingUtils.getByCSS('.adf-people-img');
        expect(img).not.toBeNull();
        expect(img.nativeElement.src).toContain('1001');
    });

    it('should display image using avatarId if pictureId is not available', async () => {
        const comment = new CommentModel({
            id: 2,
            message: 'With avatarId only',
            created: new Date(),
            createdBy: {
                firstName: 'Avatar',
                lastName: 'User',
                avatarId: 'avatar-xyz'
            }
        });

        commentList.comments = [comment];
        fixture.detectChanges();
        await fixture.whenStable();

        const img = testingUtils.getByCSS('.adf-people-img');
        expect(img).not.toBeNull();
        expect(img.nativeElement.src).toContain('avatar-xyz');
    });

    it('should prefer pictureId over avatarId if both are available', async () => {
        const comment = new CommentModel({
            id: 3,
            message: 'With both',
            created: new Date(),
            createdBy: {
                pictureId: 2002,
                avatarId: 'avatar-abc'
            }
        });

        commentList.comments = [comment];
        fixture.detectChanges();
        await fixture.whenStable();

        const img = testingUtils.getByCSS('.adf-people-img');
        expect(img).not.toBeNull();
        expect(img.nativeElement.src).toContain('2002');
    });

    it('should display user initials if neither pictureId nor avatarId is present', async () => {
        const comment = new CommentModel({
            id: 4,
            message: 'No avatar',
            created: new Date(),
            createdBy: {
                firstName: 'No',
                lastName: 'Avatar'
            }
        });

        commentList.comments = [comment];
        fixture.detectChanges();
        await fixture.whenStable();

        const icon = testingUtils.getByCSS('.adf-comment-user-icon');
        expect(icon).not.toBeNull();
        expect(icon.nativeElement.innerText).toBe('NA');
    });
});
