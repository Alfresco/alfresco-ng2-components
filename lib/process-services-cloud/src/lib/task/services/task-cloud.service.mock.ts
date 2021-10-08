import { Injectable } from "@angular/core";
import { AppConfigService } from '@alfresco/adf-core';
import { Observable, of, Subject } from "rxjs";
import { DEFAULT_TASK_PRIORITIES, TaskPriorityOption } from "../models/task.model";
import { TaskDetailsCloudModel } from "../start-task/public-api";
import { taskDetailsContainer } from "../task-header/mocks/task-details-cloud.mock";

@Injectable({
    providedIn: 'root'
})
export class TaskCloudServiceMock {
    dataChangesDetected$ = new Subject();
    TASK_ASSIGNED_STATE = 'ASSIGNED';

    getTaskById(_appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        return of(taskDetailsContainer[taskId]);
    }

    getCandidateUsers(_appName: string, taskId: string): Observable<string[]> {
        if(taskId === 'mock-no-candidate-users'){
            return of([]);
        }

        return of(['user1', 'user2']);
    }

    getCandidateGroups(_appName: string, taskId: string): Observable<string[]> {
        if(taskId === 'mock-no-candidate-groups'){
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
        return taskDetails.status === this.TASK_ASSIGNED_STATE;
    }

    isAssigneePropertyClickable = () => true;

    updateTask(_appName: string, taskId: string, _payload: any): Observable<TaskDetailsCloudModel> {
        return of(taskDetailsContainer[taskId]);
    }

    canCompleteTask = () => true;

    canClaimTask = () => true;

    constructor(private appConfigService: AppConfigService) { }
}
