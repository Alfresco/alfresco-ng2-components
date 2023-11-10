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

import { DateAlfresco } from '../../content-custom-api';
import { NetworkQuota } from './networkQuota';

/**
 * A network is the group of users and sites that belong to an organization.
Networks are organized by email domain. When a user signs up for an
Alfresco account , their email domain becomes their Home Network.

 */
export class PersonNetwork {
    /**
     * This network's unique id
     */
    id: string;
    /**
     * Is this the home network?
     */
    homeNetwork?: boolean;
    isEnabled: boolean;
    createdAt?: Date;
    paidNetwork?: boolean;
    subscriptionLevel?: PersonNetwork.SubscriptionLevelEnum | string;
    quotas?: NetworkQuota[];

    constructor(input?: Partial<PersonNetwork>) {
        if (input) {
            Object.assign(this, input);
            this.createdAt = input.createdAt ? DateAlfresco.parseDate(input.createdAt) : undefined;
            if (input.quotas) {
                this.quotas = input.quotas.map((item) => {
                    return new NetworkQuota(item);
                });
            }
        }
    }

}
export namespace PersonNetwork {
    export type SubscriptionLevelEnum = 'Free' | 'Standard' | 'Enterprise';
    export const SubscriptionLevelEnum = {
        Free: 'Free' as SubscriptionLevelEnum,
        Standard: 'Standard' as SubscriptionLevelEnum,
        Enterprise: 'Enterprise' as SubscriptionLevelEnum
    };
}
