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

export const DEFAULT_APP_INSTANCE_THEME = 'theme-2';
export const DEFAULT_APP_INSTANCE_ICON = 'favorite_border';

export interface ApplicationInstanceModel {
    name?: string;
    createdAt?: any;
    status?: string;
    theme?: string;
    icon?: string;
    description?: string;
    connectors?: any;
    descriptor?: Descriptor;
    environmentId?: string;
}

export interface Descriptor {
    name?: string;
    projectId?: string;
    releaseId?: string;
    releaseVersion?: number;
    security?: DescriptorSecurity[];
    infrastructure?: DescriptorInfrastructure;
    variables?: DescriptorVariables;
    version?: string;
    runtimeBundleVersion?: string;
}

export interface DescriptorSecurity {
    role: string;
    groups: string[];
    users: string[];
}

export interface DescriptorVariables {
    [key: string]: any;
    connectors?: { [key: string]: any };
}

export interface DescriptorInfrastructure {
    [key: string]: any;
}
