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

import { AlfrescoApiService, LogService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, from, throwError, of } from 'rxjs';
import { ParameterValueModel } from '../../diagram/models/report/parameter-value.model';
import { ReportParametersModel } from '../../diagram/models/report/report-parameters.model';
import { BarChart } from '../../diagram/models/chart/bar-chart.model';
import { Chart } from '../../diagram/models/chart/chart.model';
import { DetailsTableChart } from '../../diagram/models/chart/details-table-chart.model';
import { HeatMapChart } from '../../diagram/models/chart/heat-map-chart.model';
import { MultiBarChart } from '../../diagram/models/chart/multi-bar-chart.model';
import { PieChart } from '../../diagram/models/chart/pie-chart.model';
import { TableChart } from '../../diagram/models/chart/table-chart.model';
import { map, catchError } from 'rxjs/operators';
import { ProcessDefinitionsApi, ReportApi } from '@alfresco/js-api';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

    private _reportApi: ReportApi;
    get reportApi(): ReportApi {
        this._reportApi = this._reportApi ?? new ReportApi(this.apiService.getInstance());
        return this._reportApi;
    }

    private _processDefinitionsApi: ProcessDefinitionsApi;
    get processDefinitionsApi(): ProcessDefinitionsApi {
        this._processDefinitionsApi = this._processDefinitionsApi ?? new ProcessDefinitionsApi(this.apiService.getInstance());
        return this._processDefinitionsApi;
    }

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Retrieve all the Deployed app
     */
    getReportList(appId: number): Observable<ReportParametersModel[]> {
        return from(this.reportApi.getReportList())
            .pipe(
                map((res: any) => {
                    const reports: ReportParametersModel[] = [];
                    res.forEach((report: ReportParametersModel) => {
                        const reportModel = new ReportParametersModel(report);
                        if (this.isReportValid(appId, report)) {
                            reports.push(reportModel);
                        }
                    });
                    return reports;
                }),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Retrieve Report by name
     *
     * @param reportName - string - The name of report
     */
    getReportByName(reportName: string): Observable<any> {
        return from(this.reportApi.getReportList())
            .pipe(
                map((response: any) => response.find((report) => report.name === reportName)),
                catchError((err) => this.handleError(err))
            );
    }

    getReportParams(reportId: string): Observable<ReportParametersModel> {
        return from(this.reportApi.getReportParams(reportId))
            .pipe(
                map((res: any) => new ReportParametersModel(res)),
                catchError((err) => this.handleError(err))
            );
    }

    getParamValuesByType(type: string, appId: number, reportId?: string, processDefinitionId?: string): Observable<ParameterValueModel[]> {
        if (type === 'status') {
            return this.getProcessStatusValues();
        } else if (type === 'processDefinition') {
            if (appId === null || appId === undefined) {
                return this.getProcessDefinitionsValuesNoApp();
            } else {
                return this.getProcessDefinitionsValues(appId);
            }
        } else if (type === 'dateInterval') {
            return this.getDateIntervalValues();
        } else if (type === 'task' && reportId && processDefinitionId) {
            return this.getTasksByProcessDefinitionId(reportId, processDefinitionId);
        } else {
            return of(null);
        }
    }

    getProcessStatusValues(): Observable<ParameterValueModel[]> {
        const paramOptions: ParameterValueModel[] = [];

        paramOptions.push(new ParameterValueModel({ id: 'All', name: 'All' }));
        paramOptions.push(new ParameterValueModel({ id: 'Active', name: 'Active' }));
        paramOptions.push(new ParameterValueModel({ id: 'Complete', name: 'Complete' }));

        return of(paramOptions);
    }

    getDateIntervalValues(): Observable<ParameterValueModel[]> {
        const paramOptions: ParameterValueModel[] = [];

        paramOptions.push(new ParameterValueModel({ id: 'byHour', name: 'By hour' }));
        paramOptions.push(new ParameterValueModel({ id: 'byDay', name: 'By day' }));
        paramOptions.push(new ParameterValueModel({ id: 'byWeek', name: 'By week' }));
        paramOptions.push(new ParameterValueModel({ id: 'byMonth', name: 'By month' }));
        paramOptions.push(new ParameterValueModel({ id: 'byYear', name: 'By year' }));

        return of(paramOptions);
    }

    getMetricValues(): Observable<ParameterValueModel[]> {
        const paramOptions: ParameterValueModel[] = [];

        paramOptions.push(new ParameterValueModel({ id: 'totalCount', name: 'Number of times a step is executed' }));
        paramOptions.push(new ParameterValueModel({ id: 'totalTime', name: 'Total time spent in a process step' }));
        paramOptions.push(new ParameterValueModel({ id: 'avgTime', name: 'Average time spent in a process step' }));

        return of(paramOptions);
    }

    getProcessDefinitionsValuesNoApp(): Observable<ParameterValueModel[]> {
        return from(this.reportApi.getProcessDefinitions())
            .pipe(
                map((res: any) => {
                    const paramOptions: ParameterValueModel[] = [];
                    res.forEach((opt) => {
                        paramOptions.push(new ParameterValueModel(opt));
                    });
                    return paramOptions;
                }),
                catchError((err) => this.handleError(err))
            );
    }

    getProcessDefinitionsValues(appId: number): Observable<ParameterValueModel[]> {
        const options = { appDefinitionId: appId };
        return from(this.processDefinitionsApi.getProcessDefinitions(options))
            .pipe(
                map((res: any) => {
                    const paramOptions: ParameterValueModel[] = [];
                    res.data.forEach((opt) => {
                        paramOptions.push(new ParameterValueModel(opt));
                    });
                    return paramOptions;
                }),
                catchError((err) => this.handleError(err))
            );
    }

    getTasksByProcessDefinitionId(reportId: string, processDefinitionId: string): Observable<ParameterValueModel[]> {
        return from(this.reportApi.getTasksByProcessDefinitionId(reportId, processDefinitionId))
            .pipe(
                map((res: any) => {
                    const paramOptions: ParameterValueModel[] = [];
                    res.forEach((opt) => {
                        paramOptions.push(new ParameterValueModel({ id: opt, name: opt }));
                    });
                    return paramOptions;
                }),
                catchError((err) => this.handleError(err))
            );
    }

    getReportsByParams(reportId: string, paramsQuery: any): Observable<Chart[]> {
        return from(this.reportApi.getReportsByParams(reportId, paramsQuery))
            .pipe(
                map((res: any) => {
                    const elements: Chart[] = [];
                    res.elements.forEach((chartData) => {
                        if (chartData.type === 'pieChart') {
                            elements.push(new PieChart(chartData));
                        } else if (chartData.type === 'table') {
                            elements.push(new TableChart(chartData));
                        } else if (chartData.type === 'processDefinitionHeatMap') {
                            elements.push(new HeatMapChart(chartData));
                        } else if (chartData.type === 'masterDetailTable') {
                            elements.push(new DetailsTableChart(chartData));
                        } else if (chartData.type === 'barChart') {
                            elements.push(new BarChart(chartData));
                        } else if (chartData.type === 'multiBarChart') {
                            elements.push(new MultiBarChart(chartData));
                        }
                    });

                    return elements;
                }),
                catchError((err) => this.handleError(err))
            );
    }

    createDefaultReports(): Observable<any> {
        return from(this.reportApi.createDefaultReports())
            .pipe(
                map(res => res || {}),
                catchError((err) => this.handleError(err))
            );
    }

    updateReport(reportId: string, name: string): Observable<any> {
        return from(this.reportApi.updateReport(reportId, name))
            .pipe(
                map(() => this.logService.info('upload')),
                catchError((err) => this.handleError(err))
            );
    }

    exportReportToCsv(reportId: string, paramsQuery: any): Observable<any> {
        return from(this.reportApi.exportToCsv(reportId, paramsQuery))
            .pipe(
                map((res: any) => {
                    this.logService.info('export');
                    return res;
                }),
                catchError((err) => this.handleError(err))
            );
    }

    saveReport(reportId: string, paramsQuery: any): Observable<any> {
        return from(this.reportApi.saveReport(reportId, paramsQuery))
            .pipe(
                map(() => {
                    this.logService.info('save');
                }),
                catchError((err) => this.handleError(err))
            );
    }

    deleteReport(reportId: string): Observable<any> {
        return from(this.reportApi.deleteReport(reportId))
            .pipe(
                map(() => {
                    this.logService.info('delete');
                }),
                catchError((err) => this.handleError(err))
            );
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

    private isReportValid(appId: number, report: ReportParametersModel) {
        let isValid: boolean = true;
        if (appId && appId !== 0 && report.name.includes('Process definition overview')) {
            isValid = false;
        }
        return isValid;
    }
}
