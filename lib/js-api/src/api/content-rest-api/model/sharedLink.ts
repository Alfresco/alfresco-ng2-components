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

import { ContentInfo } from './contentInfo';
import { DateAlfresco } from '../../content-custom-api';
import { UserInfo } from './userInfo';

export class SharedLink {
    id?: string;
    expiresAt?: Date;
    nodeId?: string;
    /**
     * The name must not contain spaces or the following special characters: * \" < > \\ / ? : and |.
The character . must not be used at the end of the name.

     */
    name?: string;
    title?: string;
    description?: string;
    modifiedAt?: Date;
    modifiedByUser?: UserInfo;
    sharedByUser?: UserInfo;
    content?: ContentInfo;
    /**
     * The allowable operations for the Quickshare link itself. See allowableOperationsOnTarget for the
allowable operations pertaining to the linked content node.

     */
    allowableOperations?: string[];
    /**
     * The allowable operations for the content node being shared.

     */
    allowableOperationsOnTarget?: string[];
    isFavorite?: boolean;
    /**
     * A subset of the target node's properties, system properties and properties already available in the SharedLink are excluded.

     */
    properties?: any;
    aspectNames?: string[];

    constructor(input?: Partial<SharedLink>) {
        if (input) {
            Object.assign(this, input);
            this.expiresAt = input.expiresAt ? DateAlfresco.parseDate(input.expiresAt) : undefined;
            this.modifiedAt = input.modifiedAt ? DateAlfresco.parseDate(input.modifiedAt) : undefined;
            this.modifiedByUser = input.modifiedByUser ? new UserInfo(input.modifiedByUser) : undefined;
            this.sharedByUser = input.sharedByUser ? new UserInfo(input.sharedByUser) : undefined;
            this.content = input.content ? new ContentInfo(input.content) : undefined;
        }
    }

}
