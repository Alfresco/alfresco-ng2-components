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

export class ProcessMock extends BaseMock {
    get200Response(): void {
        nock(this.host, { encodedQueryParams: true })
            .post('/activiti-app/api/enterprise/process-instances/query')
            .reply(200, {
                size: 2,
                total: 2,
                start: 0,
                data: [
                    {
                        id: '39',
                        name: 'Process Test Api - July 26th 2016',
                        businessKey: null,
                        processDefinitionId: 'ProcessTestApi:1:32',
                        tenantId: 'tenant_1',
                        started: '2016-07-26T15:31:00.414+0000',
                        ended: null,
                        startedBy: {
                            id: 1,
                            firstName: null,
                            lastName: 'Administrator',
                            email: 'admin@app.activiti.com'
                        },
                        processDefinitionName: 'Process Test Api',
                        processDefinitionDescription: null,
                        processDefinitionKey: 'ProcessTestApi',
                        processDefinitionCategory: 'https://www.activiti.org/processdef',
                        processDefinitionVersion: 1,
                        processDefinitionDeploymentId: '29',
                        graphicalNotationDefined: true,
                        startFormDefined: false,
                        suspended: false,
                        variables: []
                    },
                    {
                        id: '33',
                        name: 'Process Test Api - July 26th 2016',
                        businessKey: null,
                        processDefinitionId: 'ProcessTestApi:1:32',
                        tenantId: 'tenant_1',
                        started: '2016-07-26T15:30:58.367+0000',
                        ended: null,
                        startedBy: {
                            id: 1,
                            firstName: null,
                            lastName: 'Administrator',
                            email: 'admin@app.activiti.com'
                        },
                        processDefinitionName: 'Process Test Api',
                        processDefinitionDescription: null,
                        processDefinitionKey: 'ProcessTestApi',
                        processDefinitionCategory: 'https://www.activiti.org/processdef',
                        processDefinitionVersion: 1,
                        processDefinitionDeploymentId: '29',
                        graphicalNotationDefined: true,
                        startFormDefined: false,
                        suspended: false,
                        variables: []
                    }
                ]
            });
    }

    get200getProcessDefinitionStartForm(): void {
        nock(this.host, { encodedQueryParams: true })
            .get('/activiti-app/api/enterprise/process-definitions/testProcess%3A1%3A7504/start-form')
            .reply(200, {
                id: 2002,
                processDefinitionId: 'testProcess:1:7504',
                processDefinitionName: 'test process',
                processDefinitionKey: 'testProcess',
                tabs: [],
                fields: [
                    {
                        fieldType: 'DynamicTableRepresentation',
                        id: 'label',
                        name: 'Label',
                        type: 'dynamic-table',
                        value: null,
                        required: false,
                        readOnly: false,
                        overrideId: false,
                        colspan: 1,
                        placeholder: null,
                        minLength: 0,
                        maxLength: 0,
                        minValue: null,
                        maxValue: null,
                        regexPattern: null,
                        optionType: null,
                        hasEmptyValue: null,
                        options: null,
                        restUrl: null,
                        restResponsePath: null,
                        restIdProperty: null,
                        restLabelProperty: null,
                        tab: null,
                        className: null,
                        params: { existingColspan: 1, maxColspan: 1 },
                        layout: { row: -1, column: -1, colspan: 2 },
                        sizeX: 2,
                        sizeY: 2,
                        row: -1,
                        col: -1,
                        visibilityCondition: null,
                        columnDefinitions: [
                            {
                                id: 'user',
                                name: 'User',
                                type: 'Dropdown',
                                value: null,
                                optionType: 'rest',
                                options: [{ id: null, name: 'Option 1' }],
                                restResponsePath: null,
                                restUrl: 'https://jsonplaceholder.typicode.com/users',
                                restIdProperty: 'id',
                                restLabelProperty: 'name',
                                amountCurrency: null,
                                amountEnableFractions: false,
                                required: true,
                                editable: true,
                                sortable: true,
                                visible: true,
                                endpoint: null,
                                requestHeaders: null
                            }
                        ]
                    }
                ],
                outcomes: [],
                javascriptEvents: [],
                className: '',
                style: '',
                customFieldTemplates: {},
                metadata: {},
                variables: [],
                gridsterForm: false
            });
    }
}
