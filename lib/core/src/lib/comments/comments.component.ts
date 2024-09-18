/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { CommentModel } from '../models/comment.model';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ADF_COMMENTS_SERVICE } from './interfaces/comments.token';
import { CommentsService } from './interfaces/comments-service.interface';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommentListComponent } from './comment-list';

@Component({
    selector: 'adf-comments',
    standalone: true,
    imports: [CommonModule, TranslateModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, CommentListComponent],
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CommentsComponent implements OnChanges {
    /** The numeric ID of the task. */
    @Input()
    id: string;

    /** Are the comments read only? */
    @Input()
    readOnly: boolean = false;

    /** Emitted when an error occurs while displaying/adding a comment. */
    @Output()
    error = new EventEmitter<any>();

    comments: CommentModel[] = [];
    message: string;
    beingAdded: boolean = false;

    private commentsService = inject<CommentsService>(ADF_COMMENTS_SERVICE);

    ngOnChanges(changes: SimpleChanges): void {
        this.id = null;

        this.id = changes['id'] ? changes['id'].currentValue : null;

        if (this.id) {
            this.loadComments();
        } else {
            this.resetComments();
        }
    }

    loadComments() {
        this.resetComments();

        if (!this.hasId()) {
            return;
        }

        this.commentsService.get(this.id).subscribe({
            next: (comments) => {
                if (!this.isArrayInstance(comments)) {
                    return;
                }

                comments = this.sortedComments(comments);
                this.comments.push(...comments);
            },
            error: (err) => {
                this.error.emit(err);
            }
        });
    }

    addComment() {
        if (!this.canAddComment()) {
            return;
        }

        this.beingAdded = true;

        this.commentsService.add(this.id, this.message).subscribe({
            next: (res) => {
                this.addToComments(res);
                this.resetMessage();
            },
            error: (err) => {
                this.error.emit(err);
            },
            complete: () => {
                this.beingAdded = false;
            }
        });
    }

    clearMessage(event: Event): void {
        event.stopPropagation();
        this.resetMessage();
    }

    private addToComments(comment: CommentModel): void {
        this.comments.unshift(comment);
    }

    private resetMessage(): void {
        this.message = '';
    }

    private canAddComment(): boolean {
        return this.hasId() && this.message && this.message.trim() && !this.beingAdded;
    }

    private hasId(): boolean {
        return !!this.id;
    }

    private isArrayInstance(entity: any): boolean {
        return entity && entity instanceof Array;
    }

    private sortedComments(comments: CommentModel[]): CommentModel[] {
        return comments.sort((comment1, comment2) => {
            const date1 = new Date(comment1.created);
            const date2 = new Date(comment2.created);

            return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
        });
    }

    private resetComments(): void {
        this.comments = [];
    }
}
