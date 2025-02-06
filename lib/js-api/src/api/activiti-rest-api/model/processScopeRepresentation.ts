/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { EntityVariableScopeRepresentation } from './entityVariableScopeRepresentation';
import { FormScopeRepresentation } from './formScopeRepresentation';
import { VariableMappingRepresentation } from './variableMappingRepresentation';
import { VariableScopeRepresentation } from './variableScopeRepresentation';

export interface ProcessScopeRepresentation {
    activityIds?: string[];
    activityIdsByCollapsedSubProcessIdMap?: { [key: string]: string };
    activityIdsByDecisionTableIdMap?: { [key: string]: string };
    activityIdsByFormIdMap?: { [key: string]: string };
    activityIdsWithExcludedSubProcess?: string[];
    activitySidsByActivityIdMap?: { [key: string]: string };
    customStencilVariables?: { [key: string]: VariableScopeRepresentation };
    entityVariables?: { [key: string]: EntityVariableScopeRepresentation };
    executionVariables?: { [key: string]: VariableScopeRepresentation };
    fieldToVariableMappings?: { [key: string]: VariableScopeRepresentation };
    forms?: { [key: string]: FormScopeRepresentation };
    metadataVariables?: { [key: string]: VariableScopeRepresentation };
    modelId?: number;
    processModelType?: number;
    responseVariables?: { [key: string]: VariableScopeRepresentation };
    reusableFieldMapping?: { [key: string]: VariableMappingRepresentation };
}
