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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogService, setupTestBed } from '@alfresco/adf-core';
import { PeopleSelectorComponent } from './people-selector.component';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ProcessTestingModule } from '../../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { PeopleProcessService } from '../../../common/services/people-process.service';

describe('PeopleSelectorComponent', () => {

    let component: PeopleSelectorComponent;
    let fixture: ComponentFixture<PeopleSelectorComponent>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should have the proper placeholder by default', () => {
        expect(component.placeholder).toBe('ADF_TASK_LIST.PEOPLE.ASSIGNEE');
    });

    it('should have the selected user\'s details as placeholder if one is set', () => {
        component.selectedUser = {
            firstName: 'Max',
            lastName: 'CaulField'
        };
        expect(component.placeholder).toBe('Max CaulField');
    });

    it('should call the PeopleProcessService\'s getWorkflowUsers method on search', () => {
        const peopleProcessService = TestBed.inject(PeopleProcessService);
        spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(of([]));

        component.performSearch('Chloe Price');

        expect(peopleProcessService.getWorkflowUsers).toHaveBeenCalledWith(undefined, 'Chloe Price');
    });

    it('should log error on getWorkflowUsers error', () => {
        const peopleProcessService = TestBed.inject(PeopleProcessService);
        const logService = TestBed.inject(LogService);
        spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(throwError(new Error()));
        spyOn(logService, 'error');

        component.performSearch('Chloe Price')
            .subscribe((people) => {
                expect(people).toEqual([]);
                expect(logService.error).toHaveBeenCalledWith('getWorkflowUsers threw error');
            });
    });

    it('should emit an event with the selected users id when userSelected method is invoked', (done) => {

        component.peopleIdChange.subscribe((userId) => {
            expect(userId).toBe(789);
            done();
        });

        component.userSelected({id: 789});
    });

    it('should emit an event with undefined when reset button is clicked', (done) => {
        component.selectedUser = { id: 746 };
        fixture.detectChanges();

        component.peopleIdChange.subscribe((userId) => {
            expect(userId).toBe(undefined);
            done();
        });

        const resetButton = fixture.debugElement.query(By.css('[data-automation-id="adf-people-selector-deselect"]'));
        resetButton.triggerEventHandler('click', {});
    });
});
