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

import {Injectable} from '@angular/core';
import {AlfrescoAuthenticationService} from 'ng2-alfresco-core';
import {Observable} from 'rxjs/Rx';
import {UserTaskFilterRepresentationModel} from '../models/filter.model';
import {TaskQueryRequestRepresentationModel} from '../models/filter.model';
import {Comment} from '../models/comment.model';
import {User} from '../models/user.model';
import {TaskDetailsModel} from '../models/task-details.model';

@Injectable()
export class ActivitiTaskListService {

    constructor(public authService: AlfrescoAuthenticationService) {
    }

    /**
     * Retrive all the Deployed app
     * @returns {Observable<any>}
     */
    getDeployedApplications(name?: string): Observable<any> {
        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.appsApi.getAppDefinitions())
            .map((response: any) => {
                if (name) {
                    return response.data.find(p => p.name === name);
                }
                return response.data;
            })
            .do(data => console.log('Application: ' + JSON.stringify(data)));
    }

    /**
     * Retrive all the Tasks filters
     * @returns {Observable<any>}
     */
    getTaskListFilters(appId?: string): Observable<any> {
        return Observable.fromPromise(this.callApiTaskFilters(appId))
            .map((response: any) => {
                let filters: UserTaskFilterRepresentationModel[] = [];
                response.data.forEach((filter: UserTaskFilterRepresentationModel) => {
                    let filterModel = new UserTaskFilterRepresentationModel(filter);
                    filters.push(filterModel);
                });
                if (response && response.data && response.data.length === 0) {
                    return this.createDefaultFilter(appId);
                }
                return filters;
            }).catch(this.handleError);
    }

    /**
     * Retrive all the tasks filtered by filterModel
     * @param filter - TaskFilterRepresentationModel
     * @returns {any}
     */
    getTasks(requestNode: TaskQueryRequestRepresentationModel): Observable<any> {
        return Observable.fromPromise(this.callApiTasksFiltered(requestNode))
            .map((res: any) => {
                return res;
            }).catch(this.handleError);
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
            }).catch(this.handleError);
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
            }).catch(this.handleError);
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
            }).catch(this.handleError);
    }

    /**
     * Create and return the default filters
     * @param appId
     * @returns {UserTaskFilterRepresentationModel[]}
     */
    createDefaultFilter(appId: string): UserTaskFilterRepresentationModel[] {
        let filters: UserTaskFilterRepresentationModel[] = [];

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
            }).catch(this.handleError);
    }

    /**
     * Add a filter
     * @param filter - UserTaskFilterRepresentationModel
     * @returns {UserTaskFilterRepresentationModel}
     */
    addFilter(filter: UserTaskFilterRepresentationModel): Observable<UserTaskFilterRepresentationModel> {
        return Observable.fromPromise(this.callApiAddFilter(filter))
            .map(res => res)
            .map((response: UserTaskFilterRepresentationModel) => {
                return response;
            }).catch(this.handleError);
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
            }).catch(this.handleError);

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
            }).catch(this.handleError);
    }

    private callApiTasksFiltered(requestNode: TaskQueryRequestRepresentationModel) {
        return this.authService.getAlfrescoApi().activiti.taskApi.listTasks(requestNode);
    }

    private callApiTaskFilters(appId?: string) {
        if (appId) {
            return this.authService.getAlfrescoApi().activiti.userFiltersApi.getUserTaskFilters({appId: appId});
        } else {
            return this.authService.getAlfrescoApi().activiti.userFiltersApi.getUserTaskFilters();
        }
    }

    private callApiTaskDetails(id: string) {
        return this.authService.getAlfrescoApi().activiti.taskApi.getTask(id);
    }

    private callApiTaskComments(id: string) {
        return this.authService.getAlfrescoApi().activiti.taskApi.getTaskComments(id);
    }

    private callApiAddTaskComment(id: string, message: string) {
        return this.authService.getAlfrescoApi().activiti.taskApi.addTaskComment({message: message}, id);
    }

    private callApiAddTask(task: TaskDetailsModel) {
        return this.authService.getAlfrescoApi().activiti.taskApi.addSubtask(task.parentTaskId, task);
    }

    private callApiAddFilter(filter: UserTaskFilterRepresentationModel) {
        return this.authService.getAlfrescoApi().activiti.userFiltersApi.createUserTaskFilter(filter);
    }

    private callApiTaskChecklist(id: string) {
        return this.authService.getAlfrescoApi().activiti.taskApi.getChecklist(id);
    }

    private callApiCompleteTask(id: string) {
        return this.authService.getAlfrescoApi().activiti.taskApi.completeTask(id);
    }

    private handleError(error: any) {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }

    /**
     * Return a static Involved filter instance
     * @param appId
     * @returns {UserTaskFilterRepresentationModel}
     */
    getInvolvedTasksFilterInstance(appId: string): UserTaskFilterRepresentationModel {
        return new UserTaskFilterRepresentationModel({
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
     * @returns {UserTaskFilterRepresentationModel}
     */
    getMyTasksFilterInstance(appId: string): UserTaskFilterRepresentationModel {
        return new UserTaskFilterRepresentationModel({
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
     * @returns {UserTaskFilterRepresentationModel}
     */
    getQueuedTasksFilterInstance(appId: string): UserTaskFilterRepresentationModel {
        return new UserTaskFilterRepresentationModel({
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
     * @returns {UserTaskFilterRepresentationModel}
     */
    getCompletedTasksFilterInstance(appId: string): UserTaskFilterRepresentationModel {
        return new UserTaskFilterRepresentationModel({
            'name': 'Completed Tasks',
            'appId': appId,
            'recent': true,
            'icon': 'glyphicon-ok-sign',
            'filter': {'sort': 'created-desc', 'name': '', 'state': 'completed', 'assignment': 'involved'}
        });
    }

}
