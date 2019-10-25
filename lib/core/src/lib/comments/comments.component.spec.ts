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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CommentProcessService } from '../services/comment-process.service';
import { CommentsComponent } from './comments.component';
import { CommentContentService } from '../services/comment-content.service';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreTestingModule } from '../testing/core.testing.module';

describe('CommentsComponent', () => {

    let component: CommentsComponent;
    let fixture: ComponentFixture<CommentsComponent>;
    let getProcessCommentsSpy: jasmine.Spy;
    let addProcessCommentSpy: jasmine.Spy;
    let addContentCommentSpy: jasmine.Spy;
    let getContentCommentsSpy: jasmine.Spy;
    let commentProcessService: CommentProcessService;
    let commentContentService: CommentContentService;

    setupTestBed({
        imports: [CoreTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CommentsComponent);
        component = fixture.componentInstance;

        commentProcessService = fixture.debugElement.injector.get(CommentProcessService);
        commentContentService = fixture.debugElement.injector.get(CommentContentService);

        addContentCommentSpy = spyOn(commentContentService, 'addNodeComment').and.returnValue(of({
            id: 123,
            message: 'Test Comment',
            createdBy: {id: '999'}
        }));

        getContentCommentsSpy = spyOn(commentContentService, 'getNodeComments').and.returnValue(of([
            {message: 'Test1', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}},
            {message: 'Test2', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}},
            {message: 'Test3', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}}
        ]));

        getProcessCommentsSpy = spyOn(commentProcessService, 'getTaskComments').and.returnValue(of([
            {message: 'Test1', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}},
            {message: 'Test2', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}},
            {message: 'Test3', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'}}
        ]));
        addProcessCommentSpy = spyOn(commentProcessService, 'addTaskComment').and.returnValue(of({
            id: 123,
            message: 'Test Comment',
            createdBy: {id: '999'}
        }));
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should load comments when taskId specified', () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});

        expect(getProcessCommentsSpy).toHaveBeenCalled();
    });

    it('should load comments when nodeId specified', () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'nodeId': change});

        expect(getContentCommentsSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading comments', () => {
        const emitSpy = spyOn(component.error, 'emit');
        getProcessCommentsSpy.and.returnValue(throwError({}));

        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});

        expect(emitSpy).toHaveBeenCalled();
    });

    it('should not load comments when no taskId is specified', () => {
        fixture.detectChanges();
        expect(getProcessCommentsSpy).not.toHaveBeenCalled();
    });

    it('should display comments when the task has comments', async(() => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelectorAll('#comment-message').length).toBe(3);
            expect(fixture.nativeElement.querySelector('#comment-message:empty')).toBeNull();
        });
    }));

    it('should display comments count when the task has comments', async(() => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const element = fixture.nativeElement.querySelector('#comment-header');
            expect(element.innerText).toBe('COMMENTS.HEADER');
        });
    }));

    it('should not display comments when the task has no comments', async(() => {
        component.taskId = '123';
        getProcessCommentsSpy.and.returnValue(of([]));
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-container')).toBeNull();
        });
    }));

    it('should display comments input by default', async(() => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-input')).not.toBeNull();
        });
    }));

    it('should not display comments input when the task is readonly', async(() => {
        component.readOnly = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-input')).toBeNull();
        });
    }));

    describe('change detection taskId', () => {

        const change = new SimpleChange('123', '456', true);
        const nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                getProcessCommentsSpy.calls.reset();
            });
        }));

        it('should fetch new comments when taskId changed', () => {
            component.ngOnChanges({'taskId': change});
            expect(getProcessCommentsSpy).toHaveBeenCalledWith('456');
        });

        it('should not fetch new comments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getProcessCommentsSpy).not.toHaveBeenCalled();
        });

        it('should not fetch new comments when taskId changed to null', () => {
            component.ngOnChanges({'taskId': nullChange});
            expect(getProcessCommentsSpy).not.toHaveBeenCalled();
        });
    });

    describe('change detection node', () => {

        const change = new SimpleChange('123', '456', true);
        const nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.nodeId = '123';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                getContentCommentsSpy.calls.reset();
            });
        }));

        it('should fetch new comments when nodeId changed', () => {
            component.ngOnChanges({'nodeId': change});
            expect(getContentCommentsSpy).toHaveBeenCalledWith('456');
        });

        it('should not fetch new comments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getContentCommentsSpy).not.toHaveBeenCalled();
        });

        it('should not fetch new comments when nodeId changed to null', () => {
            component.ngOnChanges({'nodeId': nullChange});
            expect(getContentCommentsSpy).not.toHaveBeenCalled();
        });
    });

    describe('Add comment task', () => {

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should sanitize comment when user input contains html elements', async(() => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = '<div class="text-class"><button onclick=""><h1>action</h1></button></div>';
            element.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addProcessCommentSpy).toHaveBeenCalledWith('123', 'action');
            });
        }));

        it('should normalize comment when user input contains spaces sequence', async(() => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = 'test    comment';
            element.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addProcessCommentSpy).toHaveBeenCalledWith('123', 'test comment');
            });
        }));

        it('should add break lines to comment when user input contains new line characters', async(() => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = 'these\nare\nparagraphs\n';
            element.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addProcessCommentSpy).toHaveBeenCalledWith('123', 'these<br/>are<br/>paragraphs');
            });
        }));

        it('should call service to add a comment when add button is pressed', async(() => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = 'Test Comment';
            element.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addProcessCommentSpy).toHaveBeenCalled();
                const elements = fixture.nativeElement.querySelectorAll('#comment-message');
                expect(elements.length).toBe(1);
                expect(elements[0].innerText).toBe('Test Comment');
            });
        }));

        it('should not call service to add a comment when comment is empty', async(() => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = '';
            element.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addProcessCommentSpy).not.toHaveBeenCalled();
            });
        }));

        it('should clear comment when escape key is pressed', async(() => {
            const event = new KeyboardEvent('keyup', {'key': 'Escape'});
            let element = fixture.nativeElement.querySelector('#comment-input');
            element.dispatchEvent(event);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                element = fixture.nativeElement.querySelector('#comment-input');
                expect(element.value).toBe('');
            });
        }));

        it('should emit an error when an error occurs adding the comment', () => {
            const emitSpy = spyOn(component.error, 'emit');
            addProcessCommentSpy.and.returnValue(throwError({}));
            component.message = 'Test comment';
            component.add();
            expect(emitSpy).toHaveBeenCalled();
        });

    });

    describe('Add comment node', () => {

        beforeEach(async(() => {
            component.nodeId = '123';
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should call service to add a comment when add button is pressed', async(() => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = 'Test Comment';
            element.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addContentCommentSpy).toHaveBeenCalled();
                const elements = fixture.nativeElement.querySelectorAll('#comment-message');
                expect(elements.length).toBe(1);
                expect(elements[0].innerText).toBe('Test Comment');
            });
        }));

        it('should sanitize comment when user input contains html elements', async(() => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = '<div class="text-class"><button onclick=""><h1>action</h1></button></div>';
            element.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addContentCommentSpy).toHaveBeenCalledWith('123', 'action');
            });
        }));

        it('should normalize comment when user input contains spaces sequence', async(() => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = 'test    comment';
            element.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addContentCommentSpy).toHaveBeenCalledWith('123', 'test comment');
            });
        }));

        it('should add break lines to comment when user input contains new line characters', async(() => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = 'these\nare\nparagraphs\n';
            element.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addContentCommentSpy).toHaveBeenCalledWith('123', 'these<br/>are<br/>paragraphs');
            });
        }));

        it('should not call service to add a comment when comment is empty', async(() => {
            const element = fixture.nativeElement.querySelector('.adf-comments-input-add');
            component.message = '';
            element.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(addContentCommentSpy).not.toHaveBeenCalled();
            });
        }));

        it('should clear comment when escape key is pressed', async(() => {
            const event = new KeyboardEvent('keyup', {'key': 'Escape'});
            let element = fixture.nativeElement.querySelector('#comment-input');
            element.dispatchEvent(event);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                element = fixture.nativeElement.querySelector('#comment-input');
                expect(element.value).toBe('');
            });
        }));

        it('should emit an error when an error occurs adding the comment', () => {
            const emitSpy = spyOn(component.error, 'emit');
            addContentCommentSpy.and.returnValue(throwError({}));
            component.message = 'Test comment';
            component.add();
            expect(emitSpy).toHaveBeenCalled();
        });

    });

});
