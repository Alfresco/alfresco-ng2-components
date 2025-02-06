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
import { BpmAuthMock, ReportsMock } from '../mockObjects';
import { ReportApi, AlfrescoApi } from '../../src';

describe('Activiti Report Api', () => {
    let authResponseBpmMock: BpmAuthMock;
    let reportsMock: ReportsMock;
    let alfrescoJsApi: AlfrescoApi;
    let reportApi: ReportApi;

    beforeEach(async () => {
        const BPM_HOST = 'https://127.0.0.1:9999';

        authResponseBpmMock = new BpmAuthMock(BPM_HOST);
        reportsMock = new ReportsMock(BPM_HOST);

        authResponseBpmMock.get200Response();

        alfrescoJsApi = new AlfrescoApi({
            hostBpm: BPM_HOST,
            provider: 'BPM'
        });

        reportApi = new ReportApi(alfrescoJsApi);

        await alfrescoJsApi.login('admin', 'admin');
    });

    it('should create the default reports', async () => {
        reportsMock.get200ResponseCreateDefaultReport();
        await reportApi.createDefaultReports();
    });

    it('should return the tasks referring to the process id', async () => {
        const reportId = '11015';
        const processDefinitionId = 'Process_sid-0FF10DA3-E2BD-4E6A-9013-6D66FC8A4716:1:30004';

        reportsMock.get200ResponseTasksByProcessDefinitionId(reportId, processDefinitionId);

        const data = await reportApi.getTasksByProcessDefinitionId(reportId, processDefinitionId);
        assert.equal(data.length, 3);
        assert.equal(data[0], 'Fake Task 1');
        assert.equal(data[1], 'Fake Task 2');
        assert.equal(data[2], 'Fake Task 3');
    });

    it('should return the chart reports', async () => {
        const reportId = '11015';
        const paramsQuery = { status: 'All' };

        reportsMock.get200ResponseReportsByParams(reportId, paramsQuery);

        const data = await reportApi.getReportsByParams(reportId, paramsQuery);
        assert.equal(data.elements.length, 3);
        assert.equal(data.elements[0].type, 'table');

        assert.equal(data.elements[1].type, 'pieChart');
        assert.equal(data.elements[1].titleKey, 'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.PROC-INST-CHART-TITLE');

        assert.equal(data.elements[2].type, 'table');
        assert.equal(data.elements[2].titleKey, 'REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE');
    });

    it('should return the process definitions when the appId is not provided', async () => {
        reportsMock.get200ResponseProcessDefinitions();

        const res = await reportApi.getProcessDefinitions();

        assert.equal(res.length, 4);
        assert.equal(res[0].id, 'Process_sid-0FF10DA3-E2BD-4E6A-9013-6D66FC8A4716:1:30004');
        assert.equal(res[0].name, 'Fake Process Name 1');

        assert.equal(res[1].id, 'SecondProcess:1:15027');
        assert.equal(res[1].name, 'Fake Process Name 2');

        assert.equal(res[2].id, 'Simpleprocess:15:10004');
        assert.equal(res[2].name, 'Fake Process Name 3');

        assert.equal(res[3].id, 'fruitorderprocess:5:42530');
        assert.equal(res[3].name, 'Fake Process Name 4');
    });

    it('should return the report list', async () => {
        reportsMock.get200ResponseReportList();

        const res = await reportApi.getReportList();

        assert.equal(res.length, 5);

        assert.equal(res[0].id, 11011);
        assert.equal(res[0].name, 'Process definition heat map');

        assert.equal(res[1].id, 11012);
        assert.equal(res[1].name, 'Process definition overview');

        assert.equal(res[2].id, 11013);
        assert.equal(res[2].name, 'Process instances overview');

        assert.equal(res[3].id, 11014);
        assert.equal(res[3].name, 'Task overview');

        assert.equal(res[4].id, 11015);
        assert.equal(res[4].name, 'Task service level agreement');
    });

    it('should return the report parameters', async () => {
        const reportId = '11013'; // String | reportId
        reportsMock.get200ResponseReportParams(reportId);

        const res = await reportApi.getReportParams(reportId);
        const paramsDefinition = JSON.parse(res.definition);

        assert.equal(res.id, 11013);
        assert.equal(res.name, 'Process instances overview');
        assert.equal(paramsDefinition.parameters.length, 4);

        assert.equal(paramsDefinition.parameters[0].id, 'processDefinitionId');
        assert.equal(paramsDefinition.parameters[0].nameKey, 'REPORTING.DEFAULT-REPORTS.PROCESS-INSTANCES-OVERVIEW.PROCESS-DEFINITION');
        assert.equal(paramsDefinition.parameters[0].type, 'processDefinition');

        assert.equal(paramsDefinition.parameters[1].id, 'dateRange');
        assert.equal(paramsDefinition.parameters[1].nameKey, 'REPORTING.DEFAULT-REPORTS.PROCESS-INSTANCES-OVERVIEW.DATE-RANGE');
        assert.equal(paramsDefinition.parameters[1].type, 'dateRange');

        assert.equal(paramsDefinition.parameters[2].id, 'slowProcessInstanceInteger');
        assert.equal(paramsDefinition.parameters[2].nameKey, 'REPORTING.DEFAULT-REPORTS.PROCESS-INSTANCES-OVERVIEW.SLOW-PROC-INST-NUMBER');
        assert.equal(paramsDefinition.parameters[2].type, 'integer');

        assert.equal(paramsDefinition.parameters[3].id, 'status');
        assert.equal(paramsDefinition.parameters[3].nameKey, 'REPORTING.PROCESS-STATUS');
        assert.equal(paramsDefinition.parameters[3].type, 'status');
    });

    it('should update the report', async () => {
        const reportId = '11015';
        const name = 'New Fake Name';
        reportsMock.get200ResponseUpdateReport(reportId);

        await reportApi.updateReport(reportId, name);
    });

    it('should export the report', async () => {
        const reportId = '11015'; // String | reportId
        const queryParams = {
            processDefinitionId: 'TEST:99:999',
            dateRange: {
                startDate: '2017-01-01T00:00:00.000Z',
                endDate: '2017-01-24T23:59:59.999Z',
                rangeId: 'currentYear'
            },
            slowProcessInstanceInteger: 10,
            status: 'All',
            reportName: 'FAKE_REPORT_NAME'
        };
        reportsMock.get200ResponseExportReport(reportId);

        const response = await reportApi.exportToCsv(reportId, queryParams);
        assert.notEqual(response, null);
        assert.notEqual(response, undefined);
    });

    it('should save the report', async () => {
        const reportId = '11015'; // String | reportId
        const queryParams = {
            processDefinitionId: 'TEST:99:999',
            dateRange: {
                startDate: '2017-01-01T00:00:00.000Z',
                endDate: '2017-01-24T23:59:59.999Z',
                rangeId: 'currentYear'
            },
            slowProcessInstanceInteger: 10,
            status: 'All',
            reportName: 'FAKE_REPORT_NAME'
        };
        reportsMock.get200ResponseSaveReport(reportId);

        await reportApi.saveReport(reportId, queryParams);
    });

    it('should delete a report', async () => {
        const reportId = '11015';
        reportsMock.get200ResponseDeleteReport(reportId);

        await reportApi.deleteReport(reportId);
    });
});
