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

import nock from 'nock';
import { BaseMock } from '../base.mock';

export class DiscoveryMock extends BaseMock {
    get200Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/discovery')
            .reply(200, {
                entry: {
                    repository: {
                        edition: 'Enterprise',
                        version: {
                            major: '5',
                            minor: '2',
                            patch: '1',
                            hotfix: '0',
                            schema: 10052,
                            label: 'r133188-b433',
                            display: '5.2.1.0 (r133188-b433) schema 10052'
                        },
                        license: {
                            issuedAt: '2017-04-10T10:45:00.177+0000',
                            expiresAt: '2017-05-10T00:00:00.000+0000',
                            remainingDays: 16,
                            holder: 'Trial User',
                            mode: 'ENTERPRISE',
                            entitlements: { isClusterEnabled: false, isCryptodocEnabled: false }
                        },
                        status: {
                            isReadOnly: false,
                            isAuditEnabled: true,
                            isQuickShareEnabled: true,
                            isThumbnailGenerationEnabled: true
                        },
                        modules: [
                            {
                                id: 'alfresco-share-services',
                                title: 'Alfresco Share Services AMP',
                                description: 'Module to be applied to alfresco.war, containing APIs for Alfresco Share',
                                version: '5.2.0',
                                installDate: '2016-11-28T18:59:22.555+0000',
                                installState: 'INSTALLED',
                                versionMin: '5.1',
                                versionMax: '999'
                            },
                            {
                                id: 'alfresco-trashcan-cleaner',
                                title: 'alfresco-trashcan-cleaner project',
                                description: 'The Alfresco Trash Can Cleaner (Alfresco Module)',
                                version: '2.2',
                                installState: 'UNKNOWN',
                                versionMin: '0',
                                versionMax: '999'
                            },
                            {
                                id: 'enablecors',
                                title: 'Enable Cors support',
                                description: 'Adds a web-fragment with the filter config for Cors support',
                                version: '1.0-SNAPSHOT',
                                installState: 'UNKNOWN',
                                versionMin: '0',
                                versionMax: '999'
                            }
                        ]
                    }
                }
            });
    }
}
