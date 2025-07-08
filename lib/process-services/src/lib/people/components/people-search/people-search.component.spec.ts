/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { of } from 'rxjs';
import { PeopleSearchComponent } from './people-search.component';
import { LightUserRepresentation } from '@alfresco/js-api';

const fakeUser: LightUserRepresentation = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'JohnDoe@fake.com'
};

const fakeSecondUser: LightUserRepresentation = {
    id: 2,
    firstName: 'Jane',
    lastName: 'Jackson',
    email: 'JaneJackson@fake.com'
};

describe('PeopleSearchComponent', () => {
    let peopleSearchComponent: PeopleSearchComponent;
    let fixture: ComponentFixture<PeopleSearchComponent>;
    let element: HTMLElement;
    const userArray = [fakeUser, fakeSecondUser];
    let searchInput: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PeopleSearchComponent]
        });
        fixture = TestBed.createComponent(PeopleSearchComponent);
        peopleSearchComponent = fixture.componentInstance;
        element = fixture.nativeElement;
        peopleSearchComponent.results = of(userArray);
        fixture.detectChanges();
    });

    /**
     * trigger search
     */
    function triggerSearch() {
        searchInput = element.querySelector('#userSearchText');
        searchInput.value = 'fake-search';
        searchInput.dispatchEvent(new Event('input'));
    }

    it('should show input search text', () => {
        expect(element.querySelector('#userSearchText')).toBeTruthy();
    });

    it('should display user search results', async () => {
        triggerSearch();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const datatableBodyElement = element.querySelector('adf-people-search-field .adf-datatable-body');
        const peopleResultElements = element.querySelectorAll('.adf-people-full-name');

        expect(datatableBodyElement).not.toBeNull();
        expect(peopleResultElements.length).toBe(2);
        expect(peopleResultElements[0].textContent.trim()).toBe('John Doe');
        expect(peopleResultElements[1].textContent.trim()).toBe('Jane Jackson');
    });

    it('should emit a success event when a user is selected from the search results', () => {
        const successEventSpy = spyOn(peopleSearchComponent.success, 'emit');
        peopleSearchComponent.onRowClick(fakeUser);
        const addUserButton = element.querySelector<HTMLElement>('#add-people');
        addUserButton.click();

        expect(successEventSpy).toHaveBeenCalledWith(fakeUser);
    });
});
