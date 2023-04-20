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

import { SelectionState } from '../store/states/selection.state';
import { NavigationState } from '../store/states/navigation.state';
import { NodePermissions } from './permission.extensions';
import { ProfileState } from '../store/states/profile.state';
import { RepositoryInfo } from '@alfresco/js-api';

export type RuleEvaluator = (context: RuleContext, ...args: any[]) => boolean;

export interface RuleContext {
    repository: RepositoryInfo;
    auth: any;
    selection: SelectionState;
    navigation: NavigationState;
    profile: ProfileState;
    permissions: NodePermissions;

    getEvaluator(key: string): RuleEvaluator;
}

export class RuleRef {
    type: string;
    id?: string;
    parameters?: Array<RuleParameter>;
}

export interface RuleParameter {
    type: string;
    value: any;
    parameters?: Array<RuleParameter>;
}
