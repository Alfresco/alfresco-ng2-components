/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentModel, UserProcessModel } from '../models';
import { CommentListComponent } from './comment-list.component';
import { By } from '@angular/platform-browser';
import { EcmUserService } from '../userinfo/services/ecm-user.service';
import { PeopleProcessService } from '../services/people-process.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

const testUser: UserProcessModel = new UserProcessModel({
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    email: 'tu@domain.com'
});
const testDate = new Date();
const processCommentOne: CommentModel = new CommentModel({
    id: 1,
    message: 'Test Comment',
    created: testDate.toDateString(),
    createdBy: testUser
});

const processCommentTwo: CommentModel = new CommentModel({
    id: 2,
    message: '2nd Test Comment',
    created: new Date().toDateString(),
    createdBy: testUser
});

const contentCommentUserPictureDefined: CommentModel = new CommentModel({
    id: 2,
    message: '2nd Test Comment',
    created: new Date().toDateString(),
    createdBy: {
        enabled: true,
        firstName: 'some',
        lastName: 'one',
        email: 'some-one@somegroup.com',
        emailNotificationsEnabled: true,
        company: {},
        id: 'fake-email@dom.com',
        avatarId: '001-001-001'
    }
});

const processCommentUserPictureDefined: CommentModel = new CommentModel({
    id: 2,
    message: '2nd Test Comment',
    created: new Date().toDateString(),
    createdBy: {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'tu@domain.com',
        pictureId: '001-001-001'
    }
});

const contentCommentUserNoPictureDefined: CommentModel = new CommentModel({
    id: 2,
    message: '2nd Test Comment',
    created: new Date().toDateString(),
    createdBy: {
        enabled: true,
        firstName: 'some',
        lastName: 'one',
        email: 'some-one@somegroup.com',
        emailNotificationsEnabled: true,
        company: {},
        id: 'fake-email@dom.com'
    }
});

const processCommentUserNoPictureDefined: CommentModel = new CommentModel({
    id: 2,
    message: '2nd Test Comment',
    created: new Date().toDateString(),
    createdBy: {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'tu@domain.com'
    }
});

describe('CommentListComponent', () => {

    let commentList: CommentListComponent;
    let fixture: ComponentFixture<CommentListComponent>;
    let element: HTMLElement;
    let ecmUserService: EcmUserService;
    let peopleProcessService: PeopleProcessService;

    setupTestBed({
        imports: [CoreTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(async(() => {
        ecmUserService = TestBed.get(EcmUserService);
        spyOn(ecmUserService, 'getUserProfileImage').and.returnValue('content-user-image');

        peopleProcessService = TestBed.get(PeopleProcessService);
        spyOn(peopleProcessService, 'getUserImage').and.returnValue('process-user-image');

        fixture = TestBed.createComponent(CommentListComponent);
        commentList = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    }));

    afterEach(() => {
        fixture.destroy();
    });

    it('should emit row click event', async(() => {
        commentList.comments = [processCommentOne];

        commentList.clickRow.subscribe(selectedComment => {
            expect(selectedComment.id).toEqual(1);
            expect(selectedComment.message).toEqual('Test Comment');
            expect(selectedComment.createdBy).toEqual(testUser);
            expect(selectedComment.created).toEqual(testDate.toDateString());
            expect(selectedComment.isSelected).toBeTruthy();
        });

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let comment = fixture.debugElement.query(By.css('#adf-comment-1'));
            comment.triggerEventHandler('click', null);
        });
    }));

    it('should deselect the previous selected comment when a new one is clicked', async(() => {
        processCommentOne.isSelected = true;
        commentList.selectedComment = processCommentOne;
        commentList.comments = [processCommentOne, processCommentTwo];

        commentList.clickRow.subscribe(selectedComment => {
            fixture.detectChanges();
            let commentSelectedList = fixture.nativeElement.querySelectorAll('.is-selected');
            expect(commentSelectedList.length).toBe(1);
            expect(commentSelectedList[0].textContent).toContain('2nd Test Comment');
        });

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let comment = fixture.debugElement.query(By.css('#adf-comment-2'));
            comment.triggerEventHandler('click', null);
        });
    }));

    it('should not show comment list if no input is given', async(() => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('adf-datatable')).toBeNull();
        });
    }));

    it('should show comment message when input is given', async(() => {
        commentList.comments = [processCommentOne];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let elements = fixture.nativeElement.querySelectorAll('#comment-message');
            expect(elements.length).toBe(1);
            expect(elements[0].innerText).toBe(processCommentOne.message);
            expect(fixture.nativeElement.querySelector('#comment-message:empty')).toBeNull();
        });
    }));

    it('should show comment user when input is given', async(() => {
        commentList.comments = [processCommentOne];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let elements = fixture.nativeElement.querySelectorAll('#comment-user');
            expect(elements.length).toBe(1);
            expect(elements[0].innerText).toBe(processCommentOne.createdBy.firstName + ' ' + processCommentOne.createdBy.lastName);
            expect(fixture.nativeElement.querySelector('#comment-user:empty')).toBeNull();
        });
    }));

    it('should show comment date time when input is given', async(() => {
        commentList.comments = [processCommentOne];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let elements = fixture.nativeElement.querySelectorAll('#comment-time');
            expect(elements.length).toBe(1);
            expect(elements[0].innerText).toBe(commentList.transformDate(testDate.toDateString()));
            expect(fixture.nativeElement.querySelector('#comment-time:empty')).toBeNull();
        });
    }));

    it('comment date time should start with Today when comment date is today', async(() => {
        commentList.comments = [processCommentOne];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            element = fixture.nativeElement.querySelector('#comment-time');
            expect(element.innerText).toContain('Today');
        });
    }));

    it('comment date time should start with Yesterday when comment date is yesterday', async(() => {
        processCommentOne.created = new Date((Date.now() - 24 * 3600 * 1000));
        commentList.comments = [processCommentOne];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            element = fixture.nativeElement.querySelector('#comment-time');
            expect(element.innerText).toContain('Yesterday');
        });
    }));

    it('comment date time should not start with Today/Yesterday when comment date is before yesterday', async(() => {
        processCommentOne.created = new Date((Date.now() - 24 * 3600 * 1000 * 2));
        commentList.comments = [processCommentOne];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            element = fixture.nativeElement.querySelector('#comment-time');
            expect(element.innerText).not.toContain('Today');
            expect(element.innerText).not.toContain('Yesterday');
        });
    }));

    it('should show user icon when input is given', async(() => {
        commentList.comments = [processCommentOne];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let elements = fixture.nativeElement.querySelectorAll('#comment-user-icon');
            expect(elements.length).toBe(1);
            expect(elements[0].innerText).toContain(commentList.getUserShortName(processCommentOne.createdBy));
            expect(fixture.nativeElement.querySelector('#comment-user-icon:empty')).toBeNull();
        });
    }));

    it('should return content picture when is a content user with a picture', async(() => {
        commentList.comments = [contentCommentUserPictureDefined];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let elements = fixture.nativeElement.querySelectorAll('.adf-people-img');
            expect(elements.length).toBe(1);
            expect(fixture.nativeElement.getElementsByClassName('adf-people-img')[0].src).toContain('content-user-image');
        });
    }));

    it('should return process picture when is a process user with a picture', async(() => {
        commentList.comments = [processCommentUserPictureDefined];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let elements = fixture.nativeElement.querySelectorAll('.adf-people-img');
            expect(elements.length).toBe(1);
            expect(fixture.nativeElement.getElementsByClassName('adf-people-img')[0].src).toContain('process-user-image');
        });
    }));

    it('should return content short name when is a content user without a picture', async(() => {
        commentList.comments = [contentCommentUserNoPictureDefined];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let elements = fixture.nativeElement.querySelectorAll('.adf-comment-user-icon');
            expect(elements.length).toBe(1);
        });
    }));

    it('should return process short name when  is a process user without a picture', async(() => {
        commentList.comments = [processCommentUserNoPictureDefined];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let elements = fixture.nativeElement.querySelectorAll('.adf-comment-user-icon');
            expect(elements.length).toBe(1);
        });
    }));
});
