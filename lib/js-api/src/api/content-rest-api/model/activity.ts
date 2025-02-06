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

import { DateAlfresco } from '../../content-custom-api';

/**
 * Activities describe any past activity in a site,
 * for example creating an item of content, commenting on a node,
 * liking an item of content.
 */
export class Activity {
    /**
     * The id of the person who performed the activity
     */
    postPersonId: string;
    /**
     * The unique id of the activity
     */
    id: number;
    /**
     * The unique id of the site on which the activity was performed
     */
    siteId?: string;
    /**
     * The date time at which the activity was performed
     */
    postedAt?: Date;
    /**
     * The feed on which this activity was posted
     */
    feedPersonId: string;
    /**
     * An object summarizing the activity
     */
    activitySummary?: { [key: string]: string };
    /**
     * The type of the activity posted
     */
    activityType: string;

    constructor(input?: Partial<Activity>) {
        if (input) {
            Object.assign(this, input);
            this.postedAt = input.postedAt ? DateAlfresco.parseDate(input.postedAt) : undefined;
        }
    }
}
