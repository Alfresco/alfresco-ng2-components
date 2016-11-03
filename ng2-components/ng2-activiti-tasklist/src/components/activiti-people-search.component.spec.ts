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

import {
    CoreModule,
    AlfrescoTranslationService
} from 'ng2-alfresco-core';
import { ActivitiPeopleSearch } from './activiti-people-search.component';
import { TranslationMock } from '../assets/translation.service.mock';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { User } from '../models/user.model';
import { Observable } from 'rxjs/Observable';

declare let jasmine: any;

const fakeUser: User = new User({
    id: '1',
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
});

const fakeSecondUser: User = new User({
    id: '2',
    firstName: 'fake-involve-name',
    lastName: 'fake-involve-last',
    email: 'fake-involve@mail.com'
});

describe('Activiti People Search', () => {

    let activitiPeopleSearchComponent: ActivitiPeopleSearch;
    let fixture: ComponentFixture<ActivitiPeopleSearch>;
    let element: HTMLElement;
    let componentHandler;
    let userArray = [fakeUser, fakeSecondUser];
    let searchInput;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule],
            declarations: [ActivitiPeopleSearch],
            providers: [
                {provide: AlfrescoTranslationService, useClass: TranslationMock}]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ActivitiPeopleSearch);
            activitiPeopleSearchComponent = fixture.componentInstance;
            element = fixture.nativeElement;
            componentHandler = jasmine.createSpyObj('componentHandler', [
                'upgradeAllRegistered'
            ]);

            window['componentHandler'] = componentHandler;
            activitiPeopleSearchComponent.results = Observable.of([]);
            fixture.detectChanges();
        });
    }));

    it('should show input search text', () => {
        expect(element.querySelector('#userSearchText')).toBeDefined();
        expect(element.querySelector('#userSearchText')).not.toBeNull();
    });

    it('should show no user found to involve message', () => {
        fixture.detectChanges();
        fixture.whenStable()
            .then(() => {
                expect(element.querySelector('#no-user-found')).not.toBeNull();
                expect(element.querySelector('#no-user-found').textContent).toContain('No user found to involve');
            });
    });

    it('should show user which can be involved ', (done) => {
        activitiPeopleSearchComponent.onSearch.subscribe(() => {
            activitiPeopleSearchComponent.results = Observable.of(userArray);
            activitiPeopleSearchComponent.ngOnInit();
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    expect(element.querySelector('#user-1')).not.toBeNull();
                    expect(element.querySelector('#user-1').textContent)
                        .toContain('fake-name - fake-last');
                    expect(element.querySelector('#user-2')).not.toBeNull();
                    expect(element.querySelector('#user-2').textContent)
                        .toContain('fake-involve-name - fake-involve-last');
                    done();
                });
        });
        searchInput = element.querySelector('#userSearchText');
        searchInput.value = 'fake-search';
        activitiPeopleSearchComponent.searchUser.markAsDirty();
        searchInput.dispatchEvent(new Event('input'));
    });

    it('should send an event when an user is clicked', async(() => {
        activitiPeopleSearchComponent.onRowClicked.subscribe((user) => {
            expect(user).toBeDefined();
            expect(user.firstName).toBe('fake-name');
        });
        activitiPeopleSearchComponent.results = Observable.of(userArray);
        activitiPeopleSearchComponent.ngOnInit();
        fixture.detectChanges();
        fixture.whenStable()
            .then(() => {
                let userToSelect = <HTMLElement> element.querySelector('#user-1');
                userToSelect.click();
            });
    }));

    it('should remove clicked user', async(() => {
        activitiPeopleSearchComponent.results = Observable.of(userArray);
        activitiPeopleSearchComponent.ngOnInit();
        fixture.detectChanges();
        let userToSelect = <HTMLElement> element.querySelector('#user-1');
        userToSelect.click();

        fixture.detectChanges();
        fixture.whenStable()
            .then(() => {
                expect(element.querySelector('#user-1')).toBeNull();
            });
    }));
});
