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

export * from './about.api';
export * from './accountIntegration.api';
export * from './adminEndpoints.api';
export * from './adminGroups.api';
export * from './adminTenants.api';
export * from './adminUsers.api';
export * from './appDefinitions.api';
export * from './checklists.api';
export * from './comments.api';
import { ContentApi as ActivitiContentApi} from './content.api';
export { ActivitiContentApi };
export * from './dataSources.api';
export * from './decisionAudits.api';
export * from './decisionTables.api';
export * from './endpoints.api';
export * from './formModels.api';
export * from './groups.api';
export * from './iDMSync.api';
export * from './integrationAlfrescoCloud.api';
export * from './integrationAlfrescoOnPremise.api';
export * from './integrationBox.api';
export * from './integrationDrive.api';
export * from './models.api';
export * from './modelsBpmn.api';
export * from './modelsHistory.api';
export * from './processDefinitions.api';
export * from './processInstances.api';
export * from './processInstanceVariables.api';
export * from './processScopes.api';
export * from './runtimeAppDefinitions.api';
export * from './runtimeAppDeployments.api';
export * from './scriptFiles.api';
export * from './submittedForms.api';
export * from './systemProperties.api';
export * from './taskActions.api';
export * from './taskForms.api';
export * from './tasks.api';
export * from './taskVariables.api';
export * from './userFilters.api';
export * from './userProfile.api';
export * from './users.api';
export * from './report.api';
export * from './modelJsonBpmn.api';
export * from './temporary.api';
