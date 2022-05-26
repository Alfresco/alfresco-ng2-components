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

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace AlfrescoCore {
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
