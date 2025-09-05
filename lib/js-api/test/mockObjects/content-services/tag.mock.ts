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

import { BaseMock } from '../base.mock';
import { TagBody, TagEntry, TagPaging } from '../../../src/api/content-rest-api';

export class TagMock extends BaseMock {
    get200Response(): void {
        this.createNockWithCors().get('/alfresco/api/-default-/public/alfresco/versions/1/tags').reply(200, this.getPaginatedListOfTags());
    }

    getTagsByNameFilteredByMatching200Response(): void {
        this.createNockWithCors()
            .get('/alfresco/api/-default-/public/alfresco/versions/1/tags?where=(tag%20matches%20(%27*tag-test*%27))')
            .reply(200, this.getPaginatedListOfTags());
    }

    getTagsByNamesFilterByExactTag200Response(): void {
        this.createNockWithCors()
            .get('/alfresco/api/-default-/public/alfresco/versions/1/tags?where=(tag%3D%27tag-test-1%27)')
            .reply(200, {
                list: {
                    pagination: {
                        count: 1,
                        hasMoreItems: false,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [this.mockTagEntry()]
                }
            });
    }

    get401Response(): void {
        this.createNockWithCors()
            .get('/alfresco/api/-default-/public/alfresco/versions/1/tags')
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

    createTags201Response(): void {
        this.createNockWithCors().post('/alfresco/api/-default-/public/alfresco/versions/1/tags').reply(201, this.getPaginatedListOfTags());
    }

    get201ResponseForAssigningTagsToNode(body: TagBody[]): void {
        this.createNockWithCors()
            .post('/alfresco/api/-default-/public/alfresco/versions/1/nodes/someNodeId/tags', JSON.stringify(body))
            .reply(201, body.length > 1 ? this.getPaginatedListOfTags() : this.mockTagEntry());
    }

    private getPaginatedListOfTags(): TagPaging {
        return {
            list: {
                pagination: {
                    count: 2,
                    hasMoreItems: false,
                    skipCount: 0,
                    maxItems: 100
                },
                entries: [this.mockTagEntry(), this.mockTagEntry('tag-test-2', 'd79bdbd0-9f55-45bb-9521-811e15bf48f6')]
            }
        };
    }

    private mockTagEntry(tag = 'tag-test-1', id = '0d89aa82-f2b8-4a37-9a54-f4c5148174d6'): TagEntry {
        return {
            entry: {
                tag,
                id
            }
        };
    }
}
