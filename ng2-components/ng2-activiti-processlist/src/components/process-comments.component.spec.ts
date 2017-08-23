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
import { MdInputModule } from '@angular/material';
import { Observable } from 'rxjs/Rx';

import {
    CommentListComponent,
    CommentsComponent,
    PeopleService,
    TaskListService
} from 'ng2-activiti-tasklist';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';

import { TranslationMock } from './../assets/translation.service.mock';
import { ProcessService } from './../services/process.service';
import { ProcessCommentsComponent } from './process-comments.component';

describe('ActivitiProcessInstanceComments', () => {

    let componentHandler: any;
    let service: TaskListService;
    let component: ProcessCommentsComponent;
    let fixture: ComponentFixture<ProcessCommentsComponent>;
    let getCommentsSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                DataTableModule,
                MdInputModule
            ],
            declarations: [
                ProcessCommentsComponent,
                CommentsComponent,
                CommentListComponent
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                { provide: TaskListService, useClass: ProcessService },
                DatePipe,
                PeopleService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ProcessCommentsComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(TaskListService);

        getCommentsSpy = spyOn(service, 'getComments').and.returnValue(Observable.of([
            { message: 'Test1', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'} },
            { message: 'Test2', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'} },
            { message: 'Test3', created: Date.now(), createdBy: {firstName: 'Admin', lastName: 'User'} }
        ]));

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should load comments when processInstanceId specified', () => {
        component.processInstanceId = '123';
        fixture.detectChanges();
        expect(getCommentsSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading comments', () => {
        let emitSpy = spyOn(component.error, 'emit');
        getCommentsSpy.and.returnValue(Observable.throw({}));
        component.processInstanceId = '123';
        fixture.detectChanges();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should not load comments when no processInstanceId is specified', () => {
        fixture.detectChanges();
        expect(getCommentsSpy).not.toHaveBeenCalled();
    });

    it('should display comments when the process has comments', async(() => {
        component.processInstanceId = '123';
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelectorAll('#comment-message').length).toBe(3);
            expect(fixture.nativeElement.querySelector('#comment-message:empty')).toBeNull();
        });
    }));

    it('should display comments count when the process has comments', () => {
        component.processInstanceId = '123';

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let element = fixture.nativeElement.querySelector('#comment-header');
            expect(element.innerText).toContain('(3)');
        });
    });

    it('should not display comments when the process has no comments', async(() => {
        component.processInstanceId = '123';
        getCommentsSpy.and.returnValue(Observable.of([]));
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('#comment-container')).toBeNull();
        });
    }));

    it('should not display comments input by default', async(() => {
        component.processInstanceId = '123';
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
