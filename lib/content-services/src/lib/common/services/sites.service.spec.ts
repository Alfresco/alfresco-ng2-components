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

import { TestBed } from '@angular/core/testing';
import { AppConfigService, setupTestBed, CoreTestingModule } from '@alfresco/adf-core';
import { SitesService } from './sites.service';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('Sites service', () => {

    let service;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config = {
            ecmHost: 'http://localhost:9876/ecm',
            files: {
                excluded: ['.DS_Store', 'desktop.ini', '.git', '*.git']
            }
        };

        service = TestBed.inject(SitesService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should get a list of users sites', (done) => {
        service.getSites().subscribe((data) => {
            expect(data.list.entries[0].entry.title).toBe('FAKE');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: {
                list: {
                    pagination: {
                        count: 1,
                        hasMoreItems: false,
                        totalItems: 1,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                role: 'SiteManager',
                                visibility: 'PUBLIC',
                                guid: 'b4cff62a-664d-4d45-9302-98723eac1319',
                                description: 'This is a Sample Alfresco Team site.',
                                id: 'swsdp',
                                title: 'FAKE'
                            }
                        }
                    ]
                }
            }
        });
    });

    it('Should get single sites via siteId', (done) => {
        service.getSite('fake-site-id').subscribe((data) => {
            expect(data.entry.title).toBe('FAKE-SINGLE-TITLE');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: {
                entry: {
                    role: 'SiteManager',
                    visibility: 'PUBLIC',
                    guid: 'b4cff62a-664d-4d45-9302-98723eac1319',
                    description: 'This is a Sample Alfresco Team site.',
                    id: 'swsdp',
                    preset: 'site-dashboard',
                    title: 'FAKE-SINGLE-TITLE'
                }
            }
        });
    });

    it('should get a list of membership requests', (done) => {
        service.getSiteMembershipRequests().subscribe((data) => {
            expect(data.list.entries[0].entry.site.id).toBe('site-id');
            expect(data.list.entries[0].entry.person.id).toBe('user-id');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: {
                list: {
                    pagination: {
                        count: 1,
                        hasMoreItems: false,
                        totalItems: 1,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                id: 'site-id',
                                createdAt: '2020-05-13T07:46:36.180Z',
                                site: {
                                        id: 'site-id',
                                        guid: 'b4cff62a-664d-4d45-9302-98723eac1319',
                                        title: 'Sample Site',
                                        description: '',
                                        visibility: 'MODERATED',
                                        preset: 'preset',
                                        role: 'Manager'
                                },
                                person: {
                                        id: 'user-id',
                                        firstName: 'string',
                                        lastName: 'string',
                                        displayName: 'string'
                                },
                                message: 'message'
                            }
                      }
                    ]
                }
            }
        });
    });
});
