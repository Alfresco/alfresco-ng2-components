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

import { expect } from 'chai';
import { BpmAuthMock, ProcessInstanceVariablesMock } from '../mockObjects';
import { ProcessInstanceVariablesApi, AlfrescoApi } from '../../src';

describe('Activiti Process Instance Variables Api', () => {
    let authResponseBpmMock: BpmAuthMock;
    let variablesMock: ProcessInstanceVariablesMock;
    let alfrescoJsApi: AlfrescoApi;
    let processInstanceVariablesApi: ProcessInstanceVariablesApi;

    const NOOP = () => {
        /* empty */
    };

    beforeEach(async () => {
        const BPM_HOST = 'http://127.0.0.1:9999';

        authResponseBpmMock = new BpmAuthMock(BPM_HOST);
        variablesMock = new ProcessInstanceVariablesMock(BPM_HOST);

        authResponseBpmMock.get200Response();

        alfrescoJsApi = new AlfrescoApi({
            hostBpm: BPM_HOST,
            provider: 'BPM'
        });

        processInstanceVariablesApi = new ProcessInstanceVariablesApi(alfrescoJsApi);

        await alfrescoJsApi.login('admin', 'admin');
    });

    describe('get variables', () => {
        it('should return all variables for a process instance', (done) => {
            const processInstanceId = '111';
            variablesMock.addListProcessInstanceVariables200Response(processInstanceId);

            processInstanceVariablesApi.getProcessInstanceVariables(processInstanceId).then((data) => {
                expect(data.length).equal(2);
                done();
            });
        });

        it('should emit an error when API returns an error response', (done) => {
            const processInstanceId = '111';
            variablesMock.addListProcessInstanceVariables500Response(processInstanceId);

            processInstanceVariablesApi.getProcessInstanceVariables(processInstanceId).then(NOOP, (error) => {
                expect(error.status).equal(500);
                expect(error.message).equal('{"messageKey":"UNKNOWN","message":"Unknown error"}');
                done();
            });
        });
    });

    describe('create or update variables', () => {
        it('should return all variables for a process instance', (done) => {
            const processInstanceId = '111';
            variablesMock.addPutProcessInstanceVariables200Response(processInstanceId);

            processInstanceVariablesApi.createOrUpdateProcessInstanceVariables(processInstanceId, []).then((data) => {
                expect(data.length).equal(2);
                done();
            });
        });

        it('should emit an error when API returns an error response', (done) => {
            const processInstanceId = '111';
            variablesMock.addPutProcessInstanceVariables500Response(processInstanceId);

            processInstanceVariablesApi.createOrUpdateProcessInstanceVariables(processInstanceId, []).then(NOOP, (error) => {
                expect(error.status).equal(500);
                expect(error.message).equal('{"messageKey":"UNKNOWN","message":"Unknown error"}');
                done();
            });
        });
    });

    describe('get variable', () => {
        it('should call API to get variable', (done) => {
            const processInstanceId = '111';
            const variableName = 'var1';
            variablesMock.addGetProcessInstanceVariable200Response(processInstanceId, variableName);

            processInstanceVariablesApi.getProcessInstanceVariable(processInstanceId, variableName).then(
                (data) => {
                    expect(data.name).equal('variable1');
                    expect(data.value).equal('Value 123');
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should emit an error when API returns an error response', (done) => {
            const processInstanceId = '111';
            const variableName = 'var1';
            variablesMock.addGetProcessInstanceVariable500Response(processInstanceId, variableName);

            processInstanceVariablesApi.getProcessInstanceVariable(processInstanceId, variableName).then(NOOP, (error) => {
                expect(error.status).equal(500);
                expect(error.message).equal('{"messageKey":"UNKNOWN","message":"Unknown error"}');
                done();
            });
        });
    });

    describe('update variable', () => {
        it('should call API to update variable', (done) => {
            const processInstanceId = '111';
            const variableName = 'var1';
            variablesMock.addUpdateProcessInstanceVariable200Response(processInstanceId, variableName);

            processInstanceVariablesApi.updateProcessInstanceVariable(processInstanceId, variableName, {}).then(() => {
                done();
            });
        });

        it('should emit an error when API returns an error response', (done) => {
            const processInstanceId = '111';
            const variableName = 'var1';
            variablesMock.addUpdateProcessInstanceVariable500Response(processInstanceId, variableName);

            processInstanceVariablesApi.updateProcessInstanceVariable(processInstanceId, variableName, {}).then(NOOP, (error) => {
                expect(error.status).equal(500);
                expect(error.message).equal('{"messageKey":"UNKNOWN","message":"Unknown error"}');
                done();
            });
        });
    });

    describe('delete variable', () => {
        it('should call API to delete variables', (done) => {
            const processInstanceId = '111';
            const variableName = 'var1';
            variablesMock.addDeleteProcessInstanceVariable200Response(processInstanceId, variableName);

            processInstanceVariablesApi.deleteProcessInstanceVariable(processInstanceId, variableName).then(() => {
                done();
            });
        });

        it('should emit an error when API returns an error response', (done) => {
            const processInstanceId = '111';
            const variableName = 'var1';
            variablesMock.addDeleteProcessInstanceVariable500Response(processInstanceId, variableName);

            processInstanceVariablesApi.deleteProcessInstanceVariable(processInstanceId, variableName).then(NOOP, (error) => {
                expect(error.status).equal(500);
                expect(error.message).equal('{"messageKey":"UNKNOWN","message":"Unknown error"}');
                done();
            });
        });
    });
});
