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
 * Limits and usage of each quota. A network will have quotas for File space,
the number of sites in the network, the number of people in the network,
and the number of network administrators

 */
export class NetworkQuota {
    id: string;
    limit: number;
    usage: number;

    constructor(input?: Partial<NetworkQuota>) {
        if (input) {
            Object.assign(this, input);
        }
    }

}
