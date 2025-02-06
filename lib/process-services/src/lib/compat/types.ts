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

import {
    AppDefinitionRepresentation,
    LightUserRepresentation,
    ProcessInstanceRepresentation,
    RestVariable,
    UserRepresentation,
    UserTaskFilterRepresentation
} from '@alfresco/js-api';

/** @deprecated use js-api/ProcessInstanceRepresentation instead */
export type ProcessInstance = ProcessInstanceRepresentation;

/** @deprecated use js-api/UserTaskFilterRepresentation instead */
export type FilterRepresentationModel = UserTaskFilterRepresentation;

/** @deprecated use js-api/UserTaskFilterRepresentation instead */
export type FilterParamsModel = UserTaskFilterRepresentation;

/** @deprecated use js-api/UserRepresentation instead */
export type BpmUserModel = UserRepresentation;

/** @deprecated use js-api/AppDefinitionRepresentation instead */
export type AppDefinitionRepresentationModel = AppDefinitionRepresentation;

/** @deprecated use js-api/LightUserRepresentation instead */
export type UserProcessModel = LightUserRepresentation;

/** @deprecated use js-api/RestVariable instead */
export type ProcessInstanceVariable = RestVariable;
