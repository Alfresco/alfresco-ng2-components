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
import { resetGlobalMockAgent } from '../mockObjects/base.mock';
import { AlfrescoApi, NodesApi } from '../../src';
import { EcmAuthMock, NodeMock } from '../mockObjects';
import { describe, it, beforeEach, afterEach } from 'node:test';

describe('Node', () => {
    let authResponseMock: EcmAuthMock;
    let nodeMock: NodeMock;
    let nodesApi: NodesApi;

    beforeEach(async () => {
        const hostEcm = 'https://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        nodeMock = new NodeMock(hostEcm);

        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        await alfrescoJsApi.login('admin', 'admin');

        nodesApi = new NodesApi(alfrescoJsApi);
    });

    afterEach(() => {
        resetGlobalMockAgent();
    });

    describe('Get Children Node', () => {
        it('information for the node with identifier nodeId should return 200 if is all ok', async () => {
            nodeMock.get200ResponseChildren();

            const data = await nodesApi.listNodeChildren('b4cff62a-664d-4d45-9302-98723eac1319');
            assert.equal(data.list.pagination.count, 5);
            assert.equal(data.list.entries[0].entry.name, 'dataLists');
        });

        it('information for the node with identifier nodeId should return 404 if the id is does not exist', async () => {
            nodeMock.get404ChildrenNotExist();

            try {
                await nodesApi.listNodeChildren('b4cff62a-664d-4d45-9302-98723eac1319');
            } catch (error: any) {
                assert.equal(error.status, 404);
            }
        });

        it('dynamic augmenting object parameters', async () => {
            nodeMock.get200ResponseChildrenFutureNewPossibleValue();

            const data: any = await nodesApi.listNodeChildren('b4cff62a-664d-4d45-9302-98723eac1319');
            assert.equal(data.list.entries[0].entry.impossibleProperties, 'impossibleRightValue');
        });

        it('should return dates as timezone-aware', async () => {
            nodeMock.get200ResponseChildrenNonUTCTimes();

            const equalTime = (actual: Date, expected: Date) => actual.getTime() === expected.getTime();

            const data = await nodesApi.listNodeChildren('b4cff62a-664d-4d45-9302-98723eac1320');
            assert.equal(data.list.entries.length, 1);
            const isEqual = equalTime(data.list.entries[0].entry.createdAt, new Date(Date.UTC(2011, 2, 15, 17, 4, 54, 290)));
            assert.equal(isEqual, true);
        });
    });

    describe('Delete', () => {
        it('delete the node with identifier nodeId', async () => {
            nodeMock.get204SuccessfullyDeleted();

            const result = await nodesApi.deleteNode('80a94ac8-3ece-47ad-864e-5d939424c47c');
            assert.ok(result !== undefined, 'deleteNode should complete successfully');
        });

        it('delete the node with identifier nodeId should return 404 if the id is does not exist', async () => {
            nodeMock.get404DeleteNotFound();

            try {
                await nodesApi.deleteNode('80a94ac8-test-47ad-864e-5d939424c47c');
            } catch (error: any) {
                assert.equal(error.status, 404);
            }
        });

        it('delete the node with identifier nodeId should return 403 if current user does not have permission to delete', async () => {
            nodeMock.get403DeletePermissionDenied();

            try {
                await nodesApi.deleteNode('80a94ac8-3ece-47ad-864e-5d939424c47c');
            } catch {
                // Expected error
            }
        });
    });

    describe('Delete nodes', () => {
        it('should call deleteNode for every id in the given array', async () => {
            let calls = 0;

            nodesApi.deleteNode = () => {
                calls++;
                return Promise.resolve();
            };

            await nodesApi.deleteNodes(['80a94ac8-3ece-47ad-864e-5d939424c47c', '80a94ac8-3ece-47ad-864e-5d939424c47d']);
            assert.equal(calls, 2);
        });

        it('should return throw an error if one of the promises fails', async () => {
            nodeMock.get204SuccessfullyDeleted();
            nodeMock.get404DeleteNotFound();

            try {
                await nodesApi.deleteNodes(['80a94ac8-3ece-47ad-864e-5d939424c47c', '80a94ac8-test-47ad-864e-5d939424c47c']);
            } catch (error: any) {
                assert.equal(error.status, 404);
            }
        });
    });

    describe('FolderInformation', () => {
        it('should return jobId on initiateFolderSizeCalculation API call if everything is ok', async () => {
            nodeMock.post200ResponseInitiateFolderSizeCalculation();

            const response = await nodesApi.initiateFolderSizeCalculation('b4cff62a-664d-4d45-9302-98723eac1319');
            assert.equal(response.entry.jobId, '5ade426e-8a04-4d50-9e42-6e8a041d50f3');
        });

        it('should return 404 error on initiateFolderSizeCalculation API call if nodeId is not found', async () => {
            nodeMock.post404NodeIdNotFound();

            try {
                await nodesApi.initiateFolderSizeCalculation('b4cff62a-664d-4d45-9302-98723eac1319');
            } catch (err: any) {
                const { error } = JSON.parse(err.message);
                assert.equal(error.statusCode, 404);
                assert.equal(error.errorKey, 'framework.exception.EntityNotFound');
                assert.equal(error.briefSummary, '11207522 The entity with id: b4cff62a-664d-4d45-9302-98723eac1319 was not found');
            }
        });

        it('should return size details on getFolderSizeInfo API call if everything is ok', async () => {
            nodeMock.get200ResponseGetFolderSizeInfo();

            const response = await nodesApi.getFolderSizeInfo('b4cff62a-664d-4d45-9302-98723eac1319', '5ade426e-8a04-4d50-9e42-6e8a041d50f3');
            assert.equal(response.entry.id, '32e522f1-1f28-4ea3-a522-f11f284ea397');
            assert.equal(response.entry.jobId, '5ade426e-8a04-4d50-9e42-6e8a041d50f3');
            assert.equal(response.entry.sizeInBytes, 2689);
            assert.equal(response.entry.numberOfFiles, 100);
            assert.equal(response.entry.calculatedAt, '2024-12-20T12:02:23.989+0000');
            assert.equal(response.entry.status, 'COMPLETED');
        });

        it('should return 404 error on getFolderSizeInfo API call if jobId is not found', async () => {
            nodeMock.get404JobIdNotFound();

            try {
                await nodesApi.getFolderSizeInfo('b4cff62a-664d-4d45-9302-98723eac1319', '5ade426e-8a04-4d50-9e42-6e8a041d50f3');
            } catch (err: any) {
                const { error } = JSON.parse(err.message);
                assert.equal(error.statusCode, 404);
                assert.equal(error.errorKey, 'jobId does not exist');
                assert.equal(error.briefSummary, '11207212 jobId does not exist');
            }
        });
    });
});
