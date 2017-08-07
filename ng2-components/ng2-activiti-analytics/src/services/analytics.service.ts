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

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { ParameterValueModel, ReportParametersModel } from 'ng2-activiti-diagrams';
import {
    BarChart,
    Chart,
    DetailsTableChart,
    HeatMapChart,
    MultiBarChart,
    PieChart,
    TableChart
} from 'ng2-activiti-diagrams';
import { AlfrescoApiService, LogService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AnalyticsService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Retrive all the Deployed app
     * @returns {Observable<any>}
     */
    getReportList(appId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.reportApi.getReportList())
            .map((res: any) => {
                let reports: ReportParametersModel[] = [];
                res.forEach((report: ReportParametersModel) => {
                    let reportModel = new ReportParametersModel(report);
                    if (this.isReportValid(appId, report)) {
                        reports.push(reportModel);
                    }
                });
                return reports;
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrive Report by name
     * @param reportName - string - The name of report
     * @returns {Observable<any>}
     */
    getReportByName(reportName: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.reportApi.getReportList())
            .map((response: any) => {
                return response.find(report => report.name === reportName);
            }).catch(err => this.handleError(err));
    }

    private isReportValid(appId: string, report: ReportParametersModel) {
        let isValid: boolean = true;
        if (appId && appId !== '0' && report.name.includes('Process definition overview')) {
            isValid = false;
        }
        return isValid;
    }

    getReportParams(reportId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.reportApi.getReportParams(reportId))
            .map((res: any) => {
                return new ReportParametersModel(res);
            }).catch(err => this.handleError(err));
    }

    getParamValuesByType(type: string, appId: string, reportId?: string, processDefinitionId?: string) {
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
            return Observable.create(observer => {
                observer.next(null);
                observer.complete();
            });
        }
    }

    getProcessStatusValues(): Observable<any> {
        let paramOptions: ParameterValueModel[] = [];

        paramOptions.push(new ParameterValueModel({id: 'All', name: 'All'}));
        paramOptions.push(new ParameterValueModel({id: 'Active', name: 'Active'}));
        paramOptions.push(new ParameterValueModel({id: 'Complete', name: 'Complete'}));

        return Observable.create(observer => {
            observer.next(paramOptions);
            observer.complete();
        });
    }

    getDateIntervalValues(): Observable<any> {
        let paramOptions: ParameterValueModel[] = [];

        paramOptions.push(new ParameterValueModel({id: 'byHour', name: 'By hour'}));
        paramOptions.push(new ParameterValueModel({id: 'byDay', name: 'By day'}));
        paramOptions.push(new ParameterValueModel({id: 'byWeek', name: 'By week'}));
        paramOptions.push(new ParameterValueModel({id: 'byMonth', name: 'By month'}));
        paramOptions.push(new ParameterValueModel({id: 'byYear', name: 'By year'}));

        return Observable.create(observer => {
            observer.next(paramOptions);
            observer.complete();
        });
    }

    getMetricValues(): Observable<any> {
        let paramOptions: ParameterValueModel[] = [];

        paramOptions.push(new ParameterValueModel({id: 'totalCount', name: 'Number of times a step is executed'}));
        paramOptions.push(new ParameterValueModel({id: 'totalTime', name: 'Total time spent in a process step'}));
        paramOptions.push(new ParameterValueModel({id: 'avgTime', name: 'Average time spent in a process step'}));

        return Observable.create(observer => {
            observer.next(paramOptions);
            observer.complete();
        });
    }

    getProcessDefinitionsValuesNoApp(): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.reportApi.getProcessDefinitions())
            .map((res: any) => {
                let paramOptions: ParameterValueModel[] = [];
                res.forEach((opt) => {
                    paramOptions.push(new ParameterValueModel(opt));
                });
                return paramOptions;
            }).catch(err => this.handleError(err));
    }

    getProcessDefinitionsValues(appId: string): Observable<any> {
        let options = {'appDefinitionId': appId};
        return Observable.fromPromise(this.apiService.getInstance().activiti.processDefinitionsApi.getProcessDefinitions(options))
            .map((res: any) => {
                let paramOptions: ParameterValueModel[] = [];
                res.data.forEach((opt) => {
                    paramOptions.push(new ParameterValueModel(opt));
                });
                return paramOptions;
            }).catch(err => this.handleError(err));
    }

    getTasksByProcessDefinitionId(reportId: string, processDefinitionId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.reportApi.getTasksByProcessDefinitionId(reportId, processDefinitionId))
            .map((res: any) => {
                let paramOptions: ParameterValueModel[] = [];
                res.forEach((opt) => {
                    paramOptions.push(new ParameterValueModel({id: opt, name: opt}));
                });
                return paramOptions;
            }).catch(err => this.handleError(err));
    }

    getReportsByParams(reportId: number, paramsQuery: any): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.reportApi.getReportsByParams(reportId, paramsQuery))
            .map((res: any) => {
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
            }).catch(err => this.handleError(err));
    }

    createDefaultReports(): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.reportApi.createDefaultReports())
            .map(this.toJson)
            .catch(err => this.handleError(err));
    }

    updateReport(reportId: number, name: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.reportApi.updateReport(reportId, name))
            .map((res: any) => {
                this.logService.info('upload');
            }).catch(err => this.handleError(err));
    }

    exportReportToCsv(reportId: string, paramsQuery: any): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.reportApi.exportToCsv(reportId, paramsQuery))
            .map((res: any) => {
                this.logService.info('export');
                return res;
            }).catch(err => this.handleError(err));
    }

    saveReport(reportId: string, paramsQuery: any): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.reportApi.saveReport(reportId, paramsQuery))
            .map(() => {
                this.logService.info('save');
            }).catch(err => this.handleError(err));
    }

    deleteReport(reportId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.reportApi.deleteReport(reportId))
            .map(() => {
                this.logService.info('delete');
            }).catch(err => this.handleError(err));
    }

    private handleError(error: Response) {
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }

    toJson(res: any) {
        return res || {};
    }
}
