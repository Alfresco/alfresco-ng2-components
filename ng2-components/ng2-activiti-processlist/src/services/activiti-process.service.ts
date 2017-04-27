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
import { Observable } from 'rxjs/Observable';
import { AlfrescoApiService, LogService } from 'ng2-alfresco-core';
import { ProcessInstance, ProcessDefinitionRepresentation } from '../models/index';
import { ProcessFilterRequestRepresentation } from '../models/process-instance-filter.model';
import { ProcessInstanceVariable } from './../models/process-instance-variable.model';
import { AppDefinitionRepresentationModel, Comment, TaskDetailsModel, User } from 'ng2-activiti-tasklist';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';

declare var moment: any;

@Injectable()
export class ActivitiProcessService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Retrieve all deployed apps
     * @returns {Observable<any>}
     */
    getDeployedApplications(name: string): Observable<AppDefinitionRepresentationModel> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.appsApi.getAppDefinitions())
            .map((response: any) => response.data.find((p: AppDefinitionRepresentationModel) => p.name === name))
            .catch(err => this.handleError(err));
    }

    /**
     * Retrieve deployed apps details by id
     * @param appId - number - optional - The id of app
     * @returns {Observable<any>}
     */
    getApplicationDetailsById(appId?: number): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.appsApi.getAppDefinitions())
            .map((response: any) => {
                return response.data.find(p => p.id === appId);
            })
            .catch(err => this.handleError(err));
    }

    getProcessInstances(requestNode: ProcessFilterRequestRepresentation): Observable<ProcessInstance[]> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.processApi.getProcessInstances(requestNode))
            .map((res: any) => {
                if (requestNode.processDefinitionKey) {
                    return res.data.filter(p => p.processDefinitionKey === requestNode.processDefinitionKey);
                } else {
                    return res.data;
                }
            }).catch(err => this.handleError(err));
    }

    getProcessFilters(appId: number): Observable<FilterProcessRepresentationModel[]> {
        let filterOpts = appId ? {
            appId: appId
        } : {};
        return Observable.fromPromise(this.callApiGetUserProcessInstanceFilters(filterOpts))
            .map((response: any) => {
                let filters: FilterProcessRepresentationModel[] = [];
                response.data.forEach((filter: FilterProcessRepresentationModel) => {
                    let filterModel = new FilterProcessRepresentationModel(filter);
                    filters.push(filterModel);
                });
                return filters;
            })
            .catch(err => this.handleError(err));
    }

    /**
     * Retrieve the process filter by id
     * @param processId - string - The id of the filter
     * @returns {Observable<FilterProcessRepresentationModel>}
     */
    getProcessFilterById(processId: string, appId?: string): Observable<FilterProcessRepresentationModel> {
        return Observable.fromPromise(this.callApiGetUserProcessInstanceFilters(appId))
            .map((response: any) => {
                return response.data.find(filter => filter.id === processId);
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrieve the process filter by name
     * @param processName - string - The name of the filter
     * @returns {Observable<FilterProcessRepresentationModel>}
     */
    getProcessFilterByName(processName: string, appId?: string): Observable<FilterProcessRepresentationModel> {
        return Observable.fromPromise(this.callApiGetUserProcessInstanceFilters(appId))
            .map((response: any) => {
                return response.data.find(filter => filter.name === processName);
            }).catch(err => this.handleError(err));
    }

    /**
     * Create and return the default filters
     * @param appId
     * @returns {FilterProcessRepresentationModel[]}
     */
    public createDefaultFilters(appId: number): Observable<FilterProcessRepresentationModel[]> {
        let runnintFilter = this.getRunningFilterInstance(appId);
        let runnintObservable = this.addFilter(runnintFilter);

        let completedFilter = this.getCompletedFilterInstance(appId);
        let completedObservable = this.addFilter(completedFilter);

        let allFilter = this.getAllFilterInstance(appId);
        let allObservable = this.addFilter(allFilter);

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
                    this.logService.error(err);
                });
        });
    }

    private getRunningFilterInstance(appId: number): FilterProcessRepresentationModel {
        return new FilterProcessRepresentationModel({
            'name': 'Running',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-random',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'running'}
        });
    }

    /**
     * Return a static Completed filter instance
     * @param appId
     * @returns {FilterProcessRepresentationModel}
     */
    private getCompletedFilterInstance(appId: number): FilterProcessRepresentationModel {
        return new FilterProcessRepresentationModel({
            'name': 'Completed',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-ok-sign',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'completed'}
        });
    }

    /**
     * Return a static All filter instance
     * @param appId
     * @returns {FilterProcessRepresentationModel}
     */
    private getAllFilterInstance(appId: number): FilterProcessRepresentationModel {
        return new FilterProcessRepresentationModel({
            'name': 'All',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-th',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'all'}
        });
    }

    /**
     * Add a filter
     * @param filter - FilterProcessRepresentationModel
     * @returns {FilterProcessRepresentationModel}
     */
    addFilter(filter: FilterProcessRepresentationModel): Observable<FilterProcessRepresentationModel> {
        return Observable.fromPromise(this.callApiAddFilter(filter))
            .map(res => res)
            .map((response: FilterProcessRepresentationModel) => {
                return response;
            }).catch(err => this.handleError(err));
    }

    getProcess(id: string): Observable<ProcessInstance> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.processApi.getProcessInstance(id))
            .catch(err => this.handleError(err));
    }

    getProcessTasks(id: string, state?: string): Observable<TaskDetailsModel[]> {
        let taskOpts = state ? {
            processInstanceId: id,
            state: state
        } : {
            processInstanceId: id
        };
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.listTasks(taskOpts))
            .map(this.extractData)
            .map(tasks => tasks.map((task: any) => {
                task.created =  moment(task.created, 'YYYY-MM-DD').format();
                return task;
            }))
            .catch(err => this.handleError(err));
    }

    /**
     * Retrive all the process instance's comments
     * @param id - process instance ID
     * @returns {<Comment[]>}
     */
    getProcessInstanceComments(id: string): Observable<Comment[]> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.commentsApi.getProcessInstanceComments(id))
            .map(res => res)
            .map((response: any) => {
                let comments: Comment[] = [];
                response.data.forEach((comment) => {
                    let user = new User({
                        id: comment.createdBy.id,
                        email: comment.createdBy.email,
                        firstName: comment.createdBy.firstName,
                        lastName: comment.createdBy.lastName
                    });
                    comments.push(new Comment(comment.id, comment.message, comment.created, user));
                });
                return comments;
            }).catch(err => this.handleError(err));
    }

    /**
     * Add a comment to a process instance
     * @param id - process instance Id
     * @param message - content of the comment
     * @returns {Comment}
     */
    addProcessInstanceComment(id: string, message: string): Observable<Comment> {
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.commentsApi.addProcessInstanceComment({message: message}, id)
            )
            .map((response: Comment) => {
                return new Comment(response.id, response.message, response.created, response.createdBy);
            }).catch(err => this.handleError(err));

    }

    getProcessDefinitions(appId?: string): Observable<ProcessDefinitionRepresentation[]> {
        let opts = appId ? {
            latest: true,
            appDefinitionId: appId
        } : {
            latest: true
        };
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.processApi.getProcessDefinitions(opts)
            )
            .map(this.extractData)
            .map(processDefs => processDefs.map((pd) => new ProcessDefinitionRepresentation(pd)))
            .catch(err => this.handleError(err));
    }

    startProcess(processDefinitionId: string, name: string, outcome?: string, startFormValues?: any): Observable<ProcessInstance> {
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
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.processApi.startNewProcessInstance(startRequest)
            )
            .map((pd) => new ProcessInstance(pd))
            .catch(err => this.handleError(err));
    }

    cancelProcess(processInstanceId: string): Observable<void> {
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.processApi.deleteProcessInstance(processInstanceId)
            )
            .catch(err => this.handleError(err));
    }

    getProcessInstanceVariables(processDefinitionId: string): Observable<ProcessInstanceVariable[]> {
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.processInstanceVariablesApi.getProcessInstanceVariables(processDefinitionId)
            )
            .map((processVars: any[]) => processVars.map((pd) => new ProcessInstanceVariable(pd)))
            .catch(err => this.handleError(err));
    }

    createOrUpdateProcessInstanceVariables(processDefinitionId: string, variables: ProcessInstanceVariable[]): Observable<ProcessInstanceVariable[]> {
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.processInstanceVariablesApi.createOrUpdateProcessInstanceVariables(processDefinitionId, variables)
            )
            .catch(err => this.handleError(err));
    }

    deleteProcessInstanceVariable(processDefinitionId: string, variableName: string): Observable<void> {
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.processInstanceVariablesApi.deleteProcessInstanceVariable(processDefinitionId, variableName)
            )
            .catch(err => this.handleError(err));
    }

    private callApiGetUserProcessInstanceFilters(filterOpts) {
        return this.apiService.getInstance().activiti.userFiltersApi.getUserProcessInstanceFilters(filterOpts);
    }

    private callApiAddFilter(filter: FilterProcessRepresentationModel) {
        return this.apiService.getInstance().activiti.userFiltersApi.createUserProcessInstanceFilter(filter);
    }

    callApiProcessFilters(appId?: string) {
        if (appId) {
            return this.apiService.getInstance().activiti.userFiltersApi.getUserProcessInstanceFilters({ appId: appId });
        } else {
            return this.apiService.getInstance().activiti.userFiltersApi.getUserProcessInstanceFilters();
        }
    }

    private extractData(res: any) {
        return res.data || {};
    }

    private handleError(error: any) {
        return Observable.throw(error || 'Server error');
    }
}
