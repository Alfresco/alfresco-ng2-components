/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { AppDefinitionRepresentationModel } from '../models/filter.model';

export var deployedApps = [new AppDefinitionRepresentationModel({
    id: '1',
    name: 'App1',
    icon: 'icon1',
    deploymentId: '1'
}), new AppDefinitionRepresentationModel({
    id: '2',
    name: 'App2',
    icon: 'icon2',
    deploymentId: '2'
}), new AppDefinitionRepresentationModel({
    id: '3',
    name: 'App3',
    icon: 'icon3',
    deploymentId: '3'
})];
export var nonDeployedApps = [new AppDefinitionRepresentationModel({
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
export var defaultApp = [new AppDefinitionRepresentationModel({
    defaultAppId: 'tasks'
})];
