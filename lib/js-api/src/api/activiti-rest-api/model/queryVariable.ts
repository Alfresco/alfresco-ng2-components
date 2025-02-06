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

export interface QueryVariable {
    name?: string;
    operation?: string;
    type?: string;
    value?: any;
    variableOperation?:
        | 'EQUALS'
        | 'NOT_EQUALS'
        | 'EQUALS_IGNORE_CASE'
        | 'NOT_EQUALS_IGNORE_CASE'
        | 'LIKE'
        | 'LIKE_IGNORE_CASE'
        | 'GREATER_THAN'
        | 'GREATER_THAN_OR_EQUALS'
        | 'LESS_THAN'
        | 'LESS_THAN_OR_EQUALS';
}
