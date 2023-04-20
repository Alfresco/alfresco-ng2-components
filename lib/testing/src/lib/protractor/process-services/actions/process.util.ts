/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ApplicationsUtil } from './applications.util';
import { Logger } from '../../core/utils/logger';
import { StringUtil } from '../../../shared/utils/string.util';
import { ApiService } from '../../../shared/api/api.service';
import { TasksApi, ProcessInstancesApi, TaskRepresentation, ProcessDefinitionsApi } from '@alfresco/js-api';

export class ProcessUtil {

    api: ApiService;
    processInstancesApi: ProcessInstancesApi;
    processDefinitionsApi: ProcessDefinitionsApi;
    applicationsUtil: ApplicationsUtil;
    tasksApi: TasksApi;

    constructor(apiService: ApiService) {
        this.api = apiService;
        this.processInstancesApi = new ProcessInstancesApi(apiService.getInstance());
        this.processDefinitionsApi = new ProcessDefinitionsApi(apiService.getInstance());
        this.applicationsUtil = new ApplicationsUtil(apiService);
        this.tasksApi = new TasksApi(apiService.getInstance());
    }

    async startProcessByDefinitionName(appName: string, processDefinitionName: string, processName?: string): Promise<any> {
        try {
            const appDefinition = await this.applicationsUtil.getAppDefinitionByName(appName);

            const processDefinition = await this.getProcessDefinitionByName(appDefinition.deploymentId, processDefinitionName);

            const startProcessOptions: any = { processDefinitionId: processDefinition.id, name: processName ? processName : processDefinitionName + StringUtil.generateRandomString(5).toLowerCase() };

            return this.processInstancesApi.startNewProcessInstance(startProcessOptions);
        } catch (error) {
            Logger.error('Start Process - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async startProcessByDefinitionNameWithFormValues(appName: string, processDefinitionName: string, values: any, processName?: string): Promise<any> {
        try {
            const appDefinition = await this.applicationsUtil.getAppDefinitionByName(appName);

            const processDefinition = await this.getProcessDefinitionByName(appDefinition.deploymentId, processDefinitionName);

            const startProcessOptions: any = {
                processDefinitionId: processDefinition.id,
                name: processName ? processName : processDefinitionName + StringUtil.generateRandomString(5).toLowerCase(),
                values
            };

            return this.processInstancesApi.startNewProcessInstance(startProcessOptions);
        } catch (error) {
            Logger.error('Start Process - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async startProcessOfApp(appName: string, processName?: string): Promise<any> {
        try {
            const appDefinition = await this.applicationsUtil.getAppDefinitionByName(appName);
            const processDefinitionList = await this.processDefinitionsApi.getProcessDefinitions({ deploymentId: appDefinition.deploymentId });
            const startProcessOptions: any = { processDefinitionId: processDefinitionList.data[0].id, name: processName ? processName : StringUtil.generateRandomString(5).toLowerCase() };
            return this.processInstancesApi.startNewProcessInstance(startProcessOptions);
        } catch (error) {
            Logger.error('Start Process - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async cancelProcessInstance(processInstance: string): Promise<any> {
        try {
            return this.processInstancesApi.deleteProcessInstance(processInstance);
        } catch (error) {
            Logger.error('Cancel Process - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async getProcessDefinitionByName(deploymentId: string, processName: string): Promise<any> {
        try {
            const processDefinitionList = await this.processDefinitionsApi.getProcessDefinitions({ deploymentId });
            const chosenProcess = processDefinitionList.data.find( (processDefinition) => processDefinition.name === processName);
            return chosenProcess;
        } catch (error) {
            Logger.error('Get ProcessDefinitions - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async getProcessInstanceByName(processInstanceName: string, processInstanceStatus?: string, maxNumberOfResults?: number): Promise<any> {
        try {
            return await this.processInstancesApi.filterProcessInstances({filter: {name: processInstanceName, state: processInstanceStatus}, size: maxNumberOfResults});
        } catch (error) {
            Logger.error('List process instances using a filter - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async getProcessTaskId(processId: string): Promise<TaskRepresentation> {
        const taskList = await this.tasksApi.listTasks({});
        let wantedTask;

        taskList.data.forEach((task) => {
            if (task.processInstanceId === processId) {
                wantedTask = task;
            }
        });
        return wantedTask ? wantedTask : 'null';
    }

}
