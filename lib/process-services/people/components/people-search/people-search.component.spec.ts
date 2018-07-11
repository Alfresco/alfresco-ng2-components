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
import { UserProcessModel, setupTestBed } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { PeopleSearchComponent } from './people-search.component';
import { ProcessTestingModule } from '../../../testing/process.testing.module';

const fakeUser: UserProcessModel = new UserProcessModel({
    id: '1',
    firstName: 'fake-name',
    lastName: 'fake-last',
    email: 'fake@mail.com'
});

const fakeSecondUser: UserProcessModel = new UserProcessModel({
    id: '2',
    firstName: 'fake-involve-name',
    lastName: 'fake-involve-last',
    email: 'fake-involve@mail.com'
});

describe('PeopleSearchComponent', () => {

    let peopleSearchComponent: PeopleSearchComponent;
    let fixture: ComponentFixture<PeopleSearchComponent>;
    let element: HTMLElement;
    let userArray = [fakeUser, fakeSecondUser];
    let searchInput: any;

    setupTestBed({
        imports: [ProcessTestingModule]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(PeopleSearchComponent);
        peopleSearchComponent = fixture.componentInstance;
        element = fixture.nativeElement;
        peopleSearchComponent.results = of([]);
        fixture.detectChanges();
    }));

    it('should show input search text', () => {
        expect(element.querySelector('#userSearchText')).toBeDefined();
        expect(element.querySelector('#userSearchText')).not.toBeNull();
    });

    it('should hide people-list container', () => {
        fixture.detectChanges();
        fixture.whenStable()
            .then(() => {
                expect(element.querySelector('#search-people-list')).toBeNull();
            });

    });

    it('should show user which can be involved ', (done) => {
        peopleSearchComponent.results = of(userArray);
        peopleSearchComponent.ngOnInit();
        fixture.detectChanges();

        searchInput = element.querySelector('#userSearchText');
        searchInput.value = 'fake-search';
        searchInput.dispatchEvent(new Event('input'));

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let gatewayElement: any = element.querySelector('#search-people-list .adf-datatable-body');
            expect(gatewayElement).not.toBeNull();
            expect(gatewayElement.children.length).toBe(2);
            done();
        });
    });

    it('should send an event when an user is clicked', (done) => {
        peopleSearchComponent.success.subscribe((user) => {
            expect(user).toBeDefined();
            expect(user.firstName).toBe('fake-name');
            done();
        });
        peopleSearchComponent.results = of(userArray);
        peopleSearchComponent.ngOnInit();
        fixture.detectChanges();
        fixture.whenStable()
            .then(() => {
                peopleSearchComponent.onRowClick(fakeUser);
                let addUserButton = <HTMLElement> element.querySelector('#add-people');
                addUserButton.click();
            });
    });

    it('should remove clicked user', (done) => {
        peopleSearchComponent.results = of(userArray);
        peopleSearchComponent.ngOnInit();
        fixture.detectChanges();

        searchInput = element.querySelector('#userSearchText');
        searchInput.value = 'fake-search';
        searchInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        peopleSearchComponent.onRowClick(fakeUser);
        let addUserButton = <HTMLElement> element.querySelector('#add-people');
        addUserButton.click();
        fixture.detectChanges();

        fixture.whenStable()
            .then(() => {
                fixture.detectChanges();
                let gatewayElement: any = element.querySelector('#search-people-list .adf-datatable-body');
                expect(gatewayElement).not.toBeNull();
                expect(gatewayElement.children.length).toBe(1);
                done();
            });
    });
});
