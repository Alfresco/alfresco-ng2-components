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
import { Observable } from 'rxjs/Observable';
import { FilterRepresentationModel, TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { Form } from '../models/form.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListModel } from '../models/task-list.model';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/operator/switchMap';
import 'rxjs/add/observable/from';

@Injectable()
export class TaskListService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Gets all the filters in the list that belong to a task.
     * @param taskId ID of the target task
     * @param filterList List of filters to search through
     * @returns Filters belonging to the task
     */
    getFilterForTaskById(taskId: string, filterList: FilterRepresentationModel[]): Observable<FilterRepresentationModel> {
        return Observable.from(filterList)
            .flatMap((filter: FilterRepresentationModel) => this.isTaskRelatedToFilter(taskId, filter))
            .filter((filter: FilterRepresentationModel) => filter != null);
    }

    /**
     * Gets the search query for a task based on the supplied filter.
     * @param filter The filter to use
     * @returns The search query
     */
    private generateTaskRequestNodeFromFilter(filter: FilterRepresentationModel): TaskQueryRequestRepresentationModel {
        let requestNode = {
            appDefinitionId: filter.appId,
            assignment: filter.filter.assignment,
            state: filter.filter.state,
            sort: filter.filter.sort
        };
        return new TaskQueryRequestRepresentationModel(requestNode);
    }

    /**
     * Checks if a taskId is filtered with the given filter.
     * @param taskId ID of the target task
     * @param filter The filter you want to check
     * @returns The filter if it is related or null otherwise
     */
     isTaskRelatedToFilter(taskId: string, filter: FilterRepresentationModel): Observable<FilterRepresentationModel> {
        let requestNodeForFilter = this.generateTaskRequestNodeFromFilter(filter);
        return Observable.fromPromise(this.callApiTasksFiltered(requestNodeForFilter))
            .map((res: any) => {
                return res.data.find(element => element.id === taskId) ? filter : null;
            }).catch(err => this.handleError(err));
    }

    /**
     * Gets all the tasks matching the supplied query.
     * @param requestNode Query to search for tasks
     * @returns List of tasks
     */
    getTasks(requestNode: TaskQueryRequestRepresentationModel): Observable<TaskListModel> {
        return Observable.fromPromise(this.callApiTasksFiltered(requestNode))
            .map((res: TaskListModel) => {
                return res;
            }).catch(err => this.handleError(err));
    }

    /**
     * Gets tasks matching a query and state value.
     * @param requestNode Query to search for tasks
     * @param state Task state. Can be "open" or "completed".
     * @returns List of tasks
     */
    findTasksByState(requestNode: TaskQueryRequestRepresentationModel, state?: string): Observable<TaskListModel> {
        if (state) {
            requestNode.state = state;
        }
        return this.getTasks(requestNode);
    }

    /**
     * Gets all tasks matching a query and state value.
     * @param requestNode Query to search for tasks.
     * @param state Task state. Can be "open" or "completed".
     * @returns List of tasks
     */
    findAllTaskByState(requestNode: TaskQueryRequestRepresentationModel, state?: string): Observable<TaskListModel> {
        if (state) {
            requestNode.state = state;
        }
        return this.getTotalTasks(requestNode).switchMap((res: any) => {
            requestNode.size = res.total;
            return this.getTasks(requestNode);
        });
    }

    /**
     * Gets all tasks matching the supplied query but ignoring the task state.
     * @param requestNode Query to search for tasks
     * @returns List of tasks
     */
    findAllTasksWithoutState(requestNode: TaskQueryRequestRepresentationModel): Observable<TaskListModel> {
        return Observable.forkJoin(
                this.findTasksByState(requestNode, 'open'),
                this.findAllTaskByState(requestNode, 'completed'),
                (activeTasks: TaskListModel, completedTasks: TaskListModel) => {
                    const tasks = Object.assign({}, activeTasks);
                    tasks.total += completedTasks.total;
                    tasks.data = tasks.data.concat(completedTasks.data);
                    return tasks;
                }
            );
    }

    /**
     * Gets details for a task.
     * @param taskId ID of the target task.
     * @returns Task details
     */
    getTaskDetails(taskId: string): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.callApiTaskDetails(taskId))
            .map(res => res)
            .map((details: any) => {
                return new TaskDetailsModel(details);
            }).catch(err => this.handleError(err));
    }

    /**
     * Gets the checklist for a task.
     * @param id ID of the target task
     * @returns Array of checklist task details
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
     * Gets all available reusable forms.
     * @returns Array of form details
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

    /**
     * Attaches a form to a task.
     * @param taskId ID of the target task
     * @param formId ID of the form to add
     * @returns Null response notifying when the operation is complete
     */
    attachFormToATask(taskId: string, formId: number): Observable<any> {
        return Observable.fromPromise(this.apiService.taskApi.attachForm(taskId, {'formId': formId})).catch(err => this.handleError(err));
    }

    /**
     * Adds a subtask (ie, a checklist task) to a parent task.
     * @param task The task to add
     * @returns The subtask that was added
     */
    addTask(task: TaskDetailsModel): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.callApiAddTask(task))
            .map(res => res)
            .map((response: TaskDetailsModel) => {
                return new TaskDetailsModel(response);
            }).catch(err => this.handleError(err));
    }

    /**
     * Deletes a subtask (ie, a checklist task) from a parent task.
     * @param taskId The task to delete
     * @returns Null response notifying when the operation is complete
     */
    deleteTask(taskId: string): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.callApiDeleteTask(taskId))
            .catch(err => this.handleError(err));
    }

    /**
     * Deletes a form from a task.
     * @param taskId Task id related to form
     * @returns Null response notifying when the operation is complete
     */
    deleteForm(taskId: string): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.callApiDeleteForm(taskId))
            .catch(err => this.handleError(err));
    }

    /**
     * Gives completed status to a task.
     * @param taskId ID of the target task
     * @returns Null response notifying when the operation is complete
     */
    completeTask(taskId: string) {
        return Observable.fromPromise(this.apiService.taskApi.completeTask(taskId))
            .map(res => res)
            .catch(err => this.handleError(err));
    }

    /**
     * Gets the total number of the tasks found by a query.
     * @param requestNode Query to search for tasks
     * @returns Number of tasks
     */
    public getTotalTasks(requestNode: TaskQueryRequestRepresentationModel): Observable<any> {
        requestNode.size = 0;
        return Observable.fromPromise(this.callApiTasksFiltered(requestNode))
            .map((res: any) => {
                return res;
            }).catch(err => this.handleError(err));
    }

    /**
     * Creates a new standalone task.
     * @param task Details of the new task
     * @returns Details of the newly created task
     */
    createNewTask(task: TaskDetailsModel): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.callApiCreateTask(task))
            .map(res => res)
            .map((response: TaskDetailsModel) => {
                return new TaskDetailsModel(response);
            }).catch(err => this.handleError(err));
    }

    /**
     * Assigns a task to a user or group.
     * @param taskId The task to assign
     * @param requestNode User or group to assign the task to
     * @returns Details of the assigned task
     */
    assignTask(taskId: string, requestNode: any): Observable<TaskDetailsModel> {
        let assignee = {assignee: requestNode.id};
        return Observable.fromPromise(this.callApiAssignTask(taskId, assignee))
            .map(res => res)
            .map((response: TaskDetailsModel) => {
                return new TaskDetailsModel(response);
            }).catch(err => this.handleError(err));
    }

    /**
     * Assigns a task to a user.
     * @param taskId ID of the task to assign
     * @param userId ID of the user to assign the task to
     * @returns Details of the assigned task
     */
    assignTaskByUserId(taskId: string, userId: number): Observable<TaskDetailsModel> {
        let assignee = {assignee: userId};
        return Observable.fromPromise(this.callApiAssignTask(taskId, assignee))
            .map(res => res)
            .map((response: TaskDetailsModel) => {
                return new TaskDetailsModel(response);
            }).catch(err => this.handleError(err));
    }

    /**
     * Claims a task for the current user.
     * @param taskId ID of the task to claim
     * @returns Details of the claimed task
     */
    claimTask(taskId: string): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.apiService.taskApi.claimTask(taskId))
            .catch(err => this.handleError(err));
    }

    /**
     * Unclaims a task for the current user.
     * @param taskId ID of the task to unclaim
     * @returns Null response notifying when the operation is complete
     */
    unclaimTask(taskId: string): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.apiService.taskApi.unclaimTask(taskId))
            .catch(err => this.handleError(err));
    }

    /**
     * Updates the details (name, description, due date) for a task.
     * @param taskId ID of the task to update
     * @param updated Data to update the task (as a `TaskUpdateRepresentation` instance).
     * @returns Updated task details
     */
    updateTask(taskId: any, updated): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.apiService.taskApi.updateTask(taskId, updated))
            .catch(err => this.handleError(err));
    }

    /**
     * Fetches the Task Audit information in PDF format.
     * @param taskId ID of the target task
     * @returns Binary PDF data
     */
    fetchTaskAuditPdfById(taskId: string): Observable<Blob> {
        return Observable.fromPromise(this.apiService.taskApi.getTaskAuditPdf(taskId))
            .catch(err => this.handleError(err));
    }

    /**
     * Fetch the Task Audit information in JSON format
     * @param taskId ID of the target task
     * @returns JSON data
     */
    fetchTaskAuditJsonById(taskId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.taskApi.getTaskAuditJson(taskId))
            .catch(err => this.handleError(err));
    }

    private callApiTasksFiltered(requestNode: TaskQueryRequestRepresentationModel) {
        return this.apiService.taskApi.listTasks(requestNode);
    }

    private callApiTaskDetails(taskId: string) {
        return this.apiService.taskApi.getTask(taskId);
    }

    private callApiAddTask(task: TaskDetailsModel) {
        return this.apiService.taskApi.addSubtask(task.parentTaskId, task);
    }

    private callApiDeleteTask(taskId: string) {
        return this.apiService.taskApi.deleteTask(taskId);
    }

    private callApiDeleteForm(taskId: string) {
        return this.apiService.taskApi.removeForm(taskId);
    }

    private callApiTaskChecklist(taskId: string) {
        return this.apiService.taskApi.getChecklist(taskId);
    }

    private callApiCreateTask(task: TaskDetailsModel) {
        return this.apiService.taskApi.createNewTask(task);
    }

    private callApiAssignTask(taskId: string, requestNode: any) {
        return this.apiService.taskApi.assignTask(taskId, requestNode);
    }

    private handleError(error: any) {
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }

}
