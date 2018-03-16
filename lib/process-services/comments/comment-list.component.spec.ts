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

import { DatePipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentProcessModel, UserProcessModel } from '@alfresco/adf-core';
import { CommentListComponent } from './comment-list.component';
import { By } from '@angular/platform-browser';

const testUser: UserProcessModel = new UserProcessModel({
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    email: 'tu@domain.com'
});
const testDate = new Date();
const testComment: CommentProcessModel = new CommentProcessModel({
    id: 1,
    message: 'Test Comment',
    created: testDate.toDateString(),
    createdBy: testUser
});

const secondtestComment: CommentProcessModel = new CommentProcessModel({
    id: 2,
    message: '2nd Test Comment',
    created: new Date().toDateString(),
    createdBy: testUser
});

describe('CommentListComponent', () => {

    let commentList: CommentListComponent;
    let fixture: ComponentFixture<CommentListComponent>;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({

            declarations: [
                CommentListComponent
            ],
            providers: [
                DatePipe
            ]
        }).compileComponents().then(() => {

            fixture = TestBed.createComponent(CommentListComponent);
            commentList = fixture.componentInstance;
            element = fixture.nativeElement;
            fixture.detectChanges();
        });
    }));

    it('should emit row click event', async(() => {
        commentList.comments = [testComment];

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
        testComment.isSelected = true;
        commentList.selectedComment = testComment;
        commentList.comments = [testComment, secondtestComment];

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
        commentList.comments = [testComment];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let elements = fixture.nativeElement.querySelectorAll('#comment-message');
            expect(elements.length).toBe(1);
            expect(elements[0].innerText).toBe(testComment.message);
            expect(fixture.nativeElement.querySelector('#comment-message:empty')).toBeNull();
        });
    }));

    it('should show comment user when input is given', async(() => {
        commentList.comments = [testComment];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let elements = fixture.nativeElement.querySelectorAll('#comment-user');
            expect(elements.length).toBe(1);
            expect(elements[0].innerText).toBe(testComment.createdBy.firstName + ' ' + testComment.createdBy.lastName);
            expect(fixture.nativeElement.querySelector('#comment-user:empty')).toBeNull();
        });
    }));

    it('should show comment date time when input is given', async(() => {
        commentList.comments = [testComment];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let elements = fixture.nativeElement.querySelectorAll('#comment-time');
            expect(elements.length).toBe(1);
            expect(elements[0].innerText).toBe(commentList.transformDate(testDate.toDateString()));
            expect(fixture.nativeElement.querySelector('#comment-time:empty')).toBeNull();
        });
    }));

    it('comment date time should start with Today when comment date is today', async(() => {
        commentList.comments = [testComment];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            element = fixture.nativeElement.querySelector('#comment-time');
            expect(element.innerText).toContain('Today');
        });
    }));

    it('comment date time should start with Yesterday when comment date is yesterday', async(() => {
        testComment.created = new Date((Date.now() - 24 * 3600 * 1000));
        commentList.comments = [testComment];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            element = fixture.nativeElement.querySelector('#comment-time');
            expect(element.innerText).toContain('Yesterday');
        });
    }));

    it('comment date time should not start with Today/Yesterday when comment date is before yesterday', async(() => {
        testComment.created = new Date((Date.now() - 24 * 3600 * 1000 * 2));
        commentList.comments = [testComment];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            element = fixture.nativeElement.querySelector('#comment-time');
            expect(element.innerText).not.toContain('Today');
            expect(element.innerText).not.toContain('Yesterday');
        });
    }));

    it('should show user icon when input is given', async(() => {
        commentList.comments = [testComment];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            let elements = fixture.nativeElement.querySelectorAll('#comment-user-icon');
            expect(elements.length).toBe(1);
            expect(elements[0].innerText).toContain(commentList.getUserShortName(testComment.createdBy));
            expect(fixture.nativeElement.querySelector('#comment-user-icon:empty')).toBeNull();
        });
    }));
});
