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

import { async, inject, TestBed } from '@angular/core/testing';
import { AlfrescoApiService } from './alfresco-api.service';
import { PeopleContentService } from './people-content.service';

class PeopleContentServiceTest {
    service: any = null;
    setup: any = {
        rejectGetPerson: false
    };

    constructor(setup: any = {}) {
        Object.assign(this.setup, setup);

        const { alfrescoApiServiceMock } = this;

        const alfrescoApiServiceProvider = {
            provide: AlfrescoApiService,
            useValue: alfrescoApiServiceMock
        };

        TestBed.configureTestingModule({
            providers: [
                alfrescoApiServiceProvider,
                PeopleContentService
            ]
        });

        inject([ PeopleContentService ], (service) => {
            this.service = service;
        })();
    }

    private get alfrescoApiServiceMock(): any {
        const { setup } = this;

        const peopleApiMock = {
            getPerson: jasmine.createSpy('getPersonSpy').and.callFake((personId) => {
                return new Promise((resolve, reject) => {
                    setup.rejectGetPerson
                        ? reject()
                        : resolve({ id: personId });
                });
            })
        };

        return {
            getInstance: () => {
                return {
                    core: { peopleApi: peopleApiMock }
                };
            }
        };
    }

    get peopleApiGetPersonSpy() {
        return this.service.peopleApi.getPerson;
    }

    get peopleApiGetPersonArguments() {
        return this.peopleApiGetPersonSpy.calls.mostRecent().args;
    }
}

describe('PeopleAPI', () => {
    describe('Get persons', () => {
        it('calls method by an id', async(() => {
            const test = new PeopleContentServiceTest();

            test.service.getPerson('person-1').subscribe(() => {
                expect(test.peopleApiGetPersonArguments[0])
                    .toBe('person-1');
            });
        }));

        it('calls method with "-me-"', async(() => {
            const test = new PeopleContentServiceTest();

            test.service.getCurrentPerson().subscribe(() => {
                expect(test.peopleApiGetPersonArguments[0])
                    .toBe('-me-');
            });
        }));
    });
});
