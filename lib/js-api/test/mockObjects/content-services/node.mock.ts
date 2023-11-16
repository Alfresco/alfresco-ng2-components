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

import nock from 'nock';
import { BaseMock } from '../base.mock';

export class NodeMock extends BaseMock {
    get200ResponseChildren(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/nodes/b4cff62a-664d-4d45-9302-98723eac1319/children')
            .reply(200, {
                list: {
                    pagination: {
                        count: 5,
                        hasMoreItems: false,
                        totalItems: 5,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                createdAt: '2011-02-15T20:19:00.007+0000',
                                isFolder: true,
                                isFile: false,
                                createdByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                modifiedAt: '2011-02-15T20:19:00.007+0000',
                                modifiedByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                name: 'dataLists',
                                id: '64f69e69-f61e-42a3-8697-95eea1f2bda2',
                                nodeType: 'cm:folder',
                                parentId: 'b4cff62a-664d-4d45-9302-98723eac1319'
                            }
                        },
                        {
                            entry: {
                                createdAt: '2011-02-15T22:04:54.290+0000',
                                isFolder: true,
                                isFile: false,
                                createdByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                modifiedAt: '2011-02-15T22:04:54.290+0000',
                                modifiedByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                name: 'discussions',
                                id: '059c5bc7-2d38-4dc5-96b8-d09cd3c69b4c',
                                nodeType: 'cm:folder',
                                parentId: 'b4cff62a-664d-4d45-9302-98723eac1319'
                            }
                        },
                        {
                            entry: {
                                createdAt: '2011-02-15T20:16:28.292+0000',
                                isFolder: true,
                                isFile: false,
                                createdByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                modifiedAt: '2016-06-27T14:31:10.007+0000',
                                modifiedByUser: { id: 'admin', displayName: 'Administrator' },
                                name: 'documentLibrary',
                                id: '8f2105b4-daaf-4874-9e8a-2152569d109b',
                                nodeType: 'cm:folder',
                                parentId: 'b4cff62a-664d-4d45-9302-98723eac1319'
                            }
                        },
                        {
                            entry: {
                                createdAt: '2011-02-15T20:18:59.808+0000',
                                isFolder: true,
                                isFile: false,
                                createdByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                modifiedAt: '2011-02-15T20:18:59.808+0000',
                                modifiedByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                name: 'links',
                                id: '0e24b99c-41f0-43e1-a55e-fb9f50d73820',
                                nodeType: 'cm:folder',
                                parentId: 'b4cff62a-664d-4d45-9302-98723eac1319'
                            }
                        },
                        {
                            entry: {
                                createdAt: '2011-02-15T21:46:01.603+0000',
                                isFolder: true,
                                isFile: false,
                                createdByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                modifiedAt: '2011-02-15T21:46:01.603+0000',
                                modifiedByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                name: 'wiki',
                                id: 'cdefb3a9-8f55-4771-a9e3-06fa370250f6',
                                nodeType: 'cm:folder',
                                parentId: 'b4cff62a-664d-4d45-9302-98723eac1319'
                            }
                        }
                    ]
                }
            });
    }

    get200ResponseChildrenNonUTCTimes(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/nodes/b4cff62a-664d-4d45-9302-98723eac1320/children')
            .reply(200, {
                list: {
                    pagination: {
                        count: 5,
                        hasMoreItems: false,
                        totalItems: 5,
                        skipCount: 0,
                        maxItems: 100
                    },
                    entries: [
                        {
                            entry: {
                                createdAt: '2011-03-15T12:04:54.290-0500',
                                isFolder: true,
                                isFile: false,
                                createdByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                modifiedAt: '2011-03-15T12:04:54.290-0500',
                                modifiedByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                name: 'discussions',
                                id: '059c5bc7-2d38-4dc5-96b8-d09cd3c69b4c',
                                nodeType: 'cm:folder',
                                parentId: 'b4cff62a-664d-4d45-9302-98723eac1320'
                            }
                        }
                    ]
                }
            });
    }

    get404ChildrenNotExist(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/nodes/b4cff62a-664d-4d45-9302-98723eac1319/children')
            .reply(404, {
                error: {
                    errorKey: 'framework.exception.EntityNotFound',
                    statusCode: 404,
                    briefSummary: '05220073 The entity with id: 80a94ac4-3ec4-47ad-864e-5d939424c47c was not found',
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }

    get401CreationFolder(): void {
        nock(this.host, { encodedQueryParams: true }).post('/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children').reply(401);
    }

    get204SuccessfullyDeleted(): void {
        nock(this.host, { encodedQueryParams: true })
            .delete('/alfresco/api/-default-/public/alfresco/versions/1/nodes/80a94ac8-3ece-47ad-864e-5d939424c47c')
            .reply(204);
    }

    get403DeletePermissionDenied(): void {
        nock(this.host, { encodedQueryParams: true })
            .delete('/alfresco/api/-default-/public/alfresco/versions/1/nodes/80a94ac8-3ece-47ad-864e-5d939424c47c')
            .reply(403);
    }

    get404DeleteNotFound(): void {
        nock(this.host, { encodedQueryParams: true })
            .delete('/alfresco/api/-default-/public/alfresco/versions/1/nodes/80a94ac8-test-47ad-864e-5d939424c47c')
            .reply(404, {
                error: {
                    errorKey: 'framework.exception.EntityNotFound',
                    statusCode: 404,
                    briefSummary: '05230078 The entity with id: 80a94ac8-test-47ad-864e-5d939424c47c was not found',
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }

    get200ResponseChildrenFutureNewPossibleValue(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/alfresco/api/-default-/public/alfresco/versions/1/nodes/b4cff62a-664d-4d45-9302-98723eac1319/children')
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
                                createdAt: '2011-02-15T20:19:00.007+0000',
                                isFolder: true,
                                isFile: false,
                                createdByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                modifiedAt: '2011-02-15T20:19:00.007+0000',
                                modifiedByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                name: 'dataLists',
                                id: '64f69e69-f61e-42a3-8697-95eea1f2bda2',
                                nodeType: 'cm:folder',
                                parentId: 'b4cff62a-664d-4d45-9302-98723eac1319',
                                impossibleProperties: 'impossibleRightValue'
                            }
                        },
                        {
                            entry: {
                                createdAt: '2011-02-15T22:04:54.290+0000',
                                isFolder: true,
                                isFile: false,
                                createdByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                modifiedAt: '2011-02-15T22:04:54.290+0000',
                                modifiedByUser: { id: 'mjackson', displayName: 'Mike Jackson' },
                                name: 'discussions',
                                id: '059c5bc7-2d38-4dc5-96b8-d09cd3c69b4c',
                                nodeType: 'cm:folder',
                                parentId: 'b4cff62a-664d-4d45-9302-98723eac1319',
                                impossibleProperties: 'impossibleRightValue'
                            }
                        }
                    ]
                }
            });
    }
}
