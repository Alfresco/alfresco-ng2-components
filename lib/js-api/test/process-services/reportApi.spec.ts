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
import { BpmAuthMock, ReportsMock } from '../mockObjects';
import { ReportApi, AlfrescoApi } from '../../src';

describe('Activiti Report Api', () => {
    let authResponseBpmMock: BpmAuthMock;
    let reportsMock: ReportsMock;
    let alfrescoJsApi: AlfrescoApi;
    let reportApi: ReportApi;

    beforeEach(async () => {
        const BPM_HOST = 'http://127.0.0.1:9999';

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
        expect(data.length).equal(3);
        expect(data[0]).equal('Fake Task 1');
        expect(data[1]).equal('Fake Task 2');
        expect(data[2]).equal('Fake Task 3');
    });

    it('should return the chart reports', async () => {
        const reportId = '11015';
        const paramsQuery = { status: 'All' };

        reportsMock.get200ResponseReportsByParams(reportId, paramsQuery);

        const data = await reportApi.getReportsByParams(reportId, paramsQuery);
        expect(data.elements.length).equal(3);
        expect(data.elements[0].type).equal('table');

        expect(data.elements[1].type).equal('pieChart');
        expect(data.elements[1].titleKey).equal('REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.PROC-INST-CHART-TITLE');

        expect(data.elements[2].type).equal('table');
        expect(data.elements[2].titleKey).equal('REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.DETAIL-TABLE');
    });

    it('should return the process definitions when the appId is not provided', async () => {
        reportsMock.get200ResponseProcessDefinitions();

        const res = await reportApi.getProcessDefinitions();

        expect(res.length).equal(4);
        expect(res[0].id).equal('Process_sid-0FF10DA3-E2BD-4E6A-9013-6D66FC8A4716:1:30004');
        expect(res[0].name).equal('Fake Process Name 1');

        expect(res[1].id).equal('SecondProcess:1:15027');
        expect(res[1].name).equal('Fake Process Name 2');

        expect(res[2].id).equal('Simpleprocess:15:10004');
        expect(res[2].name).equal('Fake Process Name 3');

        expect(res[3].id).equal('fruitorderprocess:5:42530');
        expect(res[3].name).equal('Fake Process Name 4');
    });

    it('should return the report list', async () => {
        reportsMock.get200ResponseReportList();

        const res = await reportApi.getReportList();

        expect(res.length).equal(5);

        expect(res[0].id).equal(11011);
        expect(res[0].name).equal('Process definition heat map');

        expect(res[1].id).equal(11012);
        expect(res[1].name).equal('Process definition overview');

        expect(res[2].id).equal(11013);
        expect(res[2].name).equal('Process instances overview');

        expect(res[3].id).equal(11014);
        expect(res[3].name).equal('Task overview');

        expect(res[4].id).equal(11015);
        expect(res[4].name).equal('Task service level agreement');
    });

    it('should return the report parameters', async () => {
        const reportId = '11013'; // String | reportId
        reportsMock.get200ResponseReportParams(reportId);

        const res = await reportApi.getReportParams(reportId);
        const paramsDefinition = JSON.parse(res.definition);

        expect(res.id).equal(11013);
        expect(res.name).equal('Process instances overview');
        expect(paramsDefinition.parameters.length).equal(4);

        expect(paramsDefinition.parameters[0].id).equal('processDefinitionId');
        expect(paramsDefinition.parameters[0].nameKey).equal('REPORTING.DEFAULT-REPORTS.PROCESS-INSTANCES-OVERVIEW.PROCESS-DEFINITION');
        expect(paramsDefinition.parameters[0].type).equal('processDefinition');

        expect(paramsDefinition.parameters[1].id).equal('dateRange');
        expect(paramsDefinition.parameters[1].nameKey).equal('REPORTING.DEFAULT-REPORTS.PROCESS-INSTANCES-OVERVIEW.DATE-RANGE');
        expect(paramsDefinition.parameters[1].type).equal('dateRange');

        expect(paramsDefinition.parameters[2].id).equal('slowProcessInstanceInteger');
        expect(paramsDefinition.parameters[2].nameKey).equal('REPORTING.DEFAULT-REPORTS.PROCESS-INSTANCES-OVERVIEW.SLOW-PROC-INST-NUMBER');
        expect(paramsDefinition.parameters[2].type).equal('integer');

        expect(paramsDefinition.parameters[3].id).equal('status');
        expect(paramsDefinition.parameters[3].nameKey).equal('REPORTING.PROCESS-STATUS');
        expect(paramsDefinition.parameters[3].type).equal('status');
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
        expect(response).not.equal(null);
        expect(response).not.equal(undefined);
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
