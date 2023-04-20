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

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsComponent } from './comments.component';
import { setupTestBed } from '../testing/setup-test-bed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommentsServiceMock, commentsResponseMock } from './mocks/comments.service.mock';
import { ADF_COMMENTS_SERVICE, CommentsService } from './interfaces';
import { of, throwError } from 'rxjs';

describe('CommentsComponent', () => {
    let component: CommentsComponent;
    let fixture: ComponentFixture<CommentsComponent>;
    let getCommentSpy: jasmine.Spy;
    let addCommentSpy: jasmine.Spy;
    let commentsService: CommentsService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
            {
                provide: ADF_COMMENTS_SERVICE,
                useClass: CommentsServiceMock
            }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CommentsComponent);
        component = fixture.componentInstance;

        commentsService = fixture.componentInstance['commentsService'];

        getCommentSpy = spyOn(commentsService, 'get').and.returnValue(commentsResponseMock.getComments());
        addCommentSpy = spyOn(commentsService, 'add').and.returnValue(commentsResponseMock.addComment());
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should load comments when id specified', () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({id: change});

        expect(getCommentSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading comments', () => {
        const emitSpy = spyOn(component.error, 'emit');
        getCommentSpy.and.returnValue(throwError({}));

        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({id: change});

        expect(emitSpy).toHaveBeenCalled();
    });

    it('should not load comments when no id is specified', () => {
        fixture.detectChanges();
        expect(getCommentSpy).not.toHaveBeenCalled();
    });

    it('should display comments when the entity has comments', async () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({id: change});

        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelectorAll('.adf-comment-message').length).toBe(3);
        expect(fixture.nativeElement.querySelector('.adf-comment-message:empty')).toBeNull();
    });

    it('should display comments count when the entity has comments', async () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({id: change});

        fixture.detectChanges();
        await fixture.whenStable();

        const element = fixture.nativeElement.querySelector('#comment-header');
        expect(element.innerText).toBe('COMMENTS.HEADER');
    });

    it('should not display comments when the entity has no comments', async () => {
        component.id = '123';
        getCommentSpy.and.returnValue(of([]));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('#comment-container')).toBeNull();
    });

    it('should display comments input by default', async () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({id: change});

        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('#comment-input')).not.toBeNull();
    });

    it('should not display comments input when the entity is readonly', async () => {
        component.readOnly = true;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('#comment-input')).toBeNull();
    });

    describe('Change detection id', () => {
        const change = new SimpleChange('123', '456', true);
        const nullChange = new SimpleChange('123', null, true);

        beforeEach(() => {
            component.id = '123';
            fixture.detectChanges();
        });

        it('should fetch new comments when id changed', () => {
            component.ngOnChanges({id: change});
            expect(getCommentSpy).toHaveBeenCalledWith('456');
        });

        it('should not fetch new comments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getCommentSpy).not.toHaveBeenCalled();
        });

        it('should not fetch new comments when id changed to null', () => {
            component.ngOnChanges({id: nullChange});
            expect(getCommentSpy).not.toHaveBeenCalled();
        });
    });

    describe('Add comment', () => {

        beforeEach(() => {
            component.id = '123';
            fixture.detectChanges();
            fixture.whenStable();
        });

        it('should sanitize comment when user input contains html elements', async () => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = '<div class="text-class"><button onclick=""><h1>action</h1></button></div>';
            element.dispatchEvent(new Event('click'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(addCommentSpy).toHaveBeenCalledWith('123', 'action');
        });

        it('should normalize comment when user input contains spaces sequence', async () => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = 'test comment';
            element.dispatchEvent(new Event('click'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(addCommentSpy).toHaveBeenCalledWith('123', 'test comment');
        });

        it('should add break lines to comment when user input contains new line characters', async () => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = 'these\nare\nparagraphs\n';
            element.dispatchEvent(new Event('click'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(addCommentSpy).toHaveBeenCalledWith('123', 'these<br/>are<br/>paragraphs');
        });

        it('should call service to add a comment when add button is pressed', async () => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');

            component.message = 'Test Comment';
            addCommentSpy.and.returnValue(commentsResponseMock.addComment(component.message));

            element.dispatchEvent(new Event('click'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(addCommentSpy).toHaveBeenCalled();
            const elements = fixture.nativeElement.querySelectorAll('.adf-comment-message');
            expect(elements.length).toBe(1);
            expect(elements[0].innerText).toBe('Test Comment');
        });

        it('should not call service to add a comment when comment is empty', async () => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = '';
            element.dispatchEvent(new Event('click'));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(addCommentSpy).not.toHaveBeenCalled();
        });

        it('should clear comment when escape key is pressed', async () => {
            const event = new KeyboardEvent('keydown', {key: 'Escape'});
            let element = fixture.nativeElement.querySelector('#comment-input');
            element.dispatchEvent(event);

            fixture.detectChanges();
            await fixture.whenStable();

            element = fixture.nativeElement.querySelector('#comment-input');
            expect(element.value).toBe('');
        });

        it('should emit an error when an error occurs adding the comment', () => {
            const emitSpy = spyOn(component.error, 'emit');
            addCommentSpy.and.returnValue(throwError({}));
            component.message = 'Test comment';
            component.addComment();
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should set beingAdded variable back to false when an error occurs adding the comment', () => {
            addCommentSpy.and.returnValue(throwError({}));
            component.addComment();
            expect(component.beingAdded).toBeFalse();
        });

        it('should set beingAdded variable back to false on successful response when adding the comment', () => {
            addCommentSpy.and.returnValue(commentsResponseMock.addComment());
            component.addComment();
            expect(component.beingAdded).toBeFalse();
        });

        it('should not add comment if id is not provided', () => {
            component.id = '';
            component.addComment();
            expect(addCommentSpy).not.toHaveBeenCalled();
        });

        it('should not add comment if message is empty', () => {
            component.message = '';
            component.addComment();
            expect(addCommentSpy).not.toHaveBeenCalled();
        });
   });
});
