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
import { Observable } from 'rxjs/Rx';
import { AlfrescoApiService, LogService } from 'ng2-alfresco-core';
import { FilterRepresentationModel, TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { Comment } from '../models/comment.model';
import { User } from '../models/user.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { Form } from '../models/form.model';

@Injectable()
export class ActivitiTaskListService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Retrive all the Deployed app
     * @returns {Observable<any>}
     */
    getDeployedApplications(name?: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.appsApi.getAppDefinitions())
            .map((response: any) => {
                if (name) {
                    return response.data.find(p => p.name === name);
                }
                return response.data;
            })
            .catch(err => this.handleError(err));
    }

    /**
     * Retrive all the Tasks filters
     * @returns {Observable<any>}
     */
    getTaskListFilters(appId?: string): Observable<any> {
        return Observable.fromPromise(this.callApiTaskFilters(appId))
            .map((response: any) => {
                let filters: FilterRepresentationModel[] = [];
                response.data.forEach((filter: FilterRepresentationModel) => {
                    let filterModel = new FilterRepresentationModel(filter);
                    filters.push(filterModel);
                });
                if (response && response.data && response.data.length === 0) {
                    return this.createDefaultFilter(appId);
                }
                return filters;
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrive all the tasks filtered by filterModel
     * @param filter - TaskFilterRepresentationModel
     * @returns {any}
     */
    getTasks(requestNode: TaskQueryRequestRepresentationModel): Observable<TaskDetailsModel[]> {
        return Observable.fromPromise(this.callApiTasksFiltered(requestNode))
            .map((res: any) => {
                if (requestNode.processDefinitionKey) {
                    return res.data.filter(p => p.processDefinitionKey === requestNode.processDefinitionKey);
                } else {
                    return res.data;
                }
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrive all the task details
     * @param id - taskId
     * @returns {<TaskDetailsModel>}
     */
    getTaskDetails(id: string): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.callApiTaskDetails(id))
            .map(res => res)
            .map((details: any) => {
                return new TaskDetailsModel(details);
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrive all the task's comments
     * @param id - taskId
     * @returns {<Comment[]>}
     */
    getTaskComments(id: string): Observable<Comment[]> {
        return Observable.fromPromise(this.callApiTaskComments(id))
            .map(res => res)
            .map((response: any) => {
                let comments: Comment[] = [];
                response.data.forEach((comment) => {
                    let user = new User(comment.createdBy);
                    comments.push(new Comment(comment.id, comment.message, comment.created, user));
                });
                return comments;
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrive all the task's checklist
     * @param id - taskId
     * @returns {TaskDetailsModel}
     */
    getTaskChecklist(id: string): Observable<TaskDetailsModel[]> {
        return Observable.fromPromise(this.callApiTaskChecklist(id))
            .map(res => res)
            .map((response: any) => {
                let checklists: TaskDetailsModel[] = [];
                response.data.forEach((checklist) => {
                    checklists.push(new TaskDetailsModel(checklist));
                });
                return checklists;
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrive all the form shared with this user
     * @returns {TaskDetailsModel}
     */
    getFormList(): Observable<Form []> {
        let opts = {
            'filter': 'myReusableForms', // String | filter
            'sort': 'modifiedDesc', // String | sort
            'modelType': 2 // Integer | modelType
        };

        return Observable.fromPromise(this.apiService.getInstance().activiti.modelsApi.getModels(opts)).map(res => res)
            .map((response: any) => {
                let forms: Form[] = [];
                response.data.forEach((form) => {
                    forms.push(new Form(form.id, form.name));
                });
                return forms;
            }).catch(err => this.handleError(err));
    }

    attachFormToATask(taskId: string, formId: number): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.attachForm(taskId, {'formId': formId}));
    }

    /**
     * Create and return the default filters
     * @param appId
     * @returns {FilterRepresentationModel[]}
     */
    createDefaultFilter(appId: string): FilterRepresentationModel[] {
        let filters: FilterRepresentationModel[] = [];

        let involvedTasksFilter = this.getInvolvedTasksFilterInstance(appId);
        this.addFilter(involvedTasksFilter);
        filters.push(involvedTasksFilter);

        let myTasksFilter = this.getMyTasksFilterInstance(appId);
        this.addFilter(myTasksFilter);
        filters.push(myTasksFilter);

        let queuedTasksFilter = this.getQueuedTasksFilterInstance(appId);
        this.addFilter(queuedTasksFilter);
        filters.push(queuedTasksFilter);

        let completedTasksFilter = this.getCompletedTasksFilterInstance(appId);
        this.addFilter(completedTasksFilter);
        filters.push(completedTasksFilter);

        return filters;
    }

    /**
     * Add a task
     * @param task - TaskDetailsModel
     * @returns {TaskDetailsModel}
     */
    addTask(task: TaskDetailsModel): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.callApiAddTask(task))
            .map(res => res)
            .map((response: TaskDetailsModel) => {
                return new TaskDetailsModel(response);
            }).catch(err => this.handleError(err));
    }

    /**
     * Add a filter
     * @param filter - FilterRepresentationModel
     * @returns {FilterRepresentationModel}
     */
    addFilter(filter: FilterRepresentationModel): Observable<FilterRepresentationModel> {
        return Observable.fromPromise(this.callApiAddFilter(filter))
            .map(res => res)
            .map((response: FilterRepresentationModel) => {
                return response;
            }).catch(err => this.handleError(err));
    }

    /**
     * Add a comment to a task
     * @param id - taskId
     * @param message - content of the comment
     * @returns {Comment}
     */
    addTaskComment(id: string, message: string): Observable<Comment> {
        return Observable.fromPromise(this.callApiAddTaskComment(id, message))
            .map(res => res)
            .map((response: Comment) => {
                return new Comment(response.id, response.message, response.created, response.createdBy);
            }).catch(err => this.handleError(err));

    }

    /**
     * Make the task completed
     * @param id - taskId
     * @returns {TaskDetailsModel}
     */
    completeTask(id: string) {
        return Observable.fromPromise(this.callApiCompleteTask(id))
            .map(res => res);
    }

    /**
     * Return the total number of the tasks by filter
     * @param requestNode - TaskFilterRepresentationModel
     * @returns {any}
     */
    public getTotalTasks(requestNode: TaskQueryRequestRepresentationModel): Observable<any> {
        requestNode.size = 0;
        return Observable.fromPromise(this.callApiTasksFiltered(requestNode))
            .map((res: any) => {
                return res;
            }).catch(err => this.handleError(err));
    }

    /**
     * Create a new standalone task
     * @param task - TaskDetailsModel
     * @returns {TaskDetailsModel}
     */
    createNewTask(task: TaskDetailsModel): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.callApiCreateTask(task))
            .map(res => res)
            .map((response: TaskDetailsModel) => {
                return new TaskDetailsModel(response);
            }).catch(err => this.handleError(err));
    }

    /**
     * Claim a task
     * @param id - taskId
     */
    claimTask(taskId: string): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.claimTask(taskId))
            .catch(err => this.handleError(err));
    }

    private callApiTasksFiltered(requestNode: TaskQueryRequestRepresentationModel) {
        return this.apiService.getInstance().activiti.taskApi.listTasks(requestNode);
    }

    callApiTaskFilters(appId?: string) {
        if (appId) {
            return this.apiService.getInstance().activiti.userFiltersApi.getUserTaskFilters({appId: appId});
        } else {
            return this.apiService.getInstance().activiti.userFiltersApi.getUserTaskFilters();
        }
    }

    private callApiTaskDetails(id: string) {
        return this.apiService.getInstance().activiti.taskApi.getTask(id);
    }

    private callApiTaskComments(id: string) {
        return this.apiService.getInstance().activiti.taskApi.getTaskComments(id);
    }

    private callApiAddTaskComment(id: string, message: string) {
        return this.apiService.getInstance().activiti.taskApi.addTaskComment({message: message}, id);
    }

    private callApiAddTask(task: TaskDetailsModel) {
        return this.apiService.getInstance().activiti.taskApi.addSubtask(task.parentTaskId, task);
    }

    private callApiAddFilter(filter: FilterRepresentationModel) {
        return this.apiService.getInstance().activiti.userFiltersApi.createUserTaskFilter(filter);
    }

    private callApiTaskChecklist(id: string) {
        return this.apiService.getInstance().activiti.taskApi.getChecklist(id);
    }

    private callApiCompleteTask(id: string) {
        return this.apiService.getInstance().activiti.taskApi.completeTask(id);
    }

    private callApiCreateTask(task: TaskDetailsModel) {
        return this.apiService.getInstance().activiti.taskApi.createNewTask(task);
    }

    private handleError(error: any) {
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }

    /**
     * Return a static Involved filter instance
     * @param appId
     * @returns {FilterRepresentationModel}
     */
    getInvolvedTasksFilterInstance(appId: string): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'Involved Tasks',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-align-left',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'involved'}
        });
    }

    /**
     * Return a static My task filter instance
     * @param appId
     * @returns {FilterRepresentationModel}
     */
    getMyTasksFilterInstance(appId: string): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'My Tasks',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-inbox',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'assignee'}
        });
    }

    /**
     * Return a static Queued filter instance
     * @param appId
     * @returns {FilterRepresentationModel}
     */
    getQueuedTasksFilterInstance(appId: string): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'Queued Tasks',
            'appId': appId,
            'recent': false,
            'icon': 'glyphicon-record',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'candidate'}
        });
    }

    /**
     * Return a static Completed filter instance
     * @param appId
     * @returns {FilterRepresentationModel}
     */
    getCompletedTasksFilterInstance(appId: string): FilterRepresentationModel {
        return new FilterRepresentationModel({
            'name': 'Completed Tasks',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-ok-sign',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'completed', 'assignment': 'involved'}
        });
    }
}
