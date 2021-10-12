import { Injectable } from '@angular/core';
import { AppConfigService, CardViewArrayItem, LogService } from '@alfresco/adf-core';
import { from, Observable, of, Subject, throwError } from 'rxjs';
import { DEFAULT_TASK_PRIORITIES, TaskPriorityOption, TASK_ASSIGNED_STATE, TASK_CREATED_STATE } from '../models/task.model';
import { TaskDetailsCloudModel } from '../start-task/public-api';
import { taskDetailsContainer } from '../task-header/mocks/task-details-cloud.mock';
import { TaskCloudInterface } from './task-cloud.interface';
import { ProcessDefinitionCloud } from '../../models/process-definition-cloud.model';
import { StartTaskCloudRequestModel } from '../start-task/models/start-task-cloud-request.model';

@Injectable({
    providedIn: 'root'
})
export class TaskCloudServiceMock implements TaskCloudInterface {

    currentUserMock = 'AssignedTaskUser';
    dataChangesDetected$ = new Subject();

    constructor(private appConfigService: AppConfigService, private logService: LogService) { }

    getTaskById(_appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        return of(taskDetailsContainer[taskId]);
    }

    getCandidateUsers(_appName: string, taskId: string): Observable<string[]> {
        if (taskId === 'mock-no-candidate-users') {
            return of([]);
        }
        return of(['user1', 'user2']);
    }

    getCandidateGroups(_appName: string, taskId: string): Observable<string[]> {
        if (taskId === 'mock-no-candidate-groups') {
            return of([]);
        }
        return of(['group1', 'group2']);
    }

    getPriorityLabel(priority: number): string {
        const priorityItem = this.priorities.find((item) => item.value === priority.toString()) || this.priorities[0];
        return priorityItem.label;
    }

    get priorities(): TaskPriorityOption[] {
        return this.appConfigService.get('adf-cloud-priority-values') || DEFAULT_TASK_PRIORITIES;
    }

    isTaskEditable(taskDetails: TaskDetailsCloudModel) {
        return taskDetails.status === TASK_ASSIGNED_STATE && this.isAssignedToMe(taskDetails.assignee);
    }

    isAssigneePropertyClickable(taskDetails: TaskDetailsCloudModel, candidateUsers: CardViewArrayItem[], candidateGroups: CardViewArrayItem[]): boolean {
        let isClickable = false;
        const states = [TASK_ASSIGNED_STATE];
        if (candidateUsers?.length || candidateGroups?.length) {
            isClickable = states.includes(taskDetails.status);
        }
        return isClickable;
    }

    updateTask(_appName: string, taskId: string, _payload: any): Observable<TaskDetailsCloudModel> {
        return of(taskDetailsContainer[taskId]);
    }

    canCompleteTask(taskDetails: TaskDetailsCloudModel): boolean {
        return taskDetails && taskDetails.status === TASK_ASSIGNED_STATE && this.isAssignedToMe(taskDetails.assignee);
    }

    canClaimTask(taskDetails: TaskDetailsCloudModel): boolean {
        return taskDetails && taskDetails.status === TASK_CREATED_STATE;
    }

    private isAssignedToMe(assignee: string): boolean {
        if (assignee === this.currentUserMock) {
            return true;
        }

        return false;
    }

    completeTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        if ((appName || appName === '') && taskId) {
            window.alert('Complete task mock');

            return from([]);
        } else {
            this.logService.error('AppName and TaskId are mandatory for complete a task');
            return throwError('AppName/TaskId not configured');
        }
    }

    canUnclaimTask(taskDetails: TaskDetailsCloudModel): boolean {
        const currentUser = this.currentUserMock;
        return taskDetails && taskDetails.status === TASK_ASSIGNED_STATE && taskDetails.assignee === currentUser;
    }

    claimTask(appName: string, taskId: string, _assignee: string): Observable<TaskDetailsCloudModel> {
        if ((appName || appName === '') && taskId) {
            window.alert('Claim task mock');

            return from([]);
        } else {
            this.logService.error('AppName and TaskId are mandatory for querying a task');
            return throwError('AppName/TaskId not configured');
        }
    }

    unclaimTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        if ((appName || appName === '') && taskId) {
            window.alert('Unclaim task mock');

            return from([]);
        } else {
            this.logService.error('AppName and TaskId are mandatory for querying a task');
            return throwError('AppName/TaskId not configured');
        }
    }
    createNewTask(_startTaskRequest: StartTaskCloudRequestModel, _appName: string): Observable<TaskDetailsCloudModel> {
        window.alert('Create new task mock');

        return from([]);
    }

    getProcessDefinitions(appName: string): Observable<ProcessDefinitionCloud[]> {
        if (appName || appName === '') {
            window.alert('Get process definitions mock');

            return from([]);
        } else {
            this.logService.error('AppName is mandatory for querying task');
            return throwError('AppName not configured');
        }
    }

    assign(appName: string, taskId: string, _assignee: string): Observable<TaskDetailsCloudModel> {
        if (appName && taskId) {
            window.alert('Assign mock');

            return from([]);
        } else {
            this.logService.error('AppName and TaskId are mandatory to change/update the task assignee');
            return throwError('AppName/TaskId not configured');
        }
    }
}
