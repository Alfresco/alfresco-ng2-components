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

import { ChildAssociationInfo } from '../../content-rest-api/model/childAssociationInfo';
import { DateAlfresco } from '../../content-custom-api/model/dateAlfresco';
import { UserInfo } from '../../content-rest-api/model/userInfo';

export class TransferContainerChildAssociation {
    id: string;
    parentId: string;
    /**
     * The name must not contain spaces or the following special characters: * \" < > \\ / ? : and |.
The character . must not be used at the end of the name.

     */
    name: string;
    nodeType: string;
    createdAt: Date;
    createdByUser: UserInfo;
    /**
     * Present only for transfer nodes.
     */
    transferPDFIndicator?: boolean;
    /**
     * Present only for transfer nodes.
     */
    transferLocation?: string;
    /**
     * Present only for transfer nodes.
     */
    transferAccessionIndicator?: boolean;
    aspectNames?: string[];
    properties?: any;
    allowableOperations?: string[];
    association?: ChildAssociationInfo;

    constructor(input?: Partial<TransferContainerChildAssociation>) {
        if (input) {
            Object.assign(this, input);
            this.createdAt = input.createdAt ? DateAlfresco.parseDate(input.createdAt) : undefined;
            this.createdByUser = input.createdByUser ? new UserInfo(input.createdByUser) : undefined;
            this.association = input.association ? new ChildAssociationInfo(input.association) : undefined;
        }
    }
}
