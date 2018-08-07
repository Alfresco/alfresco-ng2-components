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

import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CommentProcessService, setupTestBed } from '@alfresco/adf-core';

import { ProcessCommentsComponent } from './process-comments.component';
import { ProcessTestingModule } from '../testing/process.testing.module';

describe('ProcessCommentsComponent', () => {

    let component: ProcessCommentsComponent;
    let fixture: ComponentFixture<ProcessCommentsComponent>;
    let getCommentsSpy: jasmine.Spy;
    let commentProcessService: CommentProcessService;

    setupTestBed({
        imports: [ProcessTestingModule]
    });

    beforeEach(() => {

        fixture = TestBed.createComponent(ProcessCommentsComponent);
        component = fixture.componentInstance;
        commentProcessService = TestBed.get(CommentProcessService);

        getCommentsSpy = spyOn(commentProcessService, 'getProcessInstanceComments').and.returnValue(of([
            { message: 'Test1', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'} },
            { message: 'Test2', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'} },
            { message: 'Test3', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'} }
        ]));
    });

    it('should load comments when processInstanceId specified', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });
        fixture.detectChanges();
        expect(getCommentsSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading comments', () => {
        let emitSpy = spyOn(component.error, 'emit');
        getCommentsSpy.and.returnValue(throwError({}));

        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });

        fixture.detectChanges();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should not load comments when no processInstanceId is specified', () => {
        fixture.detectChanges();
        expect(getCommentsSpy).not.toHaveBeenCalled();
    });

    it('should display comments when the process has comments', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelectorAll('#comment-message').length).toBe(3);
            expect(fixture.nativeElement.querySelector('#comment-message:empty')).toBeNull();
        });
    }));

    it('should display comments count when the process has comments', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let element = fixture.nativeElement.querySelector('#comment-header');
            expect(element.innerText).toBe('ADF_PROCESS_LIST.DETAILS.COMMENTS.HEADER');
        });
    }));

    it('should not display comments when the process has no comments', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });

        getCommentsSpy.and.returnValue(of([]));
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-container')).toBeNull();
        });
    }));

    it('should not display comments input by default', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-input')).toBeNull();
        });
    }));

    it('should not display comments input when the process is readonly', async(() => {
        component.readOnly = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-input')).toBeNull();
        });
    }));

    it('should display comments input when the process isn\'t readonly', async(() => {
        component.readOnly = false;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-input')).not.toBeNull();
        });
    }));
});
