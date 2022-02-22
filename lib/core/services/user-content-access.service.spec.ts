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

import { CoreTestingModule, setupTestBed } from '../testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppConfigService } from '../app-config';
import { UserContentAccessService } from './user-content-access.service';
import { PeopleContentService } from './people-content.service';

describe('UserContentAccessService', () => {
    let userContentAccessService: UserContentAccessService;
    let peopleContentService: PeopleContentService;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [CoreTestingModule],
        providers: [UserContentAccessService]
    });

    beforeEach(() => {
        userContentAccessService = TestBed.inject(UserContentAccessService);
        peopleContentService = TestBed.inject(PeopleContentService);
        appConfigService = TestBed.inject(AppConfigService);
    });

    it('should return true if user is content admin and provider is ECM', async () => {
        appConfigService.config.providers = 'ECM';
        spyOn(peopleContentService, 'getCurrentUserInfo').and.returnValue(of({}as any));
        spyOn(peopleContentService, 'isCurrentUserAdmin').and.returnValue(true);
        const isContentAdmin = await userContentAccessService.isCurrentUserAdmin();

        expect(isContentAdmin).toEqual(true);
    });

    it('should return true if user is content admin and provider is ALL', async () => {
        appConfigService.config.providers = 'ALL';
        spyOn(peopleContentService, 'getCurrentUserInfo').and.returnValue(of({} as any));
        spyOn(peopleContentService, 'isCurrentUserAdmin').and.returnValue(true);
        const isContentAdmin = await userContentAccessService.isCurrentUserAdmin();

        expect(isContentAdmin).toEqual(true);
    });

    it('should return false if provider is BPM', async () => {
        appConfigService.config.providers = 'BPM';
        const isCurrentUserAdminSpy = spyOn(peopleContentService, 'isCurrentUserAdmin').and.returnValue(true);
        const isContentAdmin = await userContentAccessService.isCurrentUserAdmin();

        expect(isContentAdmin).toEqual(false);
        expect(isCurrentUserAdminSpy).not.toHaveBeenCalled();
    });

});
