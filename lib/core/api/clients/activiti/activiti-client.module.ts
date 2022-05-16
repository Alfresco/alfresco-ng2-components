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

import {
    AboutApi,
    ActivitiCommentsApi,
    ActivitiContentApi,
    ActivitiGroupsApi,
    ChecklistsApi,
    FormModelsApi,
    IntegrationAlfrescoOnPremiseApi,
    ModelJsonBpmnApi,
    ModelsApi,
    ProcessDefinitionsApi,
    ProcessInstancesApi,
    ProcessInstanceVariablesApi,
    ReportApi,
    RuntimeAppDefinitionsApi,
    ScriptFilesApi,
    SystemPropertiesApi,
    TaskActionsApi,
    TaskFormsApi,
    TasksApi,
    UserFiltersApi,
    UserProfileApi,
    UsersApi
} from '@alfresco/js-api';
import { NgModule } from '@angular/core';
import { ApiClientsService } from '../../api-clients.service';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Api {
        interface ApiRegistry {
            ['ActivitiClient.about']: AboutApi;
            ['ActivitiClient.system-properties']: SystemPropertiesApi;
            ['ActivitiClient.script-files']: ScriptFilesApi;
            ['ActivitiClient.process-definitions']: ProcessDefinitionsApi;
            ['ActivitiClient.process-instance-variables']: ProcessInstanceVariablesApi;
            ['ActivitiClient.process-instances']: ProcessInstancesApi;
            ['ActivitiClient.users']: UsersApi;
            ['ActivitiClient.user-profile']: UserProfileApi;
            ['ActivitiClient.user-filters']: UserFiltersApi;
            ['ActivitiClient.comments-api']: ActivitiCommentsApi;
            ['ActivitiClient.activiti-content']: ActivitiContentApi;
            ['ActivitiClient.activiti-groups']: ActivitiGroupsApi;
            ['ActivitiClient.checklist']: ChecklistsApi;
            ['ActivitiClient.form-models']: FormModelsApi;
            ['ActivitiClient.integration-alfresco-on-premise']: IntegrationAlfrescoOnPremiseApi;
            ['ActivitiClient.model-json-bpmn']: ModelJsonBpmnApi;
            ['ActivitiClient.models']: ModelsApi;
            ['ActivitiClient.report']: ReportApi;
            ['ActivitiClient.task-actions']: TaskActionsApi;
            ['ActivitiClient.task-forms']: TaskFormsApi;
            ['ActivitiClient.tasks']: TasksApi;
            ['ActivitiClient.runtime-app-definitions']: RuntimeAppDefinitionsApi;
        }
    }
}

@NgModule()
export class ActivitiClientModule {
    constructor(private apiClientsService: ApiClientsService) {
        this.apiClientsService.register('ActivitiClient.about', AboutApi);
        this.apiClientsService.register('ActivitiClient.system-properties', SystemPropertiesApi);
        this.apiClientsService.register('ActivitiClient.script-files', ScriptFilesApi);
        this.apiClientsService.register('ActivitiClient.process-definitions', ProcessDefinitionsApi);
        this.apiClientsService.register('ActivitiClient.process-instance-variables', ProcessInstanceVariablesApi);
        this.apiClientsService.register('ActivitiClient.process-instances', ProcessInstancesApi);
        this.apiClientsService.register('ActivitiClient.users', UsersApi);
        this.apiClientsService.register('ActivitiClient.user-profile', UserProfileApi);
        this.apiClientsService.register('ActivitiClient.user-filters', UserFiltersApi);
        this.apiClientsService.register('ActivitiClient.comments-api', ActivitiCommentsApi);
        this.apiClientsService.register('ActivitiClient.activiti-content', ActivitiContentApi);
        this.apiClientsService.register('ActivitiClient.activiti-groups', ActivitiGroupsApi);
        this.apiClientsService.register('ActivitiClient.checklist', ChecklistsApi);
        this.apiClientsService.register('ActivitiClient.form-models', FormModelsApi);
        this.apiClientsService.register('ActivitiClient.integration-alfresco-on-premise', IntegrationAlfrescoOnPremiseApi);
        this.apiClientsService.register('ActivitiClient.model-json-bpmn', ModelJsonBpmnApi);
        this.apiClientsService.register('ActivitiClient.models', ModelsApi);
        this.apiClientsService.register('ActivitiClient.report', ReportApi);
        this.apiClientsService.register('ActivitiClient.task-actions', TaskActionsApi);
        this.apiClientsService.register('ActivitiClient.task-forms', TaskFormsApi);
        this.apiClientsService.register('ActivitiClient.tasks', TasksApi);
        this.apiClientsService.register('ActivitiClient.runtime-app-definitions', RuntimeAppDefinitionsApi);
    }
}
