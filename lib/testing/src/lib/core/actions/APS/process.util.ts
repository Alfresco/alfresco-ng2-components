/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { Logger } from '../../utils/logger';
import { StringUtil } from '../../utils/string.util';
import { ApiService } from '../api.service';

export class ProcessUtil {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async startProcessByDefinitionName(appName: string, processDefinitionName: string): Promise<any> {
        try {
            const appDefinition = await new ApplicationsUtil(this.api).getAppDefinitionByName(appName);

            const processDefinition = await this.getProcessDefinitionByName(appDefinition.deploymentId, processDefinitionName);

            const startProcessOptions: any = { processDefinitionId: processDefinition.id, name: processDefinitionName };

            return this.api.apiService.activiti.processApi.startNewProcessInstance(startProcessOptions);
        } catch (error) {
            Logger.error('Start Process - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async startProcessOfApp(appName: string, processName?: string): Promise<any> {
        try {
            const appDefinition = await new ApplicationsUtil(this.api).getAppDefinitionByName(appName);
            const processDefinitionList = await this.api.apiService.activiti.processApi.getProcessDefinitions({ deploymentId: appDefinition[0].deploymentId });
            const startProcessOptions: any = { processDefinitionId: processDefinitionList.data[0].id, name: processName ? processName : StringUtil.generateRandomString(5).toLowerCase() };
            return this.api.apiService.activiti.processApi.startNewProcessInstance(startProcessOptions);
        } catch (error) {
            Logger.error('Start Process - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async cancelProcessInstance(processInstance: string): Promise<any> {
        try {
            return this.api.apiService.activiti.processApi.deleteProcessInstance(processInstance);
        } catch (error) {
            Logger.error('Cancel Process - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async getProcessDefinitionByName(deploymentId: string, processName: string): Promise<any> {
        try {
            const processDefinitionList = await this.api.apiService.activiti.processApi.getProcessDefinitions({ deploymentId: deploymentId });
            const chosenProcess = processDefinitionList.data.find( (processDefinition) => {
                return processDefinition.name === processName;
            });
            return chosenProcess;
        } catch (error) {
            Logger.error('Get ProcessDefinitions - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async getProcessTaskId(processId: string): Promise<string> {
        const taskList = await this.api.apiService.activiti.taskApi.listTasks({});
        let wantedtask;

        taskList.data.forEach((task) => {
            if (task.processInstanceId === processId) {
                wantedtask = task;
            }
        });
        return wantedtask ? wantedtask : 'null';
    }
}
