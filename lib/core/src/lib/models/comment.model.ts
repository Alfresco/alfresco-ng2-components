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

import { User } from './general-user.model';

export class CommentModel {
    id: string | number;
    message: string;
    created: Date;
    createdBy: User;
    isSelected: boolean;

    get hasAvatarPicture(): boolean {
        return !!this.createdBy && !!(this.createdBy['pictureId'] || this.createdBy['avatarId']);
    }

    get userDisplayName(): string {
        let result = '';

        if (this.createdBy) {
            result = `${this.createdBy.firstName || ''} ${this.createdBy.lastName || ''}`;
        }

        return result.trim();
    }

    get userInitials(): string {
        let result = '';
        if (this.createdBy) {
            if (this.createdBy.firstName) {
                result = this.createdBy.firstName[0];
            }
            if (this.createdBy.lastName) {
                result += this.createdBy.lastName[0];
            }
        }
        return result.toUpperCase();
    }

    constructor(obj?: Partial<CommentModel>) {
        if (obj) {
            this.id = obj.id;
            this.message = obj.message;
            this.created = obj.created;
            this.createdBy = obj.createdBy;
            this.isSelected = obj.isSelected ? obj.isSelected : false;
        }
    }
}
