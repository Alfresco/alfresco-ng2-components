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

/**
 * Scope
 */
export class RequestScope {
    /**
     * The locations to include in the query

     */
    locations?: RequestScope.LocationsEnum | string;

    constructor(input?: Partial<RequestScope>) {
        if (input) {
            Object.assign(this, input);
        }
    }

}
export namespace RequestScope {
    export type LocationsEnum = 'nodes' | 'versions' | 'deleted-nodes';
    export const LocationsEnum = {
        Nodes: 'nodes' as LocationsEnum,
        Versions: 'versions' as LocationsEnum,
        DeletedNodes: 'deleted-nodes' as LocationsEnum
    };
}
