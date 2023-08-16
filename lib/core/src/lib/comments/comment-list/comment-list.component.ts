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

import { Component, EventEmitter, Input, Output, ViewEncapsulation, inject } from '@angular/core';
import { CommentModel } from '../../models/comment.model';
import { User } from '../../models/general-user.model';
import { CommentsService } from '../interfaces/comments-service.interface';
import { ADF_COMMENTS_SERVICE } from '../interfaces/comments.token';

@Component({
    selector: 'adf-comment-list',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CommentListComponent {

    /** The comments data used to populate the list. */
    @Input()
    comments: CommentModel[];

    /** Emitted when the user clicks on one of the comment rows. */
    @Output()
    clickRow = new EventEmitter<CommentModel>();

    private commentsService = inject<CommentsService>(ADF_COMMENTS_SERVICE);

    selectComment(comment: CommentModel): void {
        this.clickRow.emit(comment);
    }

    getUserImage(user: User): string {
        return this.commentsService.getUserImage(user);
    }
}
