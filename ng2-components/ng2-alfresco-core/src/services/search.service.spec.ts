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

import { async, TestBed } from '@angular/core/testing';
import { fakeApi, fakeError, fakeSearch } from '../assets/search.service.mock';
import { CookieServiceMock } from './../assets/cookie.service.mock';
import { AlfrescoApiService } from './alfresco-api.service';
import { AlfrescoSettingsService } from './alfresco-settings.service';
import { AppConfigModule } from './app-config.service';
import { AuthenticationService } from './authentication.service';
import { CookieService } from './cookie.service';
import { LogService } from './log.service';
import { SearchService } from './search.service';
import { StorageService } from './storage.service';
import { UserPreferencesService } from './user-preferences.service';

describe('SearchService', () => {

    let service: SearchService;
    let apiService: AlfrescoApiService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppConfigModule
            ],
            providers: [
                SearchService,
                AuthenticationService,
                AlfrescoApiService,
                AlfrescoSettingsService,
                AuthenticationService,
                StorageService,
                UserPreferencesService,
                { provide: CookieService, useClass: CookieServiceMock },
                LogService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(SearchService);
        apiService = TestBed.get(AlfrescoApiService);
        spyOn(apiService, 'getInstance').and.returnValue(fakeApi);
    });

    it('should call search API with no additional options', (done) => {
        let searchTerm = 'searchTerm63688';
        spyOn(fakeApi.core.queriesApi, 'findNodes').and.returnValue(Promise.resolve(fakeSearch));
        service.getNodeQueryResults(searchTerm).subscribe(
            () => {
                expect(fakeApi.core.queriesApi.findNodes).toHaveBeenCalledWith(searchTerm, undefined);
                done();
            }
        );
    });

    it('should call search API with additional options', (done) => {
        let searchTerm = 'searchTerm63688', options = {
            include: [ 'path' ],
            rootNodeId: '-root-',
            nodeType: 'cm:content'
        };
        spyOn(fakeApi.core.queriesApi, 'findNodes').and.returnValue(Promise.resolve(fakeSearch));
        service.getNodeQueryResults(searchTerm, options).subscribe(
            () => {
                expect(fakeApi.core.queriesApi.findNodes).toHaveBeenCalledWith(searchTerm, options);
                done();
            }
        );
    });

    it('should return search results returned from the API', (done) => {
        service.getNodeQueryResults('').subscribe(
            (res: any) => {
                expect(res).toBeDefined();
                expect(res).toEqual(fakeSearch);
                done();
            }
        );
    });

    it('should notify errors returned from the API', (done) => {
        spyOn(fakeApi.core.queriesApi, 'findNodes').and.returnValue(Promise.reject(fakeError));
        service.getNodeQueryResults('').subscribe(
            () => {},
            (res: any) => {
                expect(res).toBeDefined();
                expect(res).toEqual(fakeError);
                done();
            }
        );
    });

    it('should notify a general error if the API does not return a specific error', (done) => {
        spyOn(fakeApi.core.queriesApi, 'findNodes').and.returnValue(Promise.reject(null));
        service.getNodeQueryResults('').subscribe(
            () => {},
            (res: any) => {
                expect(res).toBeDefined();
                expect(res).toEqual('Server error');
                done();
            }
        );
    });

});
