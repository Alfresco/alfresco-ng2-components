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
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiService } from './alfresco-api.service';
import { AlfrescoSettingsService } from './alfresco-settings.service';
import { AppConfigModule, AppConfigService } from './app-config.service';
import { AuthenticationService } from './authentication.service';
import { LogService } from './log.service';
import { SitesApiService } from './sites-api.service';
import { StorageService } from './storage.service';
import { AlfrescoTranslateLoader } from './translate-loader.service';
import { UserPreferencesService } from './user-preferences.service';

declare let jasmine: any;

describe('Sites service', () => {

    let service;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppConfigModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: AlfrescoTranslateLoader
                    }
                })
            ],
            providers: [
                SitesApiService,
                AlfrescoApiService,
                UserPreferencesService,
                AuthenticationService,
                AlfrescoSettingsService,
                StorageService,
                LogService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        let appConfig: AppConfigService = TestBed.get(AppConfigService);
        appConfig.config = {
            ecmHost: 'http://localhost:9876/ecm',
            files: {
                excluded: ['.DS_Store', 'desktop.ini', '.git', '*.git']
            }
        };

        service = TestBed.get(SitesApiService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should get a list of users sites', (done) => {
        service.getSites().subscribe((data) => {
            expect(data[0].title).toBe('FAKE');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: {
                'list': {
                    'pagination': {
                        'count': 1,
                        'hasMoreItems': false,
                        'totalItems': 1,
                        'skipCount': 0,
                        'maxItems': 100
                    },
                    'entries': [
                        {
                            'entry': {
                                'role': 'SiteManager',
                                'visibility': 'PUBLIC',
                                'guid': 'b4cff62a-664d-4d45-9302-98723eac1319',
                                'description': 'This is a Sample Alfresco Team site.',
                                'id': 'swsdp',
                                'title': 'FAKE'
                            }
                        }
                    ]
                }
            }
        });
    });

    it('Should get single sites via siteId', (done) => {
        service.getSite('fake-site-id').subscribe((data) => {
            expect(data.title).toBe('FAKE-SINGLE-TITLE');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: {
                'entry': {
                    'role': 'SiteManager',
                    'visibility': 'PUBLIC',
                    'guid': 'b4cff62a-664d-4d45-9302-98723eac1319',
                    'description': 'This is a Sample Alfresco Team site.',
                    'id': 'swsdp',
                    'preset': 'site-dashboard',
                    'title': 'FAKE-SINGLE-TITLE'
                }
            }
        });
    });

    it('deleteSite should perform a call against the server', (done) => {
        service.deleteSite('fake-site-id').subscribe(() => {
            expect(jasmine.Ajax.requests.mostRecent().method).toBe('DELETE');
            expect(jasmine.Ajax.requests.mostRecent().url)
                .toContain('alfresco/api/-default-/public/alfresco/versions/1/sites/fake-site-id');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 204
        });
    });

    it('getSites catch errors call', (done) => {
        service.getSites().subscribe(() => {
        }, () => {
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 403
        });
    });

    it('getSite catch errors call', (done) => {
        service.getSite('error-id').subscribe(() => {
        }, () => {
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 403
        });
    });
});
