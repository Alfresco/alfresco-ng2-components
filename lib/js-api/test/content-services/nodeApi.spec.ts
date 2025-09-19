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

import assert from 'assert';
import { AlfrescoApi, NodesApi } from '../../src';
import { EcmAuthMock, NodeMock } from '../mockObjects';

describe('Node', () => {
    let authResponseMock: EcmAuthMock;
    let nodeMock: NodeMock;
    let nodesApi: NodesApi;

    beforeEach((done) => {
        const hostEcm = 'https://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        nodeMock = new NodeMock(hostEcm);

        authResponseMock.get201Response();

        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        alfrescoJsApi.login('admin', 'admin').then(() => {
            done();
        });

        nodesApi = new NodesApi(alfrescoJsApi);
    });

    describe('Get Children Node', () => {
        it('information for the node with identifier nodeId should return 200 if is all ok', (done) => {
            nodeMock.get200ResponseChildren();

            nodesApi.listNodeChildren('b4cff62a-664d-4d45-9302-98723eac1319').then((data) => {
                assert.equal(data.list.pagination.count, 5);
                assert.equal(data.list.entries[0].entry.name, 'dataLists');
                done();
            });
        });

        it('information for the node with identifier nodeId should return 404 if the id is does not exist', (done) => {
            nodeMock.get404ChildrenNotExist();

            nodesApi.listNodeChildren('b4cff62a-664d-4d45-9302-98723eac1319').then(
                () => {},
                (error) => {
                    assert.equal(error.status, 404);
                    done();
                }
            );
        });

        it('dynamic augmenting object parameters', (done) => {
            nodeMock.get200ResponseChildrenFutureNewPossibleValue();

            nodesApi.listNodeChildren('b4cff62a-664d-4d45-9302-98723eac1319').then((data: any) => {
                assert.equal(data.list.entries[0].entry.impossibleProperties, 'impossibleRightValue');
                done();
            });
        });

        it('should return dates as timezone-aware', (done) => {
            nodeMock.get200ResponseChildrenNonUTCTimes();

            const equalTime = (actual: Date, expected: Date) => actual.getTime() === expected.getTime();

            nodesApi.listNodeChildren('b4cff62a-664d-4d45-9302-98723eac1320').then((data) => {
                assert.equal(data.list.entries.length, 1);
                const isEqual = equalTime(data.list.entries[0].entry.createdAt, new Date(Date.UTC(2011, 2, 15, 17, 4, 54, 290)));
                assert.equal(isEqual, true);
                done();
            });
        });
    });

    describe('Delete', () => {
        it('delete the node with identifier nodeId', (done) => {
            nodeMock.get204SuccessfullyDeleted();

            nodesApi.deleteNode('80a94ac8-3ece-47ad-864e-5d939424c47c').then(() => {
                done();
            });
        });

        it('delete the node with identifier nodeId should return 404 if the id is does not exist', (done) => {
            nodeMock.get404DeleteNotFound();

            nodesApi.deleteNode('80a94ac8-test-47ad-864e-5d939424c47c').then(
                () => {},
                (error) => {
                    assert.equal(error.status, 404);
                    done();
                }
            );
        });

        it('delete the node with identifier nodeId should return 403 if current user does not have permission to delete', (done) => {
            nodeMock.get403DeletePermissionDenied();

            nodesApi.deleteNode('80a94ac8-3ece-47ad-864e-5d939424c47c').then(
                () => {},
                () => {
                    done();
                }
            );
        });
    });

    describe('Delete nodes', () => {
        it('should call deleteNode for every id in the given array', (done) => {
            let calls = 0;

            nodesApi.deleteNode = () => {
                calls++;
                return Promise.resolve();
            };

            nodesApi.deleteNodes(['80a94ac8-3ece-47ad-864e-5d939424c47c', '80a94ac8-3ece-47ad-864e-5d939424c47d']).then(() => {
                assert.equal(calls, 2);
                done();
            });
        });

        it('should return throw an error if one of the promises fails', (done) => {
            nodeMock.get204SuccessfullyDeleted();
            nodeMock.get404DeleteNotFound();

            nodesApi.deleteNodes(['80a94ac8-3ece-47ad-864e-5d939424c47c', '80a94ac8-test-47ad-864e-5d939424c47c']).then(
                () => {},
                (error) => {
                    assert.equal(error.status, 404);
                    done();
                }
            );
        });
    });

    describe('FolderInformation', () => {
        it('should return jobId on initiateFolderSizeCalculation API call if everything is ok', (done) => {
            nodeMock.post200ResponseInitiateFolderSizeCalculation();

            nodesApi.initiateFolderSizeCalculation('b4cff62a-664d-4d45-9302-98723eac1319').then((response) => {
                assert.equal(response.entry.jobId, '5ade426e-8a04-4d50-9e42-6e8a041d50f3');
                done();
            });
        });

        it('should return 404 error on initiateFolderSizeCalculation API call if nodeId is not found', (done) => {
            nodeMock.post404NodeIdNotFound();

            nodesApi.initiateFolderSizeCalculation('b4cff62a-664d-4d45-9302-98723eac1319').then(
                () => {},
                (err) => {
                    const { error } = JSON.parse(err.response.text);
                    assert.equal(error.statusCode, 404);
                    assert.equal(error.errorKey, 'framework.exception.EntityNotFound');
                    assert.equal(error.briefSummary, '11207522 The entity with id: b4cff62a-664d-4d45-9302-98723eac1319 was not found');
                    done();
                }
            );
        });

        it('should return size details on getFolderSizeInfo API call if everything is ok', (done) => {
            nodeMock.get200ResponseGetFolderSizeInfo();

            nodesApi.getFolderSizeInfo('b4cff62a-664d-4d45-9302-98723eac1319', '5ade426e-8a04-4d50-9e42-6e8a041d50f3').then((response) => {
                assert.equal(response.entry.id, '32e522f1-1f28-4ea3-a522-f11f284ea397');
                assert.equal(response.entry.jobId, '5ade426e-8a04-4d50-9e42-6e8a041d50f3');
                assert.equal(response.entry.sizeInBytes, 2689);
                assert.equal(response.entry.numberOfFiles, 100);
                assert.equal(response.entry.calculatedAt, '2024-12-20T12:02:23.989+0000');
                assert.equal(response.entry.status, 'COMPLETED');
                done();
            });
        });

        it('should return 404 error on getFolderSizeInfo API call if jobId is not found', (done) => {
            nodeMock.get404JobIdNotFound();

            nodesApi.getFolderSizeInfo('b4cff62a-664d-4d45-9302-98723eac1319', '5ade426e-8a04-4d50-9e42-6e8a041d50f3').then(
                () => {},
                (err) => {
                    const { error } = JSON.parse(err.response.text);
                    assert.equal(error.statusCode, 404);
                    assert.equal(error.errorKey, 'jobId does not exist');
                    assert.equal(error.briefSummary, '11207212 jobId does not exist');
                    done();
                }
            );
        });
    });
});
