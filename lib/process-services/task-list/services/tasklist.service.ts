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
import { Subject } from 'rxjs/Subject';
import { FilterRepresentationModel, TaskQueryRequestRepresentationModel } from '../models/filter.model';
import { Form } from '../models/form.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListModel } from '../models/task-list.model';
import 'rxjs/add/observable/throw';

@Injectable()
export class TaskListService {
    private tasksListSubject = new Subject<TaskListModel>();

    public tasksList$: Observable<TaskListModel>;

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
        this.tasksList$ = this.tasksListSubject.asObservable();
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
                return res;
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
        return this.getTotalTasks(requestNode).switchMap((res: any) => {
            requestNode.size = res.total;
            return this.getTasks(requestNode);
        });
    }

    /**
     * Retrieve all tasks filtered by filterModel irrespective of state
     * @param filter - TaskFilterRepresentationModel
     * @returns {any}
     */
    findAllTasksWithoutState(requestNode: TaskQueryRequestRepresentationModel): Observable<TaskListModel> {
        return Observable.forkJoin(
                this.findTasksByState(requestNode, 'open'),
                this.findAllTaskByState(requestNode, 'completed'),
                (activeTasks: TaskListModel, completedTasks: TaskListModel) => {
                    const tasks = Object.assign({}, activeTasks);
                    tasks.total += completedTasks.total;
                    tasks.data = tasks.data.concat(completedTasks.data);
                    this.tasksListSubject.next(tasks);
                    return tasks;
                }
            );
    }

    /**
     * Retrieve all the task details
     * @param id - taskId
     * @returns {<TaskDetailsModel>}
     */
    getTaskDetails(taskId: string): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.callApiTaskDetails(taskId))
            .map(res => res)
            .map((details: any) => {
                return new TaskDetailsModel(details);
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
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.attachForm(taskId, {'formId': formId})).catch(err => this.handleError(err));
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
     * Make the task completed
     * @param id - taskId
     * @returns {TaskDetailsModel}
     */
    completeTask(taskId: string) {
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.completeTask(taskId))
            .map(res => res)
            .catch(err => this.handleError(err));
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
        let assignee = {assignee: requestNode.id};
        return Observable.fromPromise(this.callApiAssignTask(taskId, assignee))
            .map(res => res)
            .map((response: TaskDetailsModel) => {
                return new TaskDetailsModel(response);
            }).catch(err => this.handleError(err));
    }

    assignTaskByUserId(taskId: string, userId: number): Observable<TaskDetailsModel> {
        let assignee = {assignee: userId};
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
     * Unclaim a task
     * @param id - taskId
     */
    unclaimTask(taskId: string): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.taskApi.unclaimTask(taskId))
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

    private callApiTaskDetails(taskId: string) {
        return this.apiService.getInstance().activiti.taskApi.getTask(taskId);
    }

    private callApiAddTask(task: TaskDetailsModel) {
        return this.apiService.getInstance().activiti.taskApi.addSubtask(task.parentTaskId, task);
    }

    private callApiDeleteTask(taskId: string) {
        return this.apiService.getInstance().activiti.taskApi.deleteTask(taskId);
    }

    private callApiTaskChecklist(taskId: string) {
        return this.apiService.getInstance().activiti.taskApi.getChecklist(taskId);
    }

    private callApiCreateTask(task: TaskDetailsModel) {
        return this.apiService.getInstance().activiti.taskApi.createNewTask(task);
    }

    private callApiAssignTask(taskId: string, requestNode: any) {
        return this.apiService.getInstance().activiti.taskApi.assignTask(taskId, requestNode);
    }

    private handleError(error: any) {
        this.logService.error(error);
        this.tasksListSubject.error(error);
        return Observable.throw(error || 'Server error');
    }

}
