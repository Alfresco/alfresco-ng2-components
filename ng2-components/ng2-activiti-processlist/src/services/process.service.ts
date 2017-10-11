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
import { RestVariable } from 'alfresco-js-api';
import {
    Comment,
    TaskDetailsModel,
    TaskListService } from 'ng2-activiti-tasklist';
import { AlfrescoApiService, LightUserRepresentation, LogService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Observable';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { ProcessDefinitionRepresentation } from '../models/process-definition.model';
import { ProcessFilterRequestRepresentation } from '../models/process-instance-filter.model';
import { ProcessInstance } from '../models/process-instance.model';
import { ProcessInstanceVariable } from './../models/process-instance-variable.model';

declare let moment: any;

@Injectable()
export class ProcessService extends TaskListService {

    constructor(private alfrescoApiService: AlfrescoApiService,
                private processLogService: LogService) {
        super(alfrescoApiService, processLogService);
    }

    getProcessInstances(requestNode: ProcessFilterRequestRepresentation, processDefinitionKey?: string): Observable<ProcessInstance[]> {
        return Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessInstances(requestNode))
            .map((res: any) => {
                if (processDefinitionKey) {
                    return res.data.filter(process => process.processDefinitionKey === processDefinitionKey);
                } else {
                    return res.data;
                }
            }).catch(err => this.handleProcessError(err));
    }

    getProcessFilters(appId: string): Observable<FilterProcessRepresentationModel[]> {
        return Observable.fromPromise(this.callApiProcessFilters(appId))
            .map((response: any) => {
                let filters: FilterProcessRepresentationModel[] = [];
                response.data.forEach((filter: FilterProcessRepresentationModel) => {
                    let filterModel = new FilterProcessRepresentationModel(filter);
                    filters.push(filterModel);
                });
                return filters;
            })
            .catch(err => this.handleProcessError(err));
    }

    /**
     * Retrieve the process filter by id
     * @param filterId - number - The id of the filter
     * @param appId - string - optional - The id of app
     * @returns {Observable<FilterProcessRepresentationModel>}
     */
    getProcessFilterById(filterId: number, appId?: string): Observable<FilterProcessRepresentationModel> {
        return Observable.fromPromise(this.callApiProcessFilters(appId))
            .map((response: any) => {
                return response.data.find(filter => filter.id === filterId);
            }).catch(err => this.handleProcessError(err));
    }

    /**
     * Retrieve the process filter by name
     * @param filterName - string - The name of the filter
     * @param appId - string - optional - The id of app
     * @returns {Observable<FilterProcessRepresentationModel>}
     */
    getProcessFilterByName(filterName: string, appId?: string): Observable<FilterProcessRepresentationModel> {
        return Observable.fromPromise(this.callApiProcessFilters(appId))
            .map((response: any) => {
                return response.data.find(filter => filter.name === filterName);
            }).catch(err => this.handleProcessError(err));
    }

    /**
     * fetch the Process Audit information as a pdf
     * @param processId - the process id
     */
    fetchProcessAuditPdfById(processId: string): Observable<Blob> {
        return Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessAuditPdf(processId))
            .catch(err => this.handleProcessError(err));
    }

    /**
     * fetch the Process Audit information in a json format
     * @param processId - the process id
     */
    fetchProcessAuditJsonById(processId: string): Observable<any> {
        return Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessAuditJson(processId))
            .catch(err => this.handleProcessError(err));
    }

    /**
     * Create and return the default filters
     * @param appId
     * @returns {FilterProcessRepresentationModel[]}
     */
    public createDefaultFilters(appId: string): Observable<any[]> {
        let runnintFilter = this.getRunningFilterInstance(appId);
        let runnintObservable = this.addProcessFilter(runnintFilter);

        let completedFilter = this.getCompletedFilterInstance(appId);
        let completedObservable = this.addProcessFilter(completedFilter);

        let allFilter = this.getAllFilterInstance(appId);
        let allObservable = this.addProcessFilter(allFilter);

        return Observable.create(observer => {
            Observable.forkJoin(
                runnintObservable,
                completedObservable,
                allObservable
            ).subscribe(
                (res) => {
                    let filters: FilterProcessRepresentationModel[] = [];
                    res.forEach((filter) => {
                        if (filter.name === runnintFilter.name) {
                            filters.push(runnintFilter);
                        } else if (filter.name === completedFilter.name) {
                            filters.push(completedFilter);
                        } else if (filter.name === allFilter.name) {
                            filters.push(allFilter);
                        }
                    });
                    observer.next(filters);
                    observer.complete();
                },
                (err: any) => {
                    this.processLogService.error(err);
                });
        });
    }

    public getRunningFilterInstance(appId: string): FilterProcessRepresentationModel {
        return new FilterProcessRepresentationModel({
            'name': 'Running',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-random',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'running' }
        });
    }

    /**
     * Return a static Completed filter instance
     * @param appId
     * @returns {FilterProcessRepresentationModel}
     */
    private getCompletedFilterInstance(appId: string): FilterProcessRepresentationModel {
        return new FilterProcessRepresentationModel({
            'name': 'Completed',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-ok-sign',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'completed' }
        });
    }

    /**
     * Return a static All filter instance
     * @param appId
     * @returns {FilterProcessRepresentationModel}
     */
    private getAllFilterInstance(appId: string): FilterProcessRepresentationModel {
        return new FilterProcessRepresentationModel({
            'name': 'All',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-th',
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'all' }
        });
    }

    /**
     * Add a filter
     * @param filter - FilterProcessRepresentationModel
     * @returns {FilterProcessRepresentationModel}
     */
    addProcessFilter(filter: FilterProcessRepresentationModel): Observable<FilterProcessRepresentationModel> {
        return Observable.fromPromise(this.callApiAddProccessFilter(filter))
            .map(res => res)
            .map((response: FilterProcessRepresentationModel) => {
                return response;
            }).catch(err => this.handleProcessError(err));
    }

    getProcess(id: string): Observable<ProcessInstance> {
        return Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessInstance(id))
            .catch(err => this.handleProcessError(err));
    }

    getProcessTasks(id: string, state?: string): Observable<TaskDetailsModel[]> {
        let taskOpts = state ? {
                processInstanceId: id,
                state: state
            } : {
                processInstanceId: id
            };
        return Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.taskApi.listTasks(taskOpts))
            .map(this.extractData)
            .map(tasks => tasks.map((task: any) => {
                task.created = moment(task.created, 'YYYY-MM-DD').format();
                return task;
            }))
            .catch(err => this.handleProcessError(err));
    }

    /**
     * Retrive all the process instance's comments
     * @param id - process instance ID
     * @returns {<Comment[]>}
     */
    getComments(id: string): Observable<Comment[]> {
        return Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.commentsApi.getProcessInstanceComments(id))
            .map(res => res)
            .map((response: any) => {
                let comments: Comment[] = [];
                response.data.forEach((comment) => {
                    let user = new LightUserRepresentation(comment.createdBy);
                    comments.push(new Comment(comment.id, comment.message, comment.created, user));
                });
                return comments;
            }).catch(err => this.handleProcessError(err));
    }

    /**
     * Add a comment to a process instance
     * @param id - process instance Id
     * @param message - content of the comment
     * @returns {Comment}
     */
    addComment(id: string, message: string): Observable<Comment> {
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.commentsApi.addProcessInstanceComment({ message: message }, id)
        )
            .map((response: Comment) => {
                return new Comment(response.id, response.message, response.created, response.createdBy);
            }).catch(err => this.handleProcessError(err));

    }

    getProcessDefinitions(appId?: string): Observable<ProcessDefinitionRepresentation[]> {
        let opts = appId ? {
                latest: true,
                appDefinitionId: appId
            } : {
                latest: true
            };
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.processApi.getProcessDefinitions(opts)
        )
            .map(this.extractData)
            .map(processDefs => processDefs.map((pd) => new ProcessDefinitionRepresentation(pd)))
            .catch(err => this.handleProcessError(err));
    }

    startProcess(processDefinitionId: string, name: string, outcome?: string, startFormValues?: any, variables?: RestVariable[]): Observable<ProcessInstance> {
        let startRequest: any = {
            name: name,
            processDefinitionId: processDefinitionId
        };
        if (outcome) {
            startRequest.outcome = outcome;
        }
        if (startFormValues) {
            startRequest.values = startFormValues;
        }
        if (variables) {
            startRequest.variables = variables;
        }
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.processApi.startNewProcessInstance(startRequest)
        )
            .map((pd) => new ProcessInstance(pd))
            .catch(err => this.handleProcessError(err));
    }

    cancelProcess(processInstanceId: string): Observable<void> {
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.processApi.deleteProcessInstance(processInstanceId)
        )
            .catch(err => this.handleProcessError(err));
    }

    getProcessInstanceVariables(processDefinitionId: string): Observable<ProcessInstanceVariable[]> {
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.processInstanceVariablesApi.getProcessInstanceVariables(processDefinitionId)
        )
            .map((processVars: any[]) => processVars.map((pd) => new ProcessInstanceVariable(pd)))
            .catch(err => this.handleProcessError(err));
    }

    createOrUpdateProcessInstanceVariables(processDefinitionId: string, variables: ProcessInstanceVariable[]): Observable<ProcessInstanceVariable[]> {
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.processInstanceVariablesApi.createOrUpdateProcessInstanceVariables(processDefinitionId, variables)
        )
            .catch(err => this.handleProcessError(err));
    }

    deleteProcessInstanceVariable(processDefinitionId: string, variableName: string): Observable<void> {
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.processInstanceVariablesApi.deleteProcessInstanceVariable(processDefinitionId, variableName)
        )
            .catch(err => this.handleProcessError(err));
    }

    private callApiAddProccessFilter(filter: FilterProcessRepresentationModel) {
        return this.alfrescoApiService.getInstance().activiti.userFiltersApi.createUserProcessInstanceFilter(filter);
    }

    callApiProcessFilters(appId?: string) {
        if (appId) {
            return this.alfrescoApiService.getInstance().activiti.userFiltersApi.getUserProcessInstanceFilters({ appId: appId });
        } else {
            return this.alfrescoApiService.getInstance().activiti.userFiltersApi.getUserProcessInstanceFilters();
        }
    }

    private extractData(res: any) {
        return res.data || {};
    }

    private handleProcessError(error: any) {
        return Observable.throw(error || 'Server error');
    }
}
