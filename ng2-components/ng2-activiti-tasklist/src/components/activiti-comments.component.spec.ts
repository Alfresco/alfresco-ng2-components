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
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { CoreModule, AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiFormModule } from 'ng2-activiti-form';

import { ActivitiComments } from './activiti-comments.component';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';

describe('ActivitiComments', () => {

    let componentHandler: any;
    let service: ActivitiTaskListService;
    let component: ActivitiComments;
    let fixture: ComponentFixture<ActivitiComments>;
    let getCommentsSpy: jasmine.Spy;
    let addCommentSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                ActivitiFormModule.forRoot()
            ],
            declarations: [
                ActivitiComments
            ],
            providers: [
                ActivitiTaskListService
            ]
        }).compileComponents();

        let translateService = TestBed.get(AlfrescoTranslationService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService, 'get').and.callFake((key) => { return Observable.of(key); });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivitiComments);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ActivitiTaskListService);

        getCommentsSpy = spyOn(service, 'getTaskComments').and.returnValue(Observable.of([
            { message: 'Test1' },
            { message: 'Test2' },
            { message: 'Test3'}
        ]));
        addCommentSpy = spyOn(service, 'addTaskComment').and.returnValue(Observable.of({id: 123, message: 'Test'}));

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should load comments when taskId specified', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });

        expect(getCommentsSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading comments', () => {
        let emitSpy = spyOn(component.error, 'emit');
        getCommentsSpy.and.returnValue(Observable.throw({}));

        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });

        expect(emitSpy).toHaveBeenCalled();
    });

    it('should not comments when no taskId is specified', () => {
        fixture.detectChanges();
        expect(getCommentsSpy).not.toHaveBeenCalled();
    });

    it('should display comments when the task has comments', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.queryAll(By.css('ul.mdl-list li')).length).toBe(3);
        });
    }));

    it('should not display comments when the task has no comments', async(() => {
        component.taskId = '123';
        getCommentsSpy.and.returnValue(Observable.of([]));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.queryAll(By.css('ul.mdl-list li')).length).toBe(0);
        });
    }));

    describe('change detection', () => {

        let change = new SimpleChange('123', '456', true);
        let nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                getCommentsSpy.calls.reset();
            });
        }));

        it('should fetch new comments when taskId changed', () => {
            component.ngOnChanges({ 'taskId': change });
            expect(getCommentsSpy).toHaveBeenCalledWith('456');
        });

        it('should NOT fetch new comments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getCommentsSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new comments when taskId changed to null', () => {
            component.ngOnChanges({ 'taskId': nullChange });
            expect(getCommentsSpy).not.toHaveBeenCalled();
        });

        it('should set a placeholder message when taskId changed to null', () => {
            component.ngOnChanges({ 'taskId': nullChange });
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('[data-automation-id="comments-none"]'))).not.toBeNull();
        });
    });

    describe('Add comment', () => {

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should display a dialog to the user when the Add button clicked', () => {
            let dialogEl = fixture.debugElement.query(By.css('.mdl-dialog')).nativeElement;
            let showSpy: jasmine.Spy = spyOn(dialogEl, 'showModal');
            component.showDialog();
            expect(showSpy).toHaveBeenCalled();
        });

        it('should call service to add a comment', () => {
            component.showDialog();
            component.message = 'Test comment';
            component.add();
            expect(addCommentSpy).toHaveBeenCalledWith('123', 'Test comment');
        });

        it('should emit an error when an error occurs adding the comment', () => {
            let emitSpy = spyOn(component.error, 'emit');
            addCommentSpy.and.returnValue(Observable.throw({}));
            component.showDialog();
            component.message = 'Test comment';
            component.add();
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should close add dialog when close button clicked', () => {
            let dialogEl = fixture.debugElement.query(By.css('.mdl-dialog')).nativeElement;
            let closeSpy: jasmine.Spy = spyOn(dialogEl, 'close');
            component.showDialog();
            component.cancel();
            expect(closeSpy).toHaveBeenCalled();
        });

    });

});
