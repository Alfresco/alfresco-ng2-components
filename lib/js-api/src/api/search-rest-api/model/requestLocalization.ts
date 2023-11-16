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
 * Localization settings
 */
export class RequestLocalization {
    /**
     * A valid timezone id supported by @see java.time.ZoneId
     */
    timezone?: string;
    /**
     * A list of Locales defined by IETF BCP 47.  The ordering is significant.  The first locale (leftmost) is used for sort and query localization, whereas the remaining locales are used for query only.
     */
    locales?: string[];

    constructor(input?: Partial<RequestLocalization>) {
        if (input) {
            Object.assign(this, input);
        }
    }
}
