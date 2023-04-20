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

import { fakeEcmUserList, createNewPersonMock, fakeEcmUser, fakeEcmAdminUser } from '../mocks/ecm-user.service.mock';
import { AuthenticationService, AlfrescoApiService, AlfrescoApiServiceMock, CoreTestingModule, LogService } from '@alfresco/adf-core';
import { PeopleContentService, PeopleContentQueryRequestModel } from './people-content.service';
import { TranslateModule } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';

describe('PeopleContentService', () => {

    let peopleContentService: PeopleContentService;
    let logService: LogService;
    let authenticationService: AuthenticationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            providers: [
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
            ]
        });

        authenticationService = TestBed.inject(AuthenticationService);
        peopleContentService = TestBed.inject(PeopleContentService);
        logService = TestBed.inject(LogService);
    });

    it('should be able to fetch person details based on id', async () => {
        spyOn(peopleContentService.peopleApi, 'getPerson').and.returnValue(Promise.resolve({ entry: fakeEcmUser } as any));
        const person = await peopleContentService.getPerson('fake-id').toPromise();
        expect(person.id).toEqual('fake-id');
        expect(person.email).toEqual('fakeEcm@ecmUser.com');
    });

    it('should be able to list people', async () => {
        spyOn(peopleContentService.peopleApi, 'listPeople').and.returnValue(Promise.resolve(fakeEcmUserList));
        const response = await peopleContentService.listPeople().toPromise();
        const people = response.entries;
        const pagination = response.pagination;

        expect(people).toBeDefined();
        expect(people[0].id).toEqual('fake-id');
        expect(people[1].id).toEqual('another-fake-id');
        expect(pagination.count).toEqual(2);
        expect(pagination.totalItems).toEqual(2);
        expect(pagination.hasMoreItems).toBeFalsy();
        expect(pagination.skipCount).toEqual(0);

    });

    it('should call listPeople api with requested sorting params', async () => {
        const listPeopleSpy = spyOn(peopleContentService.peopleApi, 'listPeople').and.returnValue(Promise.resolve(fakeEcmUserList));
        const requestQueryParams: PeopleContentQueryRequestModel = {
            skipCount: 10,
            maxItems: 20,
            sorting: { orderBy: 'firstName', direction: 'asc' }
        };
        const expectedValue = { skipCount: 10, maxItems: 20, orderBy: ['firstName ASC'] } as any;

        await peopleContentService.listPeople(requestQueryParams).toPromise();

        expect(listPeopleSpy).toHaveBeenCalledWith(expectedValue);
    });

    it('should not call listPeople api with sorting params if sorting is not defined', async () => {
        const listPeopleSpy = spyOn(peopleContentService.peopleApi, 'listPeople').and.returnValue(Promise.resolve(fakeEcmUserList));
        const requestQueryParams: PeopleContentQueryRequestModel = { skipCount: 10, maxItems: 20, sorting: undefined };
        const expectedValue = { skipCount: 10, maxItems: 20 };

        await peopleContentService.listPeople(requestQueryParams).toPromise();

        expect(listPeopleSpy).toHaveBeenCalledWith(expectedValue);
    });

    it('should be able to create new person', async () => {
        spyOn(peopleContentService.peopleApi, 'createPerson').and.returnValue(Promise.resolve({ entry: fakeEcmUser } as any));
        const newUser = await peopleContentService.createPerson(createNewPersonMock).toPromise();
        expect(newUser.id).toEqual('fake-id');
        expect(newUser.email).toEqual('fakeEcm@ecmUser.com');
    });

    it('should be able to throw an error if createPerson api failed', (done) => {
        spyOn(peopleContentService.peopleApi, 'createPerson').and.returnValue(Promise.reject('failed to create new person'));
        const logErrorSpy = spyOn(logService, 'error');
        peopleContentService.createPerson(createNewPersonMock).subscribe(
            () => {
            },
            (error) => {
                expect(logErrorSpy).toHaveBeenCalledWith('failed to create new person');
                expect(error).toEqual('failed to create new person');
                done();
            }
        );
    });

    it('Should make the api call to check if the user is a content admin only once', async () => {
        const getCurrentPersonSpy = spyOn(peopleContentService.peopleApi, 'getPerson').and.returnValue(Promise.resolve({ entry: fakeEcmAdminUser } as any));

        const user = await peopleContentService.getCurrentUserInfo().toPromise();
        expect(user.id).toEqual('fake-id');
        expect(peopleContentService.isCurrentUserAdmin()).toBe(true);
        expect(getCurrentPersonSpy.calls.count()).toEqual(1);

        await peopleContentService.getCurrentUserInfo().toPromise();

        expect(await peopleContentService.isCurrentUserAdmin()).toBe(true);
        expect(getCurrentPersonSpy.calls.count()).toEqual(1);
    });

    it('should reset the admin cache upon logout', async () => {
        spyOn(peopleContentService.peopleApi, 'getPerson').and.returnValue(Promise.resolve({ entry: fakeEcmAdminUser } as any));

        const user = await peopleContentService.getCurrentUserInfo().toPromise();
        expect(user.id).toEqual('fake-id');
        expect(peopleContentService.isCurrentUserAdmin()).toBe(true);

        authenticationService.onLogout.next(true);
        expect(peopleContentService.isCurrentUserAdmin()).toBe(false);
    });
});
