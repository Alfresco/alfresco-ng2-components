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

const fakeVariable1 = {
    name: 'variable1',
    value: 'Value 123',
    scope: 'global'
};

const fakeVariable2 = {
    name: 'variable2',
    value: 'Value 456',
    scope: 'local'
};

const fakeVariablesList = [fakeVariable1, fakeVariable2];

export class ProcessInstanceVariablesMock extends BaseMock {
    addListProcessInstanceVariables200Response(processInstanceId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/activiti-app/api/enterprise/process-instances/' + processInstanceId + '/variables')
            .reply(200, fakeVariablesList);
    }

    addListProcessInstanceVariables500Response(processInstanceId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/activiti-app/api/enterprise/process-instances/' + processInstanceId + '/variables')
            .reply(500, {
                messageKey: 'UNKNOWN',
                message: 'Unknown error'
            });
    }

    addPutProcessInstanceVariables200Response(processInstanceId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .put('/activiti-app/api/enterprise/process-instances/' + processInstanceId + '/variables')
            .reply(200, fakeVariablesList);
    }

    addPutProcessInstanceVariables500Response(processInstanceId: string): void {
        nock(this.host, { encodedQueryParams: true })
            .put('/activiti-app/api/enterprise/process-instances/' + processInstanceId + '/variables')
            .reply(500, {
                messageKey: 'UNKNOWN',
                message: 'Unknown error'
            });
    }

    addGetProcessInstanceVariable200Response(processInstanceId: string, variableName: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/activiti-app/api/enterprise/process-instances/' + processInstanceId + '/variables/' + variableName)
            .reply(200, fakeVariable1);
    }

    addGetProcessInstanceVariable500Response(processInstanceId: string, variableName: string): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/activiti-app/api/enterprise/process-instances/' + processInstanceId + '/variables/' + variableName)
            .reply(500, {
                messageKey: 'UNKNOWN',
                message: 'Unknown error'
            });
    }

    addUpdateProcessInstanceVariable200Response(processInstanceId: string, variableName: string): void {
        nock(this.host, { encodedQueryParams: true })
            .put('/activiti-app/api/enterprise/process-instances/' + processInstanceId + '/variables/' + variableName)
            .reply(200, fakeVariable1);
    }

    addUpdateProcessInstanceVariable500Response(processInstanceId: string, variableName: string): void {
        nock(this.host, { encodedQueryParams: true })
            .put('/activiti-app/api/enterprise/process-instances/' + processInstanceId + '/variables/' + variableName)
            .reply(500, {
                messageKey: 'UNKNOWN',
                message: 'Unknown error'
            });
    }

    addDeleteProcessInstanceVariable200Response(processInstanceId: string, variableName: string): void {
        nock(this.host, { encodedQueryParams: true })
            .delete('/activiti-app/api/enterprise/process-instances/' + processInstanceId + '/variables/' + variableName)
            .reply(200);
    }

    addDeleteProcessInstanceVariable500Response(processInstanceId: string, variableName: string): void {
        nock(this.host, { encodedQueryParams: true })
            .delete('/activiti-app/api/enterprise/process-instances/' + processInstanceId + '/variables/' + variableName)
            .reply(500, {
                messageKey: 'UNKNOWN',
                message: 'Unknown error'
            });
    }
}
