import { Injectable } from '@angular/core';
import {
    AlfrescoApiService,
    AppConfigService,
    LogService
} from '@alfresco/adf-core';
import { from, Observable, throwError } from 'rxjs';
import { StartTaskCloudRequestModel } from '../models/start-task-cloud-request.model';
import { TaskDetailsCloudModel } from '../models/task-details-cloud.model';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class StartTaskCloudService {

    constructor(
        private apiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private logService: LogService
    ) {}

    createNewTask(taskDetails: TaskDetailsCloudModel): Observable<TaskDetailsCloudModel> {
        let queryUrl = this.buildCreateTaskUrl(taskDetails.appName);
        const bodyParam = JSON.stringify(this.buildRequestBody(taskDetails));
        const httpMethod = 'POST', pathParams = {}, queryParams = {}, headerParams = {},
            formParams = {}, authNames = [], contentTypes = ['application/json'], accepts = ['application/json'];

        return from(
            this.apiService
                .getInstance()
                .oauth2Auth.callCustomApi(
                    queryUrl, httpMethod, pathParams, queryParams,
                    headerParams, formParams, bodyParam, authNames,
                    contentTypes, accepts, [], '')
                ).pipe(
                    map((response: TaskDetailsCloudModel) => {
                        return new TaskDetailsCloudModel(response);
                    }),
                    catchError(err => this.handleError(err))
                );
    }

    private buildCreateTaskUrl(appName: string): any {
        return `${this.appConfigService.get('bpmHost')}/${appName}-rb/v1/tasks`;
    }

    private buildRequestBody(taskDetails: any) {
        return new StartTaskCloudRequestModel(taskDetails);
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
