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
import {FilterModel} from '../models/filter.model';
import {FilterParamsModel} from '../models/filter.model';
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
    getDeployedApplications(name: string): Observable<any> {
        return Observable.fromPromise(this.authService.getAlfrescoApi().activiti.appsApi.getAppDefinitions())
            .map((response: any) => response.data.find(p => p.name === name))
            .do(data => console.log('Application: ' + JSON.stringify(data)));
    }

    /**
     * Retrive all the Tasks filters
     * @returns {Observable<any>}
     */
    getTaskListFilters(appId?: string): Observable<any> {
        return Observable.fromPromise(this.callApiTaskFilters(appId))
            .map((response: any) => {
                let filters: FilterModel[] = [];
                response.data.forEach((filter) => {
                    let filterModel = new FilterModel(filter.name, filter.recent, filter.icon,
                        filter.filter.name, filter.filter.state, filter.filter.assignment, appId);
                    filters.push(filterModel);
                });
                return filters;
            }).catch(this.handleError);
    }

    /**
     * Retrive all the tasks filtered by filterModel
     * @param filter - FilterParamsModel
     * @returns {any}
     */
    getTasks(filter: FilterParamsModel): Observable<any> {
        return Observable.fromPromise(this.callApiTasksFiltered(filter))
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
                    let user = new User(
                        comment.createdBy.id, comment.createdBy.email, comment.createdBy.firstName, comment.createdBy.lastName);
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
     * @param filter - FilterParamsModel
     * @returns {any}
     */
    public getTotalTasks(filter: FilterParamsModel): Observable<any> {
        filter.size = 0;
        return Observable.fromPromise(this.callApiTasksFiltered(filter))
            .map((res: any) => {
                return res;
            }).catch(this.handleError);
    }

    private callApiTasksFiltered(filter: FilterParamsModel) {
        return this.authService.getAlfrescoApi().activiti.taskApi.listTasks(filter);
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
}
