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

export class SiteMembershipRequestBodyCreate {
    message?: string;
    id: string;
    title?: string;
    /**
     * Optional client name used when sending an email to the end user, defaults to \"share\" if not provided.
     **Note:** The client must be registered before this API can send an email.
     **Note:** This is available in Alfresco 7.0.0 and newer versions.
     */
    client?: string;
    constructor(input?: Partial<SiteMembershipRequestBodyCreate>) {
        if (input) {
            Object.assign(this, input);
        }
    }

}
