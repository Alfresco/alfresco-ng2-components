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

export class VersionMock extends BaseMock {
    post201Response(nodeId: string, versionId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/alfresco/versions/1/nodes/' + nodeId + '/versions/' + versionId + '/revert')
            .reply(201, { entry: { id: '3.0' } });
    }

    get200Response(nodeId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/nodes/' + nodeId + '/versions')
            .reply(200, {
                list: {
                    pagination: {
                        count: 2,
                        hasMoreItems: false,
                        totalItems: 2,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [{ entry: { id: '2.0' } }, { entry: { id: '1.0' } }]
                }
            });
    }

    get200ResponseVersionRenditions(nodeId: string, versionId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/nodes/' + nodeId + '/versions/' + versionId + '/renditions')
            .reply(200, {
                list: {
                    pagination: {
                        count: 6,
                        hasMoreItems: false,
                        totalItems: 6,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                id: 'avatar',
                                content: { mimeType: 'image/png', mimeTypeName: 'PNG Image' },
                                status: 'NOT_CREATED'
                            }
                        },
                        {
                            entry: {
                                id: 'avatar32',
                                content: { mimeType: 'image/png', mimeTypeName: 'PNG Image' },
                                status: 'NOT_CREATED'
                            }
                        },
                        {
                            entry: {
                                id: 'doclib',
                                content: { mimeType: 'image/png', mimeTypeName: 'PNG Image' },
                                status: 'NOT_CREATED'
                            }
                        },
                        {
                            entry: {
                                id: 'imgpreview',
                                content: { mimeType: 'image/jpeg', mimeTypeName: 'JPEG Image' },
                                status: 'NOT_CREATED'
                            }
                        },
                        {
                            entry: {
                                id: 'medium',
                                content: { mimeType: 'image/jpeg', mimeTypeName: 'JPEG Image' },
                                status: 'NOT_CREATED'
                            }
                        },
                        {
                            entry: {
                                id: 'pdf',
                                content: { mimeType: 'application/pdf', mimeTypeName: 'Adobe PDF Document' },
                                status: 'NOT_CREATED'
                            }
                        }
                    ]
                }
            });
    }

    get200VersionRendition(nodeId: string, versionId: string, renditionId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/nodes/' + nodeId + '/versions/' + versionId + '/renditions/' + renditionId)
            .reply(200, {
                entry: {
                    id: 'pdf',
                    content: { mimeType: 'application/pdf', mimeTypeName: 'Adobe PDF Document' },
                    status: 'NOT_CREATED'
                }
            });
    }

    create200VersionRendition(nodeId: string, versionId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/alfresco/api/-default-/public/alfresco/versions/1/nodes/' + nodeId + '/versions/' + versionId + '/renditions', { id: 'pdf' })
            .reply(202, '');
    }
}
