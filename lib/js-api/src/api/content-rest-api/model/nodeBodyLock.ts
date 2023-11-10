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

export class NodeBodyLock {
    timeToExpire?: number;
    type?: NodeBodyLock.TypeEnum | string;
    lifetime?: NodeBodyLock.LifetimeEnum | string;

    constructor(input?: Partial<NodeBodyLock>) {
        if (input) {
            Object.assign(this, input);
        }
    }

}
export namespace NodeBodyLock {
    export type TypeEnum = 'ALLOW_OWNER_CHANGES' | 'FULL';
    export const TypeEnum = {
        ALLOWOWNERCHANGES: 'ALLOW_OWNER_CHANGES' as TypeEnum,
        FULL: 'FULL' as TypeEnum
    };
    export type LifetimeEnum = 'PERSISTENT' | 'EPHEMERAL';
    export const LifetimeEnum = {
        PERSISTENT: 'PERSISTENT' as LifetimeEnum,
        EPHEMERAL: 'EPHEMERAL' as LifetimeEnum
    };
}
