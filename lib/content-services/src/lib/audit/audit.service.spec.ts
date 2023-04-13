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

import { AuditService } from './audit.service';
import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TestBed } from '@angular/core/testing';

declare let jasmine: any;

describe('AuditService', () => {
    let service: AuditService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
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
        service = TestBed.inject(AuditService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should get Audit Applications', (done) => {
        service.getAuditApps().subscribe((data) => {
            expect(data.list.pagination.count).toBe(3);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: {
                list: {
                    pagination: {
                        count: 3,
                        hasMoreItems: false,
                        totalItems: 3,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                isEnabled: true,
                                name: 'Alfresco Tagging Service',
                                id: 'tagging'
                            }
                        },
                        {
                            entry: {
                                isEnabled: true,
                                name: 'ShareSiteAccess',
                                id: 'share-site-access'
                            }
                        },
                        {
                            entry: {
                                isEnabled: true,
                                name: 'alfresco-access',
                                id: 'alfresco-access'
                            }
                        }
                    ]
                }
            }
        });
    });

    it('Should get an Audit Application', (done) => {
        service.getAuditApp('alfresco-access').subscribe((data) => {
            expect(data.entry.id).toBe('alfresco-access');
            expect(data.entry.name).toBe('alfresco-access');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: {
                entry: {
                    id: 'alfresco-access',
                    name: 'alfresco-access',
                    isEnabled: true
                }
            }
        });
    });

    it('Should get Audit Entries', (done) => {
        service.getAuditEntries('alfresco-access').subscribe((data) => {
            expect(data.list.pagination.count).toBe(3);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: {
                list: {
                    pagination: {
                        count: 3,
                        hasMoreItems: false,
                        totalItems: 3,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                id: '1',
                                auditApplicationId: 'alfresco-access',
                                createdByUser: {
                                    displayName: 'admin',
                                    id: 'admin'
                                },
                                createdAt: '2020-08-11T13:11:59.141Z',
                                values: {}
                            }
                        },
                        {
                            entry: {
                                id: '2',
                                auditApplicationId: 'alfresco-access',
                                createdByUser: {
                                    displayName: 'admin',
                                    id: 'admin'
                                },
                                createdAt: '2020-08-11T13:11:59.141Z',
                                values: {}
                            }
                        },
                        {
                            entry: {
                                id: '3',
                                auditApplicationId: 'alfresco-access',
                                createdByUser: {
                                    displayName: 'admin',
                                    id: 'admin'
                                },
                                createdAt: '2020-08-11T13:11:59.141Z',
                                values: {}
                            }
                        }
                    ]
                }
            }
        });
    });

    it('Should get an Audit Entry', (done) => {
        service.getAuditEntry('alfresco-access', '1').subscribe((data) => {
            expect(data.entry.id).toBe('1');
            expect(data.entry.auditApplicationId).toBe('alfresco-access');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: {
                entry: {
                    id: '1',
                    auditApplicationId: 'alfresco-access',
                    createdByUser: {
                        displayName: 'admin',
                        id: 'admin'
                    },
                    createdAt: '2020-08-11T13:11:59.148Z',
                    values: {}
                }
            }
        });
    });
});
