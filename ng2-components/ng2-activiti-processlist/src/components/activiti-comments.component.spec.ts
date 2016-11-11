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

import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { ActivitiFormModule } from 'ng2-activiti-form';

import { ActivitiComments } from './activiti-comments.component';
import { ActivitiProcessService } from './../services/activiti-process.service';
import { TranslationMock } from './../assets/translation.service.mock';

describe('ActivitiProcessInstanceComments', () => {

    let componentHandler: any;
    let service: ActivitiProcessService;
    let component: ActivitiComments;
    let fixture: ComponentFixture<ActivitiComments>;
    let getCommentsSpy: jasmine.Spy;
    let addCommentSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                ActivitiFormModule
            ],
            declarations: [
                ActivitiComments
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ActivitiProcessService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiComments);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ActivitiProcessService);

        getCommentsSpy = spyOn(service, 'getProcessInstanceComments').and.returnValue(Observable.of([{
            message: 'Test1'
        }, {
            message: 'Test2'
        }, {
            message: 'Test3'
        }]));
        addCommentSpy = spyOn(service, 'addProcessInstanceComment').and.returnValue(Observable.of({id: 123, message: 'Test'}));

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

    it('should not comments when no processInstanceId is specified', () => {
        fixture.detectChanges();
        expect(getCommentsSpy).not.toHaveBeenCalled();
    });

    it('should display comments when the process has comments', async(() => {
        component.processInstanceId = '123';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.queryAll(By.css('ul.mdl-list li')).length).toBe(3);
        });
    }));

    it('should not display comments when the process has no comments', async(() => {
        component.processInstanceId = '123';
        getCommentsSpy.and.returnValue(Observable.of([]));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.queryAll(By.css('ul.mdl-list li')).length).toBe(0);
        });
    }));

    describe('change detection', () => {

        let change = new SimpleChange('123', '456');
        let nullChange = new SimpleChange('123', null);

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                getCommentsSpy.calls.reset();
            });
        }));

        it('should fetch new comments when processInstanceId changed', () => {
            component.ngOnChanges({ 'processInstanceId': change });
            expect(getCommentsSpy).toHaveBeenCalledWith('456');
        });

        it('should NOT fetch new comments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getCommentsSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new comments when processInstanceId changed to null', () => {
            component.ngOnChanges({ 'processInstanceId': nullChange });
            expect(getCommentsSpy).not.toHaveBeenCalled();
        });

        it('should set a placeholder message when processInstanceId changed to null', () => {
            component.ngOnChanges({ 'processInstanceId': nullChange });
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('[data-automation-id="comments-none"]'))).not.toBeNull();
        });
    });

    describe('Add comment', () => {

        beforeEach(async(() => {
            component.processInstanceId = '123';
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
