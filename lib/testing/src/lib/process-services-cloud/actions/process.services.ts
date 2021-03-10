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

import { ApiService } from '../../core/actions/api.service';
import { ProcessDefinitionsService } from './process-definitions.service';
import { ProcessInstancesService } from './process-instances.service';
import { QueryService } from '../../core/actions/identity/query.service';
import { TasksService } from './tasks.service';
import { StringUtil } from '../../core/utils/string.util';

export class ProcessServices {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async createProcessInstanceAndClaimFirstTask(processDefName, appName) {
        const processDefinition = await new ProcessDefinitionsService(this.api).getProcessDefinitionByName(processDefName, appName);
        const processInstance = await new ProcessInstancesService(this.api).createProcessInstance(processDefinition.entry.key, appName, {
            name:  StringUtil.generateRandomString(),
            businessKey: StringUtil.generateRandomString(),
        });
        const task = await new QueryService(this.api).getProcessInstanceTasks(processInstance.entry.id, appName);
        await new TasksService(this.api).claimTask(task.list.entries[0].entry.id, appName);

        return processInstance;
    }
}
