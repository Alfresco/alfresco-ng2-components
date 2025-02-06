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

import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

export class ReportApi extends BaseApi {
    /**
     * Create the default reports
     */
    createDefaultReports() {
        return this.post({
            path: '/app/rest/reporting/default-reports'
        });
    }

    getTasksByProcessDefinitionId(reportId: string, processDefinitionId: string) {
        throwIfNotDefined(reportId, 'reportId');
        throwIfNotDefined(processDefinitionId, 'processDefinitionId');

        const pathParams = {
            reportId
        };
        const queryParams = {
            processDefinitionId
        };

        return this.get({
            path: '/app/rest/reporting/report-params/{reportId}/tasks',
            pathParams,
            queryParams
        });
    }

    getReportsByParams(reportId: string, bodyParam: any) {
        throwIfNotDefined(reportId, 'reportId');

        const pathParams = {
            reportId
        };

        return this.post({
            path: '/app/rest/reporting/report-params/{reportId}',
            pathParams,
            bodyParam
        });
    }

    getProcessDefinitions() {
        return this.get({
            path: '/app/rest/reporting/process-definitions'
        });
    }

    getReportParams(reportId: string) {
        throwIfNotDefined(reportId, 'reportId');

        const pathParams = {
            reportId
        };

        return this.get({
            path: '/app/rest/reporting/report-params/{reportId}',
            pathParams
        });
    }

    getReportList() {
        return this.get({
            path: '/app/rest/reporting/reports'
        });
    }

    updateReport(reportId: string, name: string) {
        throwIfNotDefined(reportId, 'reportId');

        const postBody = {
            name
        };

        const pathParams = {
            reportId
        };

        return this.put({
            path: '/app/rest/reporting/reports/{reportId}',
            pathParams,
            bodyParam: postBody
        });
    }

    /**
     * Export a report
     * @param reportId report id
     * @param bodyParam body parameters
     */
    exportToCsv(reportId: string, bodyParam: { reportName?: string }) {
        throwIfNotDefined(reportId, 'reportId');
        throwIfNotDefined(bodyParam, 'bodyParam');
        throwIfNotDefined(bodyParam.reportName, 'reportName');

        const pathParams = {
            reportId
        };

        return this.post({
            path: '/app/rest/reporting/reports/{reportId}/export-to-csv',
            pathParams,
            bodyParam
        });
    }

    /**
     * Save a report
     * @param reportId report id
     * @param opts Optional parameters
     */
    saveReport(reportId: string, opts: { reportName?: string }) {
        throwIfNotDefined(reportId, 'reportId');
        throwIfNotDefined(opts, 'opts');
        throwIfNotDefined(opts.reportName, 'reportName');

        const bodyParam = {
            reportName: opts.reportName,
            __reportName: opts.reportName
        };

        const pathParams = {
            reportId
        };

        return this.post({
            path: '/app/rest/reporting/reports/{reportId}',
            pathParams,
            bodyParam
        });
    }

    /**
     * Delete a report
     * @param reportId report id
     */
    deleteReport(reportId: string) {
        throwIfNotDefined(reportId, 'reportId');

        const pathParams = {
            reportId
        };

        return this.delete({
            path: '/app/rest/reporting/reports/{reportId}',
            pathParams
        });
    }
}
