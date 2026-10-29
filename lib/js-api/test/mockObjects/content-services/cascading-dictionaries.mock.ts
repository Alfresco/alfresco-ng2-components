/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

const BASE_PATH = '/alfresco/api/-default-/public/alfresco/versions/1/cascading-dictionaries';

const ACCOUNTS_LEVELS = [
    {
        level: 0,
        properties: ['cdict:accountCategory']
    },
    {
        level: 1,
        properties: ['cdict:accountNumber', 'cdict:accountName']
    }
];

const ACCOUNTS_DATA = [
    {
        properties: {
            'cdict:accountCategory': 'Current Assets'
        },
        children: [
            {
                properties: {
                    'cdict:accountNumber': 1000,
                    'cdict:accountName': 'Cash'
                }
            },
            {
                properties: {
                    'cdict:accountNumber': 1100,
                    'cdict:accountName': 'Accounts Receivable'
                }
            }
        ]
    }
];

const accountsDictionary = (version = '1.0') => ({
    name: 'Accounts',
    aspect: 'cdict:account',
    keyProperty: 'cdict:accountNumber',
    versionProperty: 'cdict:accountDictVersion',
    version,
    levels: ACCOUNTS_LEVELS,
    createdAt: '2026-06-23T10:19:02.568+0000',
    modifiedAt: '2026-06-24T11:20:03.001+0000'
});

const errorResponse = (statusCode: number, briefSummary: string) => ({
    error: {
        errorKey: 'framework.exception.ApiDefault',
        statusCode,
        briefSummary,
        stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions',
        descriptionURL: 'https://api-explorer.alfresco.com'
    }
});

export class CascadingDictionariesMock extends BaseMock {
    private path(aspectId?: string, suffix = ''): string {
        return aspectId ? `${BASE_PATH}/${encodeURIComponent(aspectId)}${suffix}` : BASE_PATH;
    }

    get200ResponseList(): void {
        this.mock()
            .get(BASE_PATH)
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
                        { entry: accountsDictionary('1.5') },
                        {
                            entry: {
                                name: 'Departments',
                                aspect: 'cdict:department',
                                keyProperty: 'cdict:departmentId',
                                versionProperty: 'cdict:departmentDictVersion',
                                version: '2.0',
                                levels: [
                                    {
                                        level: 0,
                                        properties: ['cdict:departmentId', 'cdict:departmentName']
                                    }
                                ],
                                createdAt: '2026-06-23T10:19:02.568+0000',
                                modifiedAt: '2026-06-23T10:19:02.568+0000'
                            }
                        }
                    ]
                }
            });
    }

    get200ResponseListPaged(skipCount: number, maxItems: number): void {
        this.mock()
            .get(BASE_PATH)
            .query({ skipCount: `${skipCount}`, maxItems: `${maxItems}` })
            .reply(200, {
                list: {
                    pagination: {
                        count: 1,
                        hasMoreItems: true,
                        totalItems: 2,
                        skipCount,
                        maxItems
                    },
                    entries: [{ entry: accountsDictionary('1.5') }]
                }
            });
    }

    get200ResponseDictionary(aspectId: string): void {
        this.mock()
            .get(this.path(aspectId))
            .reply(200, { entry: accountsDictionary('1.5') });
    }

    get200ResponseDictionaryWithData(aspectId: string): void {
        this.mock()
            .get(this.path(aspectId))
            .query({ include: 'data' })
            .reply(200, { entry: { ...accountsDictionary('1.5'), data: ACCOUNTS_DATA } });
    }

    get200ResponseVersion(aspectId: string, versionId: string): void {
        this.mock()
            .get(this.path(aspectId, `/versions/${versionId}`))
            .reply(200, { entry: accountsDictionary(versionId) });
    }

    get404VersionNotExist(aspectId: string, versionId: string): void {
        this.mock()
            .get(this.path(aspectId, `/versions/${versionId}`))
            .reply(404, errorResponse(404, `versionId ${versionId} does not exist for the cascading dictionary`));
    }

    get404DictionaryNotExist(aspectId: string): void {
        this.mock()
            .get(this.path(aspectId))
            .reply(404, errorResponse(404, `Cascading dictionary for ${aspectId} is not registered in the system`));
    }

    get201ResponseCreate(): void {
        this.mock()
            .post(BASE_PATH)
            .reply(201, { entry: { createdAt: '2026-06-23T10:19:02.568+0000' } });
    }

    get409ResponseCreateAlreadyExists(): void {
        this.mock().post(BASE_PATH).reply(409, errorResponse(409, 'The cascading dictionary of the specified name or aspect already exists'));
    }

    get422ResponseCreateModelIntegrity(): void {
        this.mock().post(BASE_PATH).reply(422, errorResponse(422, 'Model integrity exception: the aspect does not exist'));
    }

    get403ResponseCreateForbidden(): void {
        this.mock().post(BASE_PATH).reply(403, errorResponse(403, 'Current user does not have permission to create a cascading dictionary'));
    }

    get200ResponseUpdate(aspectId: string): void {
        this.mock()
            .put(this.path(aspectId))
            .reply(200, { entry: { modifiedAt: '2026-06-24T11:20:03.001+0000' } });
    }

    get201ResponseContent(aspectId: string): void {
        this.mock()
            .post(this.path(aspectId, '/content'))
            .reply(201, { entry: { ...accountsDictionary('1.1'), data: ACCOUNTS_DATA } });
    }

    get201ResponseContentMajorVersion(aspectId: string): void {
        this.mock()
            .post(this.path(aspectId, '/content'))
            .query({ majorVersion: 'true' })
            .reply(201, { entry: { ...accountsDictionary('2.0'), data: ACCOUNTS_DATA } });
    }

    get413ResponseContentTooLarge(aspectId: string): void {
        this.mock().post(this.path(aspectId, '/content')).reply(413, errorResponse(413, 'Content exceeds individual file size limit'));
    }

    get422ResponseContentInvalid(aspectId: string): void {
        this.mock()
            .post(this.path(aspectId, '/content'))
            .reply(422, errorResponse(422, 'Model integrity exception: level numbers must start at 0 and be sequential'));
    }

    get204ResponseDelete(aspectId: string): void {
        this.mock().delete(this.path(aspectId)).reply(204);
    }

    get403ResponseDeleteForbidden(aspectId: string): void {
        this.mock()
            .delete(this.path(aspectId))
            .reply(403, errorResponse(403, 'Current user does not have permission to delete a cascading dictionary'));
    }
}
