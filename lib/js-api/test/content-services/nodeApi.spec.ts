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

import { AlfrescoApi } from '../../src/alfrescoApi';
import { NodesApi } from '../../src/api/content-rest-api';
import { EcmAuthMock, NodeMock } from '../../test/mockObjects';
import chai, { expect } from 'chai';

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

        alfrescoJsApi.login('admin', 'admin').then(
            () => {
                done();
            },
            (error: any) => {
                console.log('error ' + JSON.stringify(error));
            }
        );

        nodesApi = new NodesApi(alfrescoJsApi);
    });

    describe('Get Children Node', () => {
        it('information for the node with identifier nodeId should return 200 if is all ok', (done) => {
            nodeMock.get200ResponseChildren();

            nodesApi.listNodeChildren('b4cff62a-664d-4d45-9302-98723eac1319').then((data) => {
                expect(data.list.pagination.count).to.be.equal(5);
                expect(data.list.entries[0].entry.name).to.be.equal('dataLists');
                done();
            });
        });

        it('information for the node with identifier nodeId should return 404 if the id is does not exist', (done) => {
            nodeMock.get404ChildrenNotExist();

            nodesApi.listNodeChildren('b4cff62a-664d-4d45-9302-98723eac1319').then(
                () => {},
                (error: any) => {
                    expect(error.status).to.be.equal(404);
                    done();
                }
            );
        });

        it('dynamic augmenting object parameters', (done) => {
            nodeMock.get200ResponseChildrenFutureNewPossibleValue();

            nodesApi.listNodeChildren('b4cff62a-664d-4d45-9302-98723eac1319').then((data: any) => {
                expect(data.list.entries[0].entry.impossibleProperties).to.be.equal('impossibleRightValue');
                done();
            });
        });

        it('should return dates as timezone-aware', (done) => {
            nodeMock.get200ResponseChildrenNonUTCTimes();

            const equalTime = (actual: Date, expected: Date) => actual.getTime() === expected.getTime();

            nodesApi.listNodeChildren('b4cff62a-664d-4d45-9302-98723eac1320').then(
                (data) => {
                    expect(data.list.entries.length).to.be.equal(1);
                    const isEqual = equalTime(data.list.entries[0].entry.createdAt, new Date(Date.UTC(2011, 2, 15, 17, 4, 54, 290)));
                    expect(isEqual).to.equal(true);
                    done();
                },
                (error: any) => {
                    console.log('error' + JSON.stringify(error));
                }
            );
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
                (error: any) => {
                    expect(error.status).to.be.equal(404);
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
            const deleteNodeSpy = chai.spy.on(nodesApi, 'deleteNode', () => Promise.resolve());

            nodesApi.deleteNodes(['80a94ac8-3ece-47ad-864e-5d939424c47c', '80a94ac8-3ece-47ad-864e-5d939424c47d']).then(() => {
                expect(deleteNodeSpy).to.have.been.called.exactly(2);
                done();
            });
        });

        it('should return throw an error if one of the promises fails', (done) => {
            nodeMock.get204SuccessfullyDeleted();
            nodeMock.get404DeleteNotFound();

            nodesApi.deleteNodes(['80a94ac8-3ece-47ad-864e-5d939424c47c', '80a94ac8-test-47ad-864e-5d939424c47c']).then(
                () => {},
                (error: any) => {
                    expect(error.status).to.be.equal(404);
                    done();
                }
            );
        });
    });
});
