/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { fakeEcmUser, createNewPersonMock } from '../mock/ecm-user.service.mock';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';
import { CoreTestingModule } from '../testing/core.testing.module';
import { PeopleContentService } from './people-content.service';
import { AlfrescoApiService } from './alfresco-api.service';
import { setupTestBed } from '../testing/setup-test-bed';
import { TranslateModule } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';
import { LogService } from './log.service';

describe('PeopleContentService', () => {

    let service: PeopleContentService;
    let logService: LogService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(PeopleContentService);
        logService = TestBed.inject(LogService);
    });

    it('should be able to fetch person details based on id', (done) => {
        spyOn(service.peopleApi, 'getPerson').and.returnValue(Promise.resolve({ entry: fakeEcmUser }));
        service.getPerson('fake-id').subscribe((person) => {
            expect(person.entry.id).toEqual('fake-id');
            expect(person.entry.email).toEqual('fakeEcm@ecmUser.com');
            done();
        });
    });

    it('calls getPerson api method by an id', (done) => {
        const getPersonSpy = spyOn(service.peopleApi, 'getPerson').and.returnValue(Promise.resolve({}));
        service.getPerson('fake-id').subscribe(() => {
            expect(getPersonSpy).toHaveBeenCalledWith('fake-id');
            done();
        });
    });

    it('calls getPerson api method with "-me-"', (done) => {
        const getPersonSpy = spyOn(service.peopleApi, 'getPerson').and.returnValue(Promise.resolve({}));
        service.getPerson('-me-').subscribe(() => {
            expect(getPersonSpy).toHaveBeenCalledWith('-me-');
            done();
        });
    });

    it('should be able to create new person', (done) => {
        spyOn(service.peopleApi, 'createPerson').and.returnValue(Promise.resolve({ entry: fakeEcmUser }));
        service.createPerson(createNewPersonMock).subscribe((person) => {
            expect(person.id).toEqual('fake-id');
            expect(person.email).toEqual('fakeEcm@ecmUser.com');
            done();
        });
    });

    it('should be able to call createPerson api with new person details', (done) => {
        const createPersonSpy = spyOn(service.peopleApi, 'createPerson').and.returnValue(Promise.resolve({ entry: fakeEcmUser }));
        service.createPerson(createNewPersonMock).subscribe((person) => {
            expect(person.id).toEqual('fake-id');
            expect(person.email).toEqual('fakeEcm@ecmUser.com');
            expect(createPersonSpy).toHaveBeenCalledWith(createNewPersonMock, undefined);
            done();
        });
    });

    it('should be able to throw an error if createPerson api failed', (done) => {
        const createPersonSpy = spyOn(service.peopleApi, 'createPerson').and.returnValue(Promise.reject({ message: 'failed to create new person' }));
        const logErrorSpy = spyOn(logService, 'error');
        service.createPerson(createNewPersonMock).subscribe(
        () => {},
        (error) => {
            expect(error).toEqual({ message: 'failed to create new person' });
            expect(createPersonSpy).toHaveBeenCalled();
            expect(logErrorSpy).toHaveBeenCalledWith({ message: 'failed to create new person' });
            done();
        });
    });
});
