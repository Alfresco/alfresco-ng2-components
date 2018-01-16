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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatInputModule } from '@angular/material';
import { LogService, TranslationService, TranslationMock, PeopleProcessService } from '@alfresco/adf-core';
import { PeopleSearchFieldComponent } from '../people-search-field/people-search-field.component';
import { PeopleListComponent } from '../people-list/people-list.component';
import { PeopleSelectorComponent } from './people-selector.component';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';

describe('PeopleSelectorComponent', () => {

    let component: PeopleSelectorComponent;
    let fixture: ComponentFixture<PeopleSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatButtonModule,
                MatInputModule
            ],
            declarations: [
                PeopleListComponent,
                PeopleSearchFieldComponent,
                PeopleSelectorComponent
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: LogService, useValue: {error: () => {} }},
                PeopleProcessService
            ]
        }).compileComponents();
    }));

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
        const peopleProcessService = TestBed.get(PeopleProcessService);
        spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(Observable.of([]));

        component.performSearch('Chloe Price');

        expect(peopleProcessService.getWorkflowUsers).toHaveBeenCalledWith(undefined, 'Chloe Price');
    });

    it('should log error on getWorkflowUsers\'s error', () => {
        const peopleProcessService = TestBed.get(PeopleProcessService);
        const logService = TestBed.get(LogService);
        spyOn(peopleProcessService, 'getWorkflowUsers').and.returnValue(Observable.throw(new Error()));
        spyOn(logService, 'error');

        component.performSearch('Chloe Price')
            .subscribe((people) => {
                expect(people).toEqual([]);
                expect(logService.error).toHaveBeenCalledWith('getWorkflowUsers threw error');
            });
    });

    it('should emit an event with the selected users\'s id when userSelected method is invoked', (done) => {

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
