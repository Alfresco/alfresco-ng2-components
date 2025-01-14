/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError, flatMap, filter } from 'rxjs/operators';
import { Form } from '../models/form.model';
import {
    TaskUpdateRepresentation,
    ModelsApi,
    TaskActionsApi,
    TasksApi,
    ChecklistsApi,
    ResultListDataRepresentationTaskRepresentation,
    TaskQueryRepresentation,
    UserTaskFilterRepresentation,
    TaskRepresentation
} from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-content-services';

@Injectable({
    providedIn: 'root'
})
export class TaskListService {
    protected apiService = inject(AlfrescoApiService);

    private _modelsApi: ModelsApi;
    get modelsApi(): ModelsApi {
        this._modelsApi = this._modelsApi ?? new ModelsApi(this.apiService.getInstance());
        return this._modelsApi;
    }

    private _tasksApi: TasksApi;
    get tasksApi(): TasksApi {
        this._tasksApi = this._tasksApi ?? new TasksApi(this.apiService.getInstance());
        return this._tasksApi;
    }

    private _taskActionsApi: TaskActionsApi;
    get taskActionsApi(): TaskActionsApi {
        this._taskActionsApi = this._taskActionsApi ?? new TaskActionsApi(this.apiService.getInstance());
        return this._taskActionsApi;
    }

    private _checklistsApi: ChecklistsApi;
    get checklistsApi(): ChecklistsApi {
        this._checklistsApi = this._checklistsApi ?? new ChecklistsApi(this.apiService.getInstance());
        return this._checklistsApi;
    }

    /**
     * Gets all the filters in the list that belong to a task.
     *
     * @param taskId ID of the target task
     * @param filterList List of filters to search through
     * @returns Filters belonging to the task
     */
    getFilterForTaskById(taskId: string, filterList: UserTaskFilterRepresentation[]): Observable<UserTaskFilterRepresentation> {
        return from(filterList).pipe(
            flatMap((data) => this.isTaskRelatedToFilter(taskId, data)),
            filter((data) => data != null)
        );
    }

    /**
     * Checks if a taskId is filtered with the given filter.
     *
     * @param taskId ID of the target task
     * @param filterModel The filter you want to check
     * @returns The filter if it is related or null otherwise
     */
    isTaskRelatedToFilter(taskId: string, filterModel: UserTaskFilterRepresentation): Observable<UserTaskFilterRepresentation> {
        const requestNodeForFilter = new TaskQueryRepresentation({
            appDefinitionId: filterModel.appId,
            assignment: filterModel.filter.assignment,
            state: filterModel.filter.state,
            sort: filterModel.filter.sort
        });
        return from(this.tasksApi.listTasks(requestNodeForFilter)).pipe(
            map((res) => (res.data.find((element) => element.id === taskId) ? filterModel : null))
        );
    }

    /**
     * Gets all the tasks matching the supplied query.
     *
     * @param requestNode Query to search for tasks
     * @returns List of tasks
     */
    getTasks(requestNode: TaskQueryRepresentation): Observable<ResultListDataRepresentationTaskRepresentation> {
        return from(this.tasksApi.listTasks(requestNode));
    }

    /**
     * Gets tasks matching a query and state value.
     *
     * @param requestNode Query to search for tasks
     * @returns List of tasks
     */
    findTasksByState(requestNode: TaskQueryRepresentation): Observable<ResultListDataRepresentationTaskRepresentation> {
        return this.getTasks(requestNode).pipe(catchError(() => of(new ResultListDataRepresentationTaskRepresentation({ data: [] }))));
    }

    /**
     * Gets details for a task.
     *
     * @param taskId ID of the target task.
     * @returns Task details
     */
    getTaskDetails(taskId: string): Observable<TaskRepresentation> {
        return from(this.tasksApi.getTask(taskId));
    }

    /**
     * Gets the checklist for a task.
     *
     * @param id ID of the target task
     * @returns Array of checklist task details
     */
    getTaskChecklist(id: string): Observable<TaskRepresentation[]> {
        return from(this.checklistsApi.getChecklist(id)).pipe(map((response) => response.data));
    }

    /**
     * Gets all available reusable forms.
     *
     * @returns Array of form details
     */
    getFormList(): Observable<Form[]> {
        const opts = {
            filter: 'myReusableForms', // String | filter
            sort: 'modifiedDesc', // String | sort
            modelType: 2 // Integer | modelType
        };

        return from(this.modelsApi.getModels(opts)).pipe(map((response) => response.data.map((form) => new Form(form.id, form.name))));
    }

    /**
     * Attaches a form to a task.
     *
     * @param taskId ID of the target task
     * @param formId ID of the form to add
     * @returns Null response notifying when the operation is complete
     */
    attachFormToATask(taskId: string, formId: number): Observable<any> {
        return from(this.taskActionsApi.attachForm(taskId, { formId }));
    }

    /**
     * Adds a subtask (ie, a checklist task) to a parent task.
     *
     * @param task The task to add
     * @returns The subtask that was added
     */
    addTask(task: TaskRepresentation): Observable<TaskRepresentation> {
        return from(this.checklistsApi.addSubtask(task.parentTaskId, task));
    }

    /**
     * Deletes a subtask (ie, a checklist task) from a parent task.
     *
     * @param taskId The task to delete
     * @returns Null response notifying when the operation is complete
     */
    deleteTask(taskId: string): Observable<any> {
        return from(this.tasksApi.deleteTask(taskId));
    }

    /**
     * Deletes a form from a task.
     *
     * @param taskId Task id related to form
     * @returns Null response notifying when the operation is complete
     */
    deleteForm(taskId: string): Observable<any> {
        return from(this.taskActionsApi.removeForm(taskId));
    }

    /**
     * Gives completed status to a task.
     *
     * @param taskId ID of the target task
     * @returns Null response notifying when the operation is complete
     */
    completeTask(taskId: string) {
        return from(this.taskActionsApi.completeTask(taskId));
    }

    /**
     * Creates a new standalone task.
     *
     * @param task Details of the new task
     * @returns Details of the newly created task
     */
    createNewTask(task: TaskRepresentation): Observable<TaskRepresentation> {
        return from(this.tasksApi.createNewTask(task));
    }

    /**
     * Assigns a task to a user or group.
     *
     * @param taskId The task to assign
     * @param requestNode User or group to assign the task to
     * @returns Details of the assigned task
     */
    assignTask(taskId: string, requestNode: any): Observable<TaskRepresentation> {
        const assignee = { assignee: requestNode.id };
        return from(this.taskActionsApi.assignTask(taskId, assignee));
    }

    /**
     * Assigns a task to a user.
     *
     * @param taskId ID of the task to assign
     * @param userId ID of the user to assign the task to
     * @returns Details of the assigned task
     */
    assignTaskByUserId(taskId: string, userId: string): Observable<TaskRepresentation> {
        const assignee = { assignee: userId };

        return from(this.taskActionsApi.assignTask(taskId, assignee));
    }

    /**
     * Claims a task for the current user.
     *
     * @param taskId ID of the task to claim
     * @returns Details of the claimed task
     */
    claimTask(taskId: string): Observable<TaskRepresentation> {
        return from(this.taskActionsApi.claimTask(taskId));
    }

    /**
     * Un-claims a task for the current user.
     *
     * @param taskId ID of the task to unclaim
     * @returns Null response notifying when the operation is complete
     */
    unclaimTask(taskId: string): Observable<TaskRepresentation> {
        return from(this.taskActionsApi.unclaimTask(taskId));
    }

    /**
     * Updates the details (name, description, due date) for a task.
     *
     * @param taskId ID of the task to update
     * @param updated Data to update the task (as a `TaskUpdateRepresentation` instance).
     * @returns Updated task details
     */
    updateTask(taskId: string, updated: TaskUpdateRepresentation): Observable<TaskRepresentation> {
        return from(this.tasksApi.updateTask(taskId, updated));
    }

    /**
     * Fetches the Task Audit information in PDF format.
     *
     * @param taskId ID of the target task
     * @returns Binary PDF data
     */
    fetchTaskAuditPdfById(taskId: string): Observable<Blob> {
        return from(this.tasksApi.getTaskAuditPdf(taskId));
    }

    /**
     * Fetch the Task Audit information in JSON format
     *
     * @param taskId ID of the target task
     * @returns JSON data
     */
    fetchTaskAuditJsonById(taskId: string): Observable<any> {
        return from(this.tasksApi.getTaskAuditLog(taskId));
    }
}
