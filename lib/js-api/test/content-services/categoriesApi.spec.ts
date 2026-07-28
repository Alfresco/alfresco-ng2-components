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

import assert from 'assert';
import { resetGlobalMockAgent } from './mockObjects/base.mock';
import { AlfrescoApi, CategoriesApi, CategoryPaging, CategoryEntry } from '../../src';
import { EcmAuthMock, CategoriesMock } from '../mockObjects';
import { describe, it, beforeEach, afterEach } from 'node:test';

describe('Categories', () => {
    let authResponseMock: EcmAuthMock;
    let categoriesMock: CategoriesMock;
    let categoriesApi: CategoriesApi;

    beforeEach(async () => {
        const hostEcm = 'https://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        categoriesMock = new CategoriesMock(hostEcm);

        authResponseMock.get201Response();
        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        await alfrescoJsApi.login('admin', 'admin');
        categoriesApi = new CategoriesApi(alfrescoJsApi);
    });

    afterEach(() => {
        resetGlobalMockAgent();
    });

    it('should return 200 while getting subcategories for category with categoryId if all is ok', async () => {
        categoriesMock.get200ResponseSubcategories('-root-');
        categoriesApi.getSubcategories('-root-').then((response: CategoryPaging) => {
            assert.equal(response.list.pagination.count, 2);
            assert.equal(response.list.entries[0].entry.parentId, '-root-');
            assert.equal(response.list.entries[0].entry.id, 'testId1');
            
        });
    });

    it('should return 404 while getting subcategories for not existing category', async () => {
        categoriesMock.get404SubcategoryNotExist('notExistingId');
        categoriesApi.getSubcategories('notExistingId').then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 404);
                
            }
        );
    });

    it('should return 200 while getting category with categoryId if category exists', async () => {
        categoriesMock.get200ResponseCategory('testId1');
        categoriesApi.getCategory('testId1').then((response: CategoryEntry) => {
            assert.equal(response.entry.parentId, '-root-');
            assert.equal(response.entry.id, 'testId1');
            
        });
    });

    it('should return 404 while getting category with categoryId when category not exists', async () => {
        categoriesMock.get404CategoryNotExist('notExistingId');
        categoriesApi.getCategory('notExistingId').then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 404);
                
            }
        );
    });

    it('should return 200 while getting categories linked to node with nodeId if node has some categories assigned', async () => {
        categoriesMock.get200ResponseNodeCategoryLinks('testNode');
        categoriesApi.getCategoryLinksForNode('testNode').then((response: CategoryPaging) => {
            assert.equal(response.list.entries[0].entry.parentId, 'testNode');
            assert.equal(response.list.entries[0].entry.id, 'testId1');
            
        });
    });

    it('should return 403 while getting categories linked to node with nodeId if user has no rights to get from node', async () => {
        categoriesMock.get403NodeCategoryLinksPermissionDenied('testNode');
        categoriesApi.getCategoryLinksForNode('testNode').then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 403);
                
            }
        );
    });

    it('should return 404 while getting categories linked to node with nodeId if node does not exist', async () => {
        categoriesMock.get404NodeNotExist('testNode');
        categoriesApi.getCategoryLinksForNode('testNode').then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 404);
                
            }
        );
    });

    it('should return 204 after unlinking category', async () => {
        categoriesMock.get204CategoryUnlinked('testNode', 'testId1');
        categoriesApi.unlinkNodeFromCategory('testNode', 'testId1').then(() => {
            
        });
    });

    it('should return 404 while unlinking category if category with categoryId or node with nodeId does not exist', async () => {
        categoriesMock.get404CategoryUnlinkNotFound('testNode', 'testId1');
        categoriesApi.unlinkNodeFromCategory('testNode', 'testId1').then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 404);
                
            }
        );
    });

    it('should return 403 while unlinking category if user has no rights to unlink', async () => {
        categoriesMock.get403CategoryUnlinkPermissionDenied('testNode', 'testId1');
        categoriesApi.unlinkNodeFromCategory('testNode', 'testId1').then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 403);
                
            }
        );
    });

    it('should return 200 while updating category if all is ok', async () => {
        categoriesMock.get200ResponseCategoryUpdated('testId1');
        categoriesApi.updateCategory('testId1', { name: 'testName1' }).then((response) => {
            assert.equal(response.entry.id, 'testId1');
            assert.equal(response.entry.name, 'testName1');
            
        });
    });

    it('should return 404 while updating category if category with categoryId does not exist', async () => {
        categoriesMock.get404CategoryUpdateNotFound('testId1');
        categoriesApi.updateCategory('testId1', { name: 'testName1' }).then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 404);
                
            }
        );
    });

    it('should return 403 while updating category if user has no rights to update', async () => {
        categoriesMock.get403CategoryUpdatePermissionDenied('testId1');
        categoriesApi.updateCategory('testId1', { name: 'testName1' }).then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 403);
                
            }
        );
    });

    it('should return 201 while creating category if all is ok', async () => {
        categoriesMock.get201ResponseCategoryCreated('testId1');
        categoriesApi.createSubcategories('testId1', [{ name: 'testName10' }]).then((response: CategoryPaging | CategoryEntry) => {
            assert.equal((response as CategoryEntry).entry.parentId, 'testId1');
            assert.equal((response as CategoryEntry).entry.name, 'testName10');
            
        });
    });

    it('should return 409 while creating subcategory if subcategory already exists', async () => {
        categoriesMock.get409CategoryCreateAlreadyExists('testId1');
        categoriesApi.createSubcategories('testId1', [{ name: 'testName10' }]).then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 409);
                
            }
        );
    });

    it('should return 403 while creating category if user has no rights to create', async () => {
        categoriesMock.get403CategoryCreatedPermissionDenied('testId1');
        categoriesApi.createSubcategories('testId1', [{ name: 'testName10' }]).then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 403);
                
            }
        );
    });

    it('should return 201 while linking category if all is ok', async () => {
        categoriesMock.get201ResponseCategoryLinked('testNode');
        categoriesApi.linkNodeToCategory('testNode', [{ categoryId: 'testId1' }]).then((response) => {
            if (response instanceof CategoryEntry) {
                assert.equal(response.entry.id, 'testId1');
                assert.equal(response.entry.name, 'testName1');
                
            } else {
                assert.fail();
            }
        });
    });

    it('should return 201 while linking multiple categories if all is ok', async () => {
        categoriesMock.get201ResponseCategoryLinkedArray('testNodeArr');
        categoriesApi.linkNodeToCategory('testNodeArr', [{ categoryId: 'testId1' }, { categoryId: 'testId2' }]).then((response) => {
            const categoriesPaging = response as CategoryPaging;
            assert.equal(categoriesPaging.list.pagination.count, 2);
            assert.equal(categoriesPaging.list.entries[0].entry.id, 'testId1');
            assert.equal(categoriesPaging.list.entries[0].entry.name, 'testName1');
            assert.equal(categoriesPaging.list.entries[1].entry.id, 'testId2');
            assert.equal(categoriesPaging.list.entries[1].entry.name, 'testName2');
            
        });
    });

    it('should return 404 while linking category if node with nodeId or category with categoryId does not exist', async () => {
        categoriesMock.get404CategoryLinkNotFound('testNode');
        categoriesApi.linkNodeToCategory('testNode', [{ categoryId: 'testId1' }]).then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 404);
                
            }
        );
    });

    it('should return 403 while linking category if user has no rights to link', async () => {
        categoriesMock.get403CategoryLinkPermissionDenied('testNode');
        categoriesApi.linkNodeToCategory('testNode', [{ categoryId: 'testId1' }]).then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 403);
                
            }
        );
    });

    it('should return 405 while linking category if node of this type cannot be assigned to category', async () => {
        categoriesMock.get405CategoryLinkCannotAssign('testNode');
        categoriesApi.linkNodeToCategory('testNode', [{ categoryId: 'testId1' }]).then(
            () => {},
            (error: { status: number }) => {
                assert.equal(error.status, 405);
                
            }
        );
    });
});
