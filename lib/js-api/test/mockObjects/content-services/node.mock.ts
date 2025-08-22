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

export class NodeMock extends BaseMock {
    get200ResponseChildren(): void {
        this.createNockWithCors()
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
        this.createNockWithCors()
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
        this.createNockWithCors()
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
        this.createNockWithCors().post('/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children').reply(401);
    }

    get204SuccessfullyDeleted(): void {
        this.createNockWithCors().delete('/alfresco/api/-default-/public/alfresco/versions/1/nodes/80a94ac8-3ece-47ad-864e-5d939424c47c').reply(204);
    }

    get403DeletePermissionDenied(): void {
        this.createNockWithCors().delete('/alfresco/api/-default-/public/alfresco/versions/1/nodes/80a94ac8-3ece-47ad-864e-5d939424c47c').reply(403);
    }

    get404DeleteNotFound(): void {
        this.createNockWithCors()
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
        this.createNockWithCors()
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

    post200ResponseInitiateFolderSizeCalculation(): void {
        this.createNockWithCors()
            .post('/alfresco/api/-default-/public/alfresco/versions/1/nodes/b4cff62a-664d-4d45-9302-98723eac1319/size-details')
            .reply(200, {
                entry: {
                    jobId: '5ade426e-8a04-4d50-9e42-6e8a041d50f3'
                }
            });
    }

    post404NodeIdNotFound(): void {
        this.createNockWithCors()
            .post('/alfresco/api/-default-/public/alfresco/versions/1/nodes/b4cff62a-664d-4d45-9302-98723eac1319/size-details')
            .reply(404, {
                error: {
                    errorKey: 'framework.exception.EntityNotFound',
                    statusCode: 404,
                    briefSummary: '11207522 The entity with id: b4cff62a-664d-4d45-9302-98723eac1319 was not found',
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions',
                    descriptionURL: 'https://api-explorer.alfresco.com',
                    logId: 'fafaf3c9-4e23-412b-baf3-c94e23912be5'
                }
            });
    }

    get200ResponseGetFolderSizeInfo(): void {
        this.createNockWithCors()
            .get(
                '/alfresco/api/-default-/public/alfresco/versions/1/nodes/b4cff62a-664d-4d45-9302-98723eac1319/size-details/5ade426e-8a04-4d50-9e42-6e8a041d50f3'
            )
            .reply(200, {
                entry: {
                    numberOfFiles: 100,
                    jobId: '5ade426e-8a04-4d50-9e42-6e8a041d50f3',
                    sizeInBytes: 2689,
                    id: '32e522f1-1f28-4ea3-a522-f11f284ea397',
                    calculatedAt: '2024-12-20T12:02:23.989+0000',
                    status: 'COMPLETED'
                }
            });
    }

    get404JobIdNotFound(): void {
        this.createNockWithCors()
            .get(
                '/alfresco/api/-default-/public/alfresco/versions/1/nodes/b4cff62a-664d-4d45-9302-98723eac1319/size-details/5ade426e-8a04-4d50-9e42-6e8a041d50f3'
            )
            .reply(404, {
                error: {
                    errorKey: 'jobId does not exist',
                    statusCode: 404,
                    briefSummary: '11207212 jobId does not exist',
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions',
                    descriptionURL: 'https://api-explorer.alfresco.com',
                    logId: 'a98180c0-b1c0-48cb-8180-c0b1c0f8cba8'
                }
            });
    }
}
