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
import { AlfrescoApiService, LogService } from 'ng2-alfresco-core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Comment } from '../models/comment.model';
import {
    FilterRepresentationModel,
    TaskQueryRequestRepresentationModel
} from '../models/filter.model';
import { Form } from '../models/form.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListModel } from '../models/task-list.model';
import { User } from '../models/user.model';

@Injectable()
export class TaskListService {
    private tasksListSubject = new BehaviorSubject(
        {
            size: 0,
            total: 0,
            start: 0,
            length: 0,
            data: []
        }
    );

    public tasksList$: Observable<TaskListModel> = this.tasksListSubject.asObservable();

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Retrieve all the Deployed app
     * @returns {Observable<any>}
     */
    getDeployedApplications(name?: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.appsApi.getAppDefinitions())
            .map((response: any) => {
                if (name) {
                    return response.data.find(app => app.name === name);
                }
                return response.data;
            })
            .catch(err => this.handleError(err));
    }

    /**
     * Retrieve Deployed App details by appId
     * @returns {Observable<any>}
     */
    getApplicationDetailsById(appId: number): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.appsApi.getAppDefinitions())
            .map((response: any) => {
                return response.data.find(app => app.id === appId);
            })
            .catch(err => this.handleError(err));
    }

    /**
     * Retrieve all the Tasks filters
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
                return filters;
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrieve the Tasks filter by id
     * @param filterId - number - The id of the filter
     * @param appId - string - optional - The id of app
     * @returns {Observable<FilterRepresentationModel>}
     */
    getTaskFilterById(filterId: number, appId?: string): Observable<FilterRepresentationModel> {
        return Observable.fromPromise(this.callApiTaskFilters(appId))
            .map((response: any) => {
                return response.data.find(filter => filter.id === filterId);
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrieve the Tasks filter by name
     * @param taskName - string - The name of the filter
     * @returns {Observable<FilterRepresentationModel>}
     */
    getTaskFilterByName(taskName: string, appId?: string): Observable<FilterRepresentationModel> {
        return Observable.fromPromise(this.callApiTaskFilters(appId))
            .map((response: any) => {
                return response.data.find(filter => filter.name === taskName);
            }).catch(err => this.handleError(err));
    }

    /**
     * Return all the filters in the list where the task id belong
     * @param taskId - string
     * @param filter - FilterRepresentationModel []
     * @returns {FilterRepresentationModel}
     */
    getFilterForTaskById(taskId: string, filterList: FilterRepresentationModel[]): Observable<FilterRepresentationModel> {
        return Observable.from(filterList)
            .flatMap((filter: FilterRepresentationModel) => this.isTaskRelatedToFilter(taskId, filter))
            .filter((filter: FilterRepresentationModel) => filter != null);
    }

    /**
     * Return the search node for query task based on the given filter
     * @param filter - FilterRepresentationModel
     * @returns {TaskQueryRequestRepresentationModel}
     */
    private generateTaskRequestNodeFromFilter(filter: FilterRepresentationModel): TaskQueryRequestRepresentationModel {
        let requestNode = {
            appDefinitionId: filter.appId,
            processDefinitionKey: filter.filter.processDefinitionKey,
            assignment: filter.filter.assignment,
            state: filter.filter.state,
            sort: filter.filter.sort
        };
        return new TaskQueryRequestRepresentationModel(requestNode);
    }

    /**
     * Check if a taskId is filtered with the given filter
     * @param taskId - string
     * @param filter - FilterRepresentationModel
     * @returns {FilterRepresentationModel}
     */
    isTaskRelatedToFilter(taskId: string, filter: FilterRepresentationModel): Observable<FilterRepresentationModel> {
        let requestNodeForFilter = this.generateTaskRequestNodeFromFilter(filter);
        return Observable.fromPromise(this.callApiTasksFiltered(requestNodeForFilter))
            .map((res: any) => {
                return res.data.find(element => element.id === taskId) ? filter : null;
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrieve all the tasks filtered by filterModel
     * @param filter - TaskFilterRepresentationModel
     * @returns {any}
     */
    getTasks(requestNode: TaskQueryRequestRepresentationModel): Observable<TaskListModel> {
        return Observable.fromPromise(this.callApiTasksFiltered(requestNode))
            .map((res: any) => {
                this.tasksListSubject.next(res);
            }).catch(err => this.handleError(err));
    }

    /**
     * Retrieve tasks filtered by filterModel and state
     * @param filter - TaskFilterRepresentationModel
     * @returns {any}
     */
    findTasksByState(requestNode: TaskQueryRequestRepresentationModel, state?: string): Observable<TaskListModel> {
        if (state) {
            requestNode.state = state;
        }
        return this.getTasks(requestNode);
    }

    /**
     * Retrieve all tasks filtered by filterModel and state
     * @param filter - TaskFilterRepresentationModel
     * @returns {any}
     */
    findAllTaskByState(requestNode: TaskQueryRequestRepresentationModel, state?: string): Observable<TaskListModel> {
        if (state) {
            requestNode.state = state;
        }
        return this.getTotalTasks(requestNode).
        switchMap((res: any) => {
            requestNode.size = res.total;
            return this.getTasks(requestNode);
        });
    }

    /**
     * Retrieve all tasks filtered by filterModel irrespective of state
     * @param filter - TaskFilterRepresentationModel
     * @returns {any}
     */
    findAllTasksWhitoutState(requestNode: TaskQueryRequestRepresentationModel): Observable<TaskListModel> {
        return Observable.forkJoin(
                this.findTasksByState(requestNode, 'open'),
                this.findAllTaskByState(requestNode, 'completed'),
                (activeTasks: TaskListModel, completedTasks: TaskListModel) => {
                    const tasks = activeTasks;
                    tasks.total += completedTasks.total;
                    tasks.data.concat(completedTasks.data);
                    return tasks;
                }
            );
    }

    /**
     * Retrieve all the task details
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
     * Retrieve all the task's comments
     * @param id - taskId
     * @returns {<Comment[]>}
     */
    getComments(id: string): Observable<Comment[]> {
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
     * Retrieve all the task's checklist
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
     * Retrieve all the form shared with this user
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
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.attachForm(taskId, { 'formId': formId }));
    }

    /**
     * Create and return the default filters
     * @param appId
     * @returns {FilterRepresentationModel[]}
     */
    public createDefaultFilters(appId: string): Observable<FilterRepresentationModel[]> {
        let involvedTasksFilter = this.getInvolvedTasksFilterInstance(appId);
        let involvedObservable = this.addFilter(involvedTasksFilter);

        let myTasksFilter = this.getMyTasksFilterInstance(appId);
        let myTaskObservable = this.addFilter(myTasksFilter);

        let queuedTasksFilter = this.getQueuedTasksFilterInstance(appId);
        let queuedObservable = this.addFilter(queuedTasksFilter);

        let completedTasksFilter = this.getCompletedTasksFilterInstance(appId);
        let completeObservable = this.addFilter(completedTasksFilter);

        return Observable.create(observer => {
            Observable.forkJoin(
                involvedObservable,
                myTaskObservable,
                queuedObservable,
                completeObservable
            ).subscribe(
                (res) => {
                    let filters: FilterRepresentationModel[] = [];
                    res.forEach((filter) => {
                        if (filter.name === involvedTasksFilter.name) {
                            filters.push(involvedTasksFilter);
                        } else if (filter.name === myTasksFilter.name) {
                            filters.push(myTasksFilter);
                        } else if (filter.name === queuedTasksFilter.name) {
                            filters.push(queuedTasksFilter);
                        } else if (filter.name === completedTasksFilter.name) {
                            filters.push(completedTasksFilter);
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
     * Delete a task
     * @param taskId - string
     */
    deleteTask(taskId: string): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.callApiDeleteTask(taskId))
            .catch(err => this.handleError(err));
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
    addComment(id: string, message: string): Observable<Comment> {
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
     * Assign task to user/group
     * @param taskId - string
     * @param requestNode - any
     * @returns {TaskDetailsModel}
     */
    assignTask(taskId: string, requestNode: any): Observable<TaskDetailsModel> {
        let assignee = {assignee: requestNode.id} ;
        return Observable.fromPromise(this.callApiAssignTask(taskId, assignee))
            .map(res => res)
            .map((response: TaskDetailsModel) => {
                return new TaskDetailsModel(response);
            }).catch(err => this.handleError(err));
    }

    assignTaskByUserId(taskId: string, userId: number): Observable<TaskDetailsModel> {
        let assignee = {assignee: userId} ;
        return Observable.fromPromise(this.callApiAssignTask(taskId, assignee))
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

    /**
     * Update due date
     * @param dueDate - the new due date
     */
    updateTask(taskId: any, updated): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.updateTask(taskId, updated))
            .catch(err => this.handleError(err));
    }

    /**
     * fetch the Task Audit information as a pdf
     * @param taskId - the task id
     */
    fetchTaskAuditPdfById(taskId: string): Observable<Blob> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.getTaskAuditPdf(taskId))
            .catch(err => this.handleError(err));
    }

    /**
     * fetch the Task Audit information in a json format
     * @param taskId - the task id
     */
    fetchTaskAuditJsonById(taskId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.getTaskAuditJson(taskId))
            .catch(err => this.handleError(err));
    }

    private callApiTasksFiltered(requestNode: TaskQueryRequestRepresentationModel) {
        return this.apiService.getInstance().activiti.taskApi.listTasks(requestNode);
    }

    callApiTaskFilters(appId?: string) {
        if (appId) {
            return this.apiService.getInstance().activiti.userFiltersApi.getUserTaskFilters({ appId: appId });
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
        return this.apiService.getInstance().activiti.taskApi.addTaskComment({ message: message }, id);
    }

    private callApiAddTask(task: TaskDetailsModel) {
        return this.apiService.getInstance().activiti.taskApi.addSubtask(task.parentTaskId, task);
    }

    private callApiDeleteTask(taskId: string) {
        return this.apiService.getInstance().activiti.taskApi.deleteTask(taskId);
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
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'involved' }
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
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'assignee' }
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
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'open', 'assignment': 'candidate' }
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
            'filter': { 'sort': 'created-desc', 'name': '', 'state': 'completed', 'assignment': 'involved' }
        });
    }

    private callApiAssignTask(taskId: string, requestNode: any) {
        return this.apiService.getInstance().activiti.taskApi.assignTask(taskId, requestNode);
    }
}
