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

import { AlfrescoApiService } from 'ng2-alfresco-core';
import { ProcessInstance, ProcessDefinitionRepresentation } from '../models/index';
import { ProcessFilterRequestRepresentation } from '../models/process-instance-filter.model';
import { ProcessInstanceVariable } from './../models/process-instance-variable.model';
import {
    AppDefinitionRepresentationModel,
    Comment,
    TaskDetailsModel,
    User
} from 'ng2-activiti-tasklist';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { Injectable }     from '@angular/core';
import { Observable }     from 'rxjs/Observable';

declare var moment: any;

@Injectable()
export class ActivitiProcessService {

    constructor(public apiService: AlfrescoApiService) {
    }

    /**
     * Retrieve all deployed apps
     * @returns {Observable<any>}
     */
    getDeployedApplications(name: string): Observable<AppDefinitionRepresentationModel> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.appsApi.getAppDefinitions())
            .map((response: any) => response.data.find((p: AppDefinitionRepresentationModel) => p.name === name))
            .catch(this.handleError);
    }

    getProcessInstances(requestNode: ProcessFilterRequestRepresentation): Observable<ProcessInstance[]> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.processApi.getProcessInstances(requestNode))
            .map((res: any) => {
                if (requestNode.processDefinitionKey) {
                    return res.data.filter(p => p.processDefinitionKey === requestNode.processDefinitionKey);
                } else {
                    return res.data;
                }
            }).catch(this.handleError);
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
                if (response && response.data && response.data.length === 0) {
                    return this.createDefaultFilters(appId);
                }
                return filters;
            })
            .catch(this.handleError);
    }

    /**
     * Create and return the default filters
     * @param appId
     * @returns {FilterRepresentationModel[]}
     */
    private createDefaultFilters(appId: number): FilterProcessRepresentationModel[] {
        let filters: FilterProcessRepresentationModel[] = [];

        let involvedTasksFilter = this.getRunningFilterInstance(appId);
        this.addFilter(involvedTasksFilter);
        filters.push(involvedTasksFilter);

        let myTasksFilter = this.getCompletedFilterInstance(appId);
        this.addFilter(myTasksFilter);
        filters.push(myTasksFilter);

        let queuedTasksFilter = this.getAllFilterInstance(appId);
        this.addFilter(queuedTasksFilter);
        filters.push(queuedTasksFilter);

        return filters;
    }

    /**
     * Return a static Running filter instance
     * @param appId
     * @returns {FilterProcessRepresentationModel}
     */
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
        delete filter.filter.assignment;
        return Observable.fromPromise(this.callApiAddFilter(filter))
            .catch(this.handleError);
    }

    getProcess(id: string): Observable<ProcessInstance> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.processApi.getProcessInstance(id))
            .catch(this.handleError);
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
            .catch(this.handleError);
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
            }).catch(this.handleError);
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
            }).catch(this.handleError);

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
            .catch(this.handleError);
    }

    startProcess(processDefinitionId: string, name: string, startFormValues?: any): Observable<ProcessInstance> {
        let startRequest: any = {
            name: name,
            processDefinitionId: processDefinitionId
        };
        if (startFormValues) {
            startRequest.values = startFormValues;
        }
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.processApi.startNewProcessInstance(startRequest)
            )
            .map((pd) => new ProcessInstance(pd))
            .catch(this.handleError);
    }

    cancelProcess(processInstanceId: string): Observable<void> {
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.processApi.deleteProcessInstance(processInstanceId)
            )
            .catch(this.handleError);
    }

    getProcessInstanceVariables(processDefinitionId: string): Observable<ProcessInstanceVariable[]> {
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.processInstanceVariablesApi.getProcessInstanceVariables(processDefinitionId)
            )
            .map((processVars: any[]) => processVars.map((pd) => new ProcessInstanceVariable(pd)))
            .catch(this.handleError);
    }

    createOrUpdateProcessInstanceVariables(processDefinitionId: string, variables: ProcessInstanceVariable[]): Observable<ProcessInstanceVariable[]> {
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.processInstanceVariablesApi.createOrUpdateProcessInstanceVariables(processDefinitionId, variables)
            )
            .catch(this.handleError);
    }

    deleteProcessInstanceVariable(processDefinitionId: string, variableName: string): Observable<void> {
        return Observable.fromPromise(
            this.apiService.getInstance().activiti.processInstanceVariablesApi.deleteProcessInstanceVariable(processDefinitionId, variableName)
            )
            .catch(this.handleError);
    }

    private callApiGetUserProcessInstanceFilters(filterOpts) {
        return this.apiService.getInstance().activiti.userFiltersApi.getUserProcessInstanceFilters(filterOpts);
    }

    private callApiAddFilter(filter: FilterProcessRepresentationModel) {
        return this.apiService.getInstance().activiti.userFiltersApi.createUserProcessInstanceFilter(filter);
    }

    private extractData(res: any) {
        return res.data || {};
    }

    private handleError(error: any) {
        return Observable.throw(error || 'Server error');
    }
}
