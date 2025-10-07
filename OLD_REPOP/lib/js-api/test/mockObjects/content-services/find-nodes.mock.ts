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

export class FindNodesMock extends BaseMock {
    get200Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/queries/nodes?term=test')
            .reply(200, {
                list: {
                    pagination: {
                        count: 2,
                        hasMoreItems: false,
                        totalItems: 2,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                createdAt: '2011-03-03T10:34:52.092+0000',
                                isFolder: false,
                                isFile: true,
                                createdByUser: { id: 'abeecher', displayName: 'Alice Beecher' },
                                modifiedAt: '2011-03-03T10:34:52.092+0000',
                                modifiedByUser: { id: 'abeecher', displayName: 'Alice Beecher' },
                                name: 'coins1.JPG',
                                id: '7bb9c846-fcc5-43b5-a893-39e46ebe94d4',
                                nodeType: 'cm:content',
                                content: {
                                    mimeType: 'image/jpeg',
                                    mimeTypeName: 'JPEG Image',
                                    sizeInBytes: 501641,
                                    encoding: 'UTF-8'
                                },
                                parentId: '880a0f47-31b1-4101-b20b-4d325e54e8b1'
                            }
                        },
                        {
                            entry: {
                                createdAt: '2011-03-03T10:34:52.092+0000',
                                isFolder: false,
                                isFile: true,
                                createdByUser: { id: 'abeecher', displayName: 'Alice Beecher' },
                                modifiedAt: '2011-03-03T10:34:52.092+0000',
                                modifiedByUser: { id: 'abeecher', displayName: 'Alice Beecher' },
                                name: 'coins2.JPG',
                                id: '7bb9c846-fcc5-43b5-a893-39e46ebe94d4',
                                nodeType: 'cm:content',
                                content: {
                                    mimeType: 'image/jpeg',
                                    mimeTypeName: 'JPEG Image',
                                    sizeInBytes: 501641,
                                    encoding: 'UTF-8'
                                },
                                parentId: '880a0f47-31b1-4101-b20b-4d325e54e8b1'
                            }
                        }
                    ]
                }
            });
    }

    get401Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/queries/nodes?term=test')
            .reply(401, {
                error: {
                    errorKey: 'framework.exception.ApiDefault',
                    statusCode: 401,
                    briefSummary: '05210059 Authentication failed for Web Script org/alfresco/api/ResourceWebScript.get',
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }
}
