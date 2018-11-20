
import { Injectable } from '@angular/core';
import {
    AlfrescoApiService,
    AppConfigService
} from '@alfresco/adf-core';

import { from, Observable, throwError } from 'rxjs';
import { StartTaskCloudRequestModel } from './start-task-cloud-request.model';
import { TaskDetailsCloudModel, StartTaskCloudResponseModel } from './task-details-cloud.model';
import { map, catchError } from 'rxjs/operators';
@Injectable()
export class StartTaskCloudService {
    constructor(
    ) {}

    // new TaskDetailsCloudModel(newTask)

    apiService = new AlfrescoApiService();
    appConfigService: AppConfigService;

    createNewTask() {
        let queryUrl = 'aps2dev.envalfresco.com/simple-app-rb/v1/tasks';
        const bodyParam = {
            'name': "bliiiiiii",
            "payloadType":"CreateTaskPayload"
        };

        const httpMethod = 'POST', pathParams = {}, queryParams = {}, headerParams = {},
            formParams = {}, authNames = [], contentTypes = ['application/json'], accepts = ['application/json'];
        return from(
            this.apiService
                .getInstance()
                .oauth2Auth.callCustomApi(
                queryUrl, httpMethod, pathParams, queryParams,
                headerParams, formParams, bodyParam, authNames,
                contentTypes, accepts, Object, null, null)
        ).pipe(
            map((response: StartTaskCloudResponseModel) => {
                return new TaskDetailsCloudModel(response.entry);
            }),
            catchError(err => console.log("Error: ", err))
        );
    }


    private buildCreateTaskUrl(appName: string): any {
        return `${this.appConfigService.get('bpmHost')}/${appName}-rb/v1/tasks`;
    }
    private buildRequestBody(taskDetails: any) {
        return new StartTaskCloudRequestModel(taskDetails);
    }
}
