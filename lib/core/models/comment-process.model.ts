/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { CommentRepresentation, LightUserRepresentation } from 'alfresco-js-api';

/**
 * @deprecated
 * CommentProcessModel
 * (this model is deprecated in 2.3.0 in favour of CommentModel and will be removed in future revisions)
 */
export class CommentProcessModel implements CommentRepresentation {
    id: number;
    message: string;
    created: Date;
    createdBy: LightUserRepresentation;
    isSelected: boolean;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id;
            this.message = obj.message;
            this.created = obj.created;
            this.createdBy = obj.createdBy;
            this.isSelected = obj.isSelected ?  obj.isSelected : false;
        }
    }
}
