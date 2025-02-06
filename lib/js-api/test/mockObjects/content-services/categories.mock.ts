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

export class CategoriesMock extends BaseMock {
    get200ResponseSubcategories(categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get(`/alfresco/api/-default-/public/alfresco/versions/1/categories/${categoryId}/subcategories`)
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
                                id: 'testId1',
                                name: 'testName1',
                                parentId: '-root-',
                                hasChildren: true,
                                count: 0
                            }
                        },
                        {
                            entry: {
                                id: 'testId2',
                                name: 'testName2',
                                parentId: '-root-',
                                hasChildren: true,
                                count: 0
                            }
                        }
                    ]
                }
            });
    }

    get404SubcategoryNotExist(categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get(`/alfresco/api/-default-/public/alfresco/versions/1/categories/${categoryId}/subcategories`)
            .reply(404, {
                error: {
                    errorKey: 'framework.exception.EntityNotFound',
                    statusCode: 404,
                    briefSummary: `05220073 The entity with id: ${categoryId} was not found`,
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }

    get200ResponseCategory(categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get(`/alfresco/api/-default-/public/alfresco/versions/1/categories/${categoryId}`)
            .reply(200, {
                entry: {
                    id: 'testId1',
                    name: 'testName1',
                    parentId: '-root-',
                    hasChildren: true,
                    count: 0
                }
            });
    }

    get404CategoryNotExist(categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get(`/alfresco/api/-default-/public/alfresco/versions/1/categories/${categoryId}`)
            .reply(404, {
                error: {
                    errorKey: 'framework.exception.EntityNotFound',
                    statusCode: 404,
                    briefSummary: `05220073 The entity with id: ${categoryId} was not found`,
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }

    get200ResponseNodeCategoryLinks(nodeId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/category-links`)
            .reply(200, {
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
                                id: 'testId1',
                                name: 'testName1',
                                parentId: 'testNode',
                                hasChildren: true,
                                count: 0
                            }
                        }
                    ]
                }
            });
    }

    get403NodeCategoryLinksPermissionDenied(nodeId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/category-links`)
            .reply(403, {
                error: {
                    statusCode: 403
                }
            });
    }

    get404NodeNotExist(nodeId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/category-links`)
            .reply(404, {
                error: {
                    errorKey: 'framework.exception.EntityNotFound',
                    statusCode: 404,
                    briefSummary: `05220073 The entity with id: ${nodeId} was not found`,
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }

    get204CategoryUnlinked(nodeId: string, categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .delete(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/category-links/${categoryId}`)
            .reply(204);
    }

    get403CategoryUnlinkPermissionDenied(nodeId: string, categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .delete(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/category-links/${categoryId}`)
            .reply(403, {
                error: {
                    statusCode: 403
                }
            });
    }

    get404CategoryUnlinkNotFound(nodeId: string, categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .delete(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/category-links/${categoryId}`)
            .reply(404, {
                error: {
                    errorKey: 'framework.exception.EntityNotFound',
                    statusCode: 404,
                    briefSummary: `05230078 The entity with id: ${nodeId} or ${categoryId} was not found`,
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }

    get200ResponseCategoryUpdated(categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .put(`/alfresco/api/-default-/public/alfresco/versions/1/categories/${categoryId}`, { name: 'testName1' })
            .reply(200, {
                entry: {
                    id: 'testId1',
                    name: 'testName1',
                    parentId: '-root-',
                    hasChildren: true,
                    count: 0
                }
            });
    }

    get403CategoryUpdatePermissionDenied(categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .put(`/alfresco/api/-default-/public/alfresco/versions/1/categories/${categoryId}`, { name: 'testName1' })
            .reply(403, {
                error: {
                    statusCode: 403
                }
            });
    }

    get404CategoryUpdateNotFound(categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .put(`/alfresco/api/-default-/public/alfresco/versions/1/categories/${categoryId}`, { name: 'testName1' })
            .reply(404, {
                error: {
                    errorKey: 'framework.exception.EntityNotFound',
                    statusCode: 404,
                    briefSummary: `05230078 The entity with id: ${categoryId} was not found`,
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }

    get201ResponseCategoryCreated(categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post(`/alfresco/api/-default-/public/alfresco/versions/1/categories/${categoryId}/subcategories`, [{ name: 'testName10' }])
            .reply(201, {
                entry: {
                    id: 'testId10',
                    name: 'testName10',
                    parentId: categoryId,
                    hasChildren: true,
                    count: 0
                }
            });
    }

    get403CategoryCreatedPermissionDenied(categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post(`/alfresco/api/-default-/public/alfresco/versions/1/categories/${categoryId}/subcategories`, [{ name: 'testName10' }])
            .reply(403, {
                error: {
                    statusCode: 403
                }
            });
    }

    get409CategoryCreateAlreadyExists(categoryId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post(`/alfresco/api/-default-/public/alfresco/versions/1/categories/${categoryId}/subcategories`, [{ name: 'testName10' }])
            .reply(409, {
                error: {
                    errorKey: 'Duplicate child name not allowed: testName10',
                    statusCode: 409,
                    briefSummary: '06050055 Duplicate child name not allowed: testName10',
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }

    get201ResponseCategoryLinked(nodeId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/category-links`, [{ categoryId: 'testId1' }])
            .reply(201, {
                entry: {
                    id: 'testId1',
                    name: 'testName1',
                    parentId: nodeId,
                    hasChildren: true,
                    count: 0
                }
            });
    }

    get201ResponseCategoryLinkedArray(nodeId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/category-links`, [
                { categoryId: 'testId1' },
                { categoryId: 'testId2' }
            ])
            .reply(201, {
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
                                id: 'testId1',
                                name: 'testName1',
                                parentId: 'testNodeArr',
                                hasChildren: true,
                                count: 0
                            }
                        },
                        {
                            entry: {
                                id: 'testId2',
                                name: 'testName2',
                                parentId: 'testNodeArr',
                                hasChildren: true,
                                count: 0
                            }
                        }
                    ]
                }
            });
    }

    get403CategoryLinkPermissionDenied(nodeId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/category-links`, [{ categoryId: 'testId1' }])
            .reply(403, {
                error: {
                    statusCode: 403
                }
            });
    }

    get404CategoryLinkNotFound(nodeId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/category-links`, [{ categoryId: 'testId1' }])
            .reply(404, {
                error: {
                    errorKey: 'framework.exception.EntityNotFound',
                    statusCode: 404,
                    briefSummary: `05230078 The entity with id: ${nodeId} or testId1 was not found`,
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }

    get405CategoryLinkCannotAssign(nodeId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .post(`/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/category-links`, [{ categoryId: 'testId1' }])
            .reply(405, {
                error: {
                    errorKey: 'Cannot assign node of this type to a category',
                    statusCode: 405,
                    briefSummary: `05230078 Cannot assign a node of this type to a category`,
                    stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
                    descriptionURL: 'https://api-explorer.alfresco.com'
                }
            });
    }
}
