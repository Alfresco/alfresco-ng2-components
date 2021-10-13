import { CardViewArrayItem } from '@alfresco/adf-core';
import { Observable, Subject } from 'rxjs';
import { ProcessDefinitionCloud } from '../../models/process-definition-cloud.model';
import { TaskPriorityOption } from '../models/task.model';
import { StartTaskCloudRequestModel } from '../start-task/models/start-task-cloud-request.model';
import { TaskDetailsCloudModel } from '../start-task/models/task-details-cloud.model';
export interface TaskCloudInterface {

    dataChangesDetected$: Subject<unknown>;
    priorities: TaskPriorityOption[];

    completeTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel>;
    canCompleteTask(taskDetails: TaskDetailsCloudModel): boolean;
    isTaskEditable(taskDetails: TaskDetailsCloudModel): boolean;
    isAssigneePropertyClickable(taskDetails: TaskDetailsCloudModel, candidateUsers: CardViewArrayItem[], candidateGroups: CardViewArrayItem[]): boolean;
    canClaimTask(taskDetails: TaskDetailsCloudModel): boolean;
    canUnclaimTask(taskDetails: TaskDetailsCloudModel): boolean;
    claimTask(appName: string, taskId: string, assignee: string): Observable<TaskDetailsCloudModel>;
    unclaimTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel>;
    getTaskById(appName: string, taskId: string): Observable<TaskDetailsCloudModel>;
    createNewTask(startTaskRequest: StartTaskCloudRequestModel, appName: string): Observable<TaskDetailsCloudModel>;
    updateTask(appName: string, taskId: string, payload: any): Observable<TaskDetailsCloudModel>;
    getCandidateUsers(appName: string, taskId: string): Observable<string[]>;
    getCandidateGroups(appName: string, taskId: string): Observable<string[]>;
    getProcessDefinitions(appName: string): Observable<ProcessDefinitionCloud[]>;
    assign(appName: string, taskId: string, assignee: string): Observable<TaskDetailsCloudModel>;
    getPriorityLabel(priority: number): string;
}
