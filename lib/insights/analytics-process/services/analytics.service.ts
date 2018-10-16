/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { Response } from '@angular/http';
import { Observable, from, throwError } from 'rxjs';
import { ParameterValueModel } from '../../diagram/models/report/parameterValue.model';
import { ReportParametersModel } from '../../diagram/models/report/reportParameters.model';
import { BarChart } from '../../diagram/models/chart/barChart.model';
import { Chart } from '../../diagram/models/chart/chart.model';
import { DetailsTableChart } from '../../diagram/models/chart/detailsTableChart.model';
import { HeatMapChart } from '../../diagram/models/chart/heatMapChart.model';
import { MultiBarChart } from '../../diagram/models/chart/multiBarChart.model';
import { PieChart } from '../../diagram/models/chart/pieChart.model';
import { TableChart } from '../../diagram/models/chart/tableChart.model';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AnalyticsService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Retrieve all the Deployed app
     */
    getReportList(appId: number): Observable<any> {
        return from(this.apiService.getInstance().activiti.reportApi.getReportList())
            .pipe(
                map((res: any) => {
                    let reports: ReportParametersModel[] = [];
                    res.forEach((report: ReportParametersModel) => {
                        let reportModel = new ReportParametersModel(report);
                        if (this.isReportValid(appId, report)) {
                            reports.push(reportModel);
                        }
                    });
                    return reports;
                }),
                catchError(err => this.handleError(err))
            );
    }

    /**
     * Retrieve Report by name
     * @param reportName - string - The name of report
     */
    getReportByName(reportName: string): Observable<any> {
        return from(this.apiService.getInstance().activiti.reportApi.getReportList())
            .pipe(
                map((response: any) => {
                    return response.find(report => report.name === reportName);
                }),
                catchError(err => this.handleError(err))
            );
    }

    private isReportValid(appId: number, report: ReportParametersModel) {
        let isValid: boolean = true;
        if (appId && appId !== 0 && report.name.includes('Process definition overview')) {
            isValid = false;
        }
        return isValid;
    }

    getReportParams(reportId: string): Observable<any> {
        return from(this.apiService.getInstance().activiti.reportApi.getReportParams(reportId))
            .pipe(
                map((res: any) => {
                    return new ReportParametersModel(res);
                }),
                catchError(err => this.handleError(err))
            );
    }

    getParamValuesByType(type: string, appId: number, reportId?: string, processDefinitionId?: string) {
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
            return new Observable(observer => {
                observer.next(null);
                observer.complete();
            });
        }
    }

    getProcessStatusValues(): Observable<any> {
        let paramOptions: ParameterValueModel[] = [];

        paramOptions.push(new ParameterValueModel({ id: 'All', name: 'All' }));
        paramOptions.push(new ParameterValueModel({ id: 'Active', name: 'Active' }));
        paramOptions.push(new ParameterValueModel({ id: 'Complete', name: 'Complete' }));

        return new Observable(observer => {
            observer.next(paramOptions);
            observer.complete();
        });
    }

    getDateIntervalValues(): Observable<any> {
        let paramOptions: ParameterValueModel[] = [];

        paramOptions.push(new ParameterValueModel({ id: 'byHour', name: 'By hour' }));
        paramOptions.push(new ParameterValueModel({ id: 'byDay', name: 'By day' }));
        paramOptions.push(new ParameterValueModel({ id: 'byWeek', name: 'By week' }));
        paramOptions.push(new ParameterValueModel({ id: 'byMonth', name: 'By month' }));
        paramOptions.push(new ParameterValueModel({ id: 'byYear', name: 'By year' }));

        return new Observable(observer => {
            observer.next(paramOptions);
            observer.complete();
        });
    }

    getMetricValues(): Observable<any> {
        let paramOptions: ParameterValueModel[] = [];

        paramOptions.push(new ParameterValueModel({ id: 'totalCount', name: 'Number of times a step is executed' }));
        paramOptions.push(new ParameterValueModel({ id: 'totalTime', name: 'Total time spent in a process step' }));
        paramOptions.push(new ParameterValueModel({ id: 'avgTime', name: 'Average time spent in a process step' }));

        return new Observable(observer => {
            observer.next(paramOptions);
            observer.complete();
        });
    }

    getProcessDefinitionsValuesNoApp(): Observable<any> {
        return from(this.apiService.getInstance().activiti.reportApi.getProcessDefinitions())
            .pipe(
                map((res: any) => {
                    let paramOptions: ParameterValueModel[] = [];
                    res.forEach((opt) => {
                        paramOptions.push(new ParameterValueModel(opt));
                    });
                    return paramOptions;
                }),
                catchError(err => this.handleError(err))
            );
    }

    getProcessDefinitionsValues(appId: number): Observable<any> {
        let options = { 'appDefinitionId': appId };
        return from(this.apiService.getInstance().activiti.processDefinitionsApi.getProcessDefinitions(options))
            .pipe(
                map((res: any) => {
                    let paramOptions: ParameterValueModel[] = [];
                    res.data.forEach((opt) => {
                        paramOptions.push(new ParameterValueModel(opt));
                    });
                    return paramOptions;
                }),
                catchError(err => this.handleError(err))
            );
    }

    getTasksByProcessDefinitionId(reportId: string, processDefinitionId: string): Observable<any> {
        return from(this.apiService.getInstance().activiti.reportApi.getTasksByProcessDefinitionId(reportId, processDefinitionId))
            .pipe(
                map((res: any) => {
                    let paramOptions: ParameterValueModel[] = [];
                    res.forEach((opt) => {
                        paramOptions.push(new ParameterValueModel({ id: opt, name: opt }));
                    });
                    return paramOptions;
                }),
                catchError(err => this.handleError(err))
            );
    }

    getReportsByParams(reportId: number, paramsQuery: any): Observable<any> {
        return from(this.apiService.getInstance().activiti.reportApi.getReportsByParams(reportId, paramsQuery))
            .pipe(
                map((res: any) => {
                    let elements: Chart[] = [];
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
                catchError(err => this.handleError(err))
            );
    }

    createDefaultReports(): Observable<any> {
        return from(this.apiService.getInstance().activiti.reportApi.createDefaultReports())
            .pipe(
                map(this.toJson),
                catchError(err => this.handleError(err))
            );
    }

    updateReport(reportId: number, name: string): Observable<any> {
        return from(this.apiService.getInstance().activiti.reportApi.updateReport(reportId, name))
            .pipe(
                map(() => this.logService.info('upload')),
                catchError(err => this.handleError(err))
            );
    }

    exportReportToCsv(reportId: string, paramsQuery: any): Observable<any> {
        return from(this.apiService.getInstance().activiti.reportApi.exportToCsv(reportId, paramsQuery))
            .pipe(
                map((res: any) => {
                    this.logService.info('export');
                    return res;
                }),
                catchError(err => this.handleError(err))
            );
    }

    saveReport(reportId: string, paramsQuery: any): Observable<any> {
        return from(this.apiService.getInstance().activiti.reportApi.saveReport(reportId, paramsQuery))
            .pipe(
                map(() => {
                    this.logService.info('save');
                }),
                catchError(err => this.handleError(err))
            );
    }

    deleteReport(reportId: string): Observable<any> {
        return from(this.apiService.getInstance().activiti.reportApi.deleteReport(reportId))
            .pipe(
                map(() => {
                    this.logService.info('delete');
                }),
                catchError(err => this.handleError(err))
            );
    }

    private handleError(error: Response) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }

    toJson(res: any) {
        return res || {};
    }
}
