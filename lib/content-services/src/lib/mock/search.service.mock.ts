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

export let fakeSearch = {
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
                    id: '123',
                    name: 'MyDoc',
                    content: {
                        mimetype: 'text/plain'
                    },
                    createdByUser: {
                        displayName: 'John Doe'
                    },
                    modifiedByUser: {
                        displayName: 'John Doe'
                    }
                }
            }
        ]
    }
};

export let mockError = {
    error: {
        errorKey: 'Search failed',
        statusCode: 400,
        briefSummary: '08220082 search failed',
        stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
        descriptionURL: 'https://api-explorer.alfresco.com'
    }
};

export let searchMockApi = {
    core: {
        queriesApi: {
            findNodes: () => Promise.resolve(fakeSearch)
        }
    }
};
