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

import { AppDefinitionRepresentationModel } from '../task-list';

export const nonDeployedApps = [new AppDefinitionRepresentationModel({
    id: '1',
    name: '1',
    icon: 'icon1'
}), new AppDefinitionRepresentationModel({
    id: '1',
    name: '2',
    icon: 'icon2'
}), new AppDefinitionRepresentationModel({
    id: '1',
    name: '3',
    icon: 'icon3'
})];
export const deployedApps = [new AppDefinitionRepresentationModel({
    id: 1,
    name: 'App1',
    icon: 'icon1',
    deploymentId: '1',
    defaultAppId: 'fake-app-1',
    modelId: null,
    tenantId: null
}), new AppDefinitionRepresentationModel({
    id: 2,
    name: 'App2',
    icon: 'icon2',
    deploymentId: '2',
    modelId: null,
    tenantId: null
}), new AppDefinitionRepresentationModel({
    id: 3,
    name: 'App3',
    icon: 'icon3',
    deploymentId: '3',
    modelId: null,
    tenantId: null
}), new AppDefinitionRepresentationModel({
    id: 4,
    name: 'App4',
    icon: 'icon4',
    deploymentId: '4',
    modelId: 65,
    tenantId: null
}), new AppDefinitionRepresentationModel({
    id: 5,
    name: 'App5',
    icon: 'icon5',
    deploymentId: '5',
    modelId: 66,
    tenantId: 9
}), new AppDefinitionRepresentationModel({
    id: 6,
    name: 'App6',
    icon: 'icon6',
    deploymentId: '6',
    tenantId: 9,
    modelId: 66
})];
export const defaultApp = [new AppDefinitionRepresentationModel({
    defaultAppId: 'tasks'
})];
