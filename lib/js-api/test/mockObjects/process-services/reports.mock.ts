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

import { BaseMock } from '../base.mock';

const fakeReportList = [
    { id: 11011, name: 'Process definition heat map' },
    { id: 11012, name: 'Process definition overview' },
    { id: 11013, name: 'Process instances overview' },
    { id: 11014, name: 'Task overview' },
    { id: 11015, name: 'Task service level agreement' }
];

const fakeReportParams = {
    id: 11013,
    name: 'Process instances overview',
    created: '2016-12-07T13:26:40.095+0000',
    definition:
        '{"parameters":[{"id":"processDefinitionId","name":null,"nameKey":"REPORTING.DEFAULT-REPORTS.PROCESS-INSTANCES-OVERVIEW.PROCESS-DEFINITION","type":"processDefinition","value":null,"dependsOn":null},' +
        '{"id":"dateRange","name":null,"nameKey":"REPORTING.DEFAULT-REPORTS.PROCESS-INSTANCES-OVERVIEW.DATE-RANGE","type":"dateRange","value":null,"dependsOn":null},' +
        '{"id":"slowProcessInstanceInteger","name":null,"nameKey":"REPORTING.DEFAULT-REPORTS.PROCESS-INSTANCES-OVERVIEW.SLOW-PROC-INST-NUMBER","type":"integer","value":10,"dependsOn":null},' +
        '{"id":"status","name":null,"nameKey":"REPORTING.PROCESS-STATUS","type":"status","value":null,"dependsOn":null}' +
        ']}'
};

const fakeChartReports = {
    elements: [
        {
            id: 'id10889073739455',
            type: 'table',
            rows: [
                ['__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-TOTAL-PROCESS-DEFINITIONS', '10'],
                ['__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-TOTAL-PROCESS-INSTANCES', '63'],
                ['__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-ACTIVE-PROCESS-INSTANCES', '5'],
                ['__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-COMPLETED-PROCESS-INSTANCES', '52']
            ],
            collapseable: false,
            collapsed: false,
            showRowIndex: false
        },
        {
            id: 'id10889073934509',
            type: 'pieChart',
            title: 'Total process instances overview',
            titleKey: 'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.PROC-INST-CHART-TITLE',
            values: [
                { key: 'Activiti', y: 13, keyAndValue: ['Activiti', '13'] },
                {
                    key: 'Second Process',
                    y: 5,
                    keyAndValue: ['Second Process', '5']
                },
                { key: 'Process Custom Name', y: 3, keyAndValue: ['Process Custom Name', '3'] },
                {
                    key: 'Simple process',
                    y: 29,
                    keyAndValue: ['Simple process', '29']
                },
                { key: 'Third Process', y: 7, keyAndValue: ['Third Process', '7'] }
            ]
        },
        {
            id: 'id10889074082883',
            type: 'table',
            title: 'Process definition details',
            titleKey: 'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE',
            columnNames: ['Process definition', 'Total', 'Active', 'Completed'],
            columnNameKeys: [
                'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE-PROCESS',
                'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE-TOTAL',
                'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE-ACTIVE',
                'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE-COMPLETED'
            ],
            columnsCentered: [false, false, false, false],
            rows: [
                ['Activiti', '13', '3', '10'],
                ['Process Custom Name', '3', '0', '3'],
                ['Second Process', '5', '1', '4'],
                ['Simple process', '29', '1', '28'],
                ['Third Process', '7', '0', '7']
            ],
            collapseable: false,
            collapsed: false,
            showRowIndex: true
        }
    ]
};

const fakeProcessDefinitionsNoApp: any[] = [
    {
        id: 'Process_sid-0FF10DA3-E2BD-4E6A-9013-6D66FC8A4716:1:30004',
        name: 'Fake Process Name 1',
        description: null,
        key: 'Process_sid-0FF10DA3-E2BD-4E6A-9013-6D66FC8A4716',
        category: 'https://www.activiti.org/processdef',
        version: 1,
        deploymentId: '30001',
        tenantId: 'tenant_1',
        metaDataValues: [],
        hasStartForm: false
    },
    {
        id: 'SecondProcess:1:15027',
        name: 'Fake Process Name 2',
        description: 'fdsdf',
        key: 'SecondProcess',
        category: 'https://www.activiti.org/processdef',
        version: 1,
        deploymentId: '15024',
        tenantId: 'tenant_1',
        metaDataValues: [],
        hasStartForm: false
    },
    {
        id: 'Simpleprocess:15:10004',
        name: 'Fake Process Name 3',
        description: null,
        key: 'Simpleprocess',
        category: 'https://www.activiti.org/processdef',
        version: 15,
        deploymentId: '10001',
        tenantId: 'tenant_1',
        metaDataValues: [],
        hasStartForm: false
    },
    {
        id: 'fruitorderprocess:5:42530',
        name: 'Fake Process Name 4',
        description: null,
        key: 'fruitorderprocess',
        category: 'https://www.activiti.org/processdef',
        version: 5,
        deploymentId: '42527',
        tenantId: 'tenant_1',
        metaDataValues: [],
        hasStartForm: false
    }
];

export class ReportsMock extends BaseMock {
    get200ResponseCreateDefaultReport(): void {
        this.createNockWithCors().post('/activiti-app/app/rest/reporting/default-reports').reply(200);
    }

    get200ResponseTasksByProcessDefinitionId(reportId: string, processDefinitionId: string): void {
        this.createNockWithCors()
            .get('/activiti-app/app/rest/reporting/report-params/' + reportId + '/tasks')
            .query({ processDefinitionId })
            .reply(200, ['Fake Task 1', 'Fake Task 2', 'Fake Task 3']);
    }

    get200ResponseReportList(): void {
        this.createNockWithCors().get('/activiti-app/app/rest/reporting/reports').reply(200, fakeReportList);
    }

    get200ResponseReportParams(reportId: string): void {
        this.createNockWithCors()
            .get('/activiti-app/app/rest/reporting/report-params/' + reportId)
            .reply(200, fakeReportParams);
    }

    get200ResponseReportsByParams(reportId: string, paramsQuery: { status: string }): void {
        this.createNockWithCors()
            .post('/activiti-app/app/rest/reporting/report-params/' + reportId, paramsQuery)
            .reply(200, fakeChartReports);
    }

    get200ResponseProcessDefinitions(): void {
        this.createNockWithCors().get('/activiti-app/app/rest/reporting/process-definitions').reply(200, fakeProcessDefinitionsNoApp);
    }

    get200ResponseUpdateReport(reportId: string): void {
        this.createNockWithCors()
            .put('/activiti-app/app/rest/reporting/reports/' + reportId)
            .reply(200);
    }

    get200ResponseExportReport(reportId: string): void {
        this.createNockWithCors()
            .post('/activiti-app/app/rest/reporting/reports/' + reportId + '/export-to-csv')
            .reply(200, 'CSV');
    }

    get200ResponseSaveReport(reportId: string): void {
        this.createNockWithCors()
            .post('/activiti-app/app/rest/reporting/reports/' + reportId)
            .reply(200);
    }

    get200ResponseDeleteReport(reportId: string): void {
        this.createNockWithCors()
            .delete('/activiti-app/app/rest/reporting/reports/' + reportId)
            .reply(200);
    }
}
