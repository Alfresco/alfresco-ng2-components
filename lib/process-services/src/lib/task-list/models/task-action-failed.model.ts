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

/**
 * This object represent the process service user group.*
 */

export enum TaskActionFailedType {
    FORM_ACTION_FAILED = 'FORM_ACTION_FAILED',
    COMPLETED_FAILED = 'COMPLETED_FAILED',
    CLAIM_FAILED = 'CLAIM_FAILED',
    UNCLAIM_FAILED = 'UNCLAIM_FAILED'
}

export interface ErrorModel {
    type: TaskActionFailedType;
    error: any;
}
