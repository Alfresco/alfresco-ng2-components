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
import { AppConfigService, CoreModule, TranslationService } from 'ng2-alfresco-core';
import { DataRowEvent, DataTableModule, ObjectDataRow } from 'ng2-alfresco-datatable';
import { AppConfigServiceMock } from '../assets/app-config.service.mock';
import { TranslationMock } from '../assets/translation.service.mock';
import { Comment  } from '../models/comment.model';
import { User } from '../models/user.model';
import { CommentListComponent } from './comment-list.component';

declare let jasmine: any;

const testUser: User = new User({
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    email: 'tu@domain.com'
});
const testDate = new Date();
const testComment: Comment = new Comment(1, 'Test Comment', testDate.toDateString(), testUser);

describe('CommentListComponent', () => {

    let commentList: CommentListComponent;
    let fixture: ComponentFixture<CommentListComponent>;
    let element: HTMLElement;
    let componentHandler;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DataTableModule
            ],
            declarations: [
                CommentListComponent
            ],
            providers: [
                DatePipe,
                { provide: AppConfigService, useClass: AppConfigServiceMock },
                { provide: TranslationService, useClass: TranslationMock }
            ]
        }).compileComponents().then(() => {

            fixture = TestBed.createComponent(CommentListComponent);
            commentList = fixture.componentInstance;
            element = fixture.nativeElement;
            componentHandler = jasmine.createSpyObj('componentHandler', [
                'upgradeAllRegistered'
            ]);

            window['componentHandler'] = componentHandler;
            fixture.detectChanges();
        });
    }));

    it('should emit row click event', (done) => {
        let row = new ObjectDataRow(testComment);
        let rowEvent = new DataRowEvent(row, null);

        commentList.clickRow.subscribe(selectedComment => {
            expect(selectedComment.id).toEqual(1);
            expect(selectedComment.message).toEqual('Test Comment');
            expect(selectedComment.createdBy).toEqual(testUser);
            expect(selectedComment.created).toEqual(testDate.toDateString());
            done();
        });

        commentList.selectComment(rowEvent);
    });

    it('should not show comment list if no input is given', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('adf-datatable')).toBeNull();
    });

    it('should show comment message when input is given', () => {
        commentList.comments = [testComment];
        fixture.detectChanges();
        let elements = fixture.nativeElement.querySelectorAll('#comment-message');
        expect(elements.length).toBe(1);
        expect(elements[0].innerText).toBe(testComment.message);
        expect(fixture.nativeElement.querySelector('#comment-message:empty')).toBeNull();
    });

    it('should show comment user when input is given', () => {
        commentList.comments = [testComment];
        fixture.detectChanges();
        let elements = fixture.nativeElement.querySelectorAll('#comment-user');
        expect(elements.length).toBe(1);
        expect(elements[0].innerText).toBe(testComment.createdBy.firstName + ' ' + testComment.createdBy.lastName);
        expect(fixture.nativeElement.querySelector('#comment-user:empty')).toBeNull();
    });

    it('should show comment date time when input is given', () => {
        commentList.comments = [testComment];
        fixture.detectChanges();
        let elements = fixture.nativeElement.querySelectorAll('#comment-time');
        expect(elements.length).toBe(1);
        expect(elements[0].innerText).toBe(commentList.transformDate(testDate.toDateString()));
        expect(fixture.nativeElement.querySelector('#comment-time:empty')).toBeNull();
    });

    it('comment date time should start with Today when comment date is today', () => {
        commentList.comments = [testComment];
        fixture.detectChanges();
        element = fixture.nativeElement.querySelector('#comment-time');
        expect(element.innerText).toContain('Today');
    });

    it('comment date time should start with Yesterday when comment date is yesterday', () => {
        testComment.created = (Date.now() - 24 * 3600 * 1000).toString();
        commentList.comments = [testComment];
        fixture.detectChanges();
        element = fixture.nativeElement.querySelector('#comment-time');
        expect(element.innerText).toContain('Yesterday');
    });

    it('comment date time should not start with Today/Yesterday when comment date is before yesterday', () => {
        testComment.created = (Date.now() - 24 * 3600 * 1000 * 2).toString();
        commentList.comments = [testComment];
        fixture.detectChanges();
        element = fixture.nativeElement.querySelector('#comment-time');
        expect(element.innerText).not.toContain('Today');
        expect(element.innerText).not.toContain('Yesterday');
    });

    it('should show user icon when input is given', () => {
        commentList.comments = [testComment];
        fixture.detectChanges();
        let elements = fixture.nativeElement.querySelectorAll('#comment-user-icon');
        expect(elements.length).toBe(1);
        expect(elements[0].innerText).toContain(commentList.getUserShortName(testComment.createdBy));
        expect(fixture.nativeElement.querySelector('#comment-user-icon:empty')).toBeNull();
    });
});
