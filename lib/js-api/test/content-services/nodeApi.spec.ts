/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
                () => {
                    /* do nothing */
                },
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
                () => {
                    /* do nothing */
                },
                (error) => {
                    assert.equal(error.status, 404);
                    done();
                }
            );
        });

        it('delete the node with identifier nodeId should return 403 if current user does not have permission to delete', (done) => {
            nodeMock.get403DeletePermissionDenied();

            nodesApi.deleteNode('80a94ac8-3ece-47ad-864e-5d939424c47c').then(
                () => {
                    /* do nothing */
                },
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
                () => {
                    /* do nothing */
                },
                (error) => {
                    assert.equal(error.status, 404);
                    done();
                }
            );
        });
    });
});
