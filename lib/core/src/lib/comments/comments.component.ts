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

import { CommentModel } from '../models/comment.model';
import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';
import { ADF_COMMENTS_SERVICE } from './interfaces/comments.token';
import { CommentsService } from './interfaces/comments-service.interface';

@Component({
    selector: 'adf-comments',
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
    error: EventEmitter<any> = new EventEmitter<any>();

    comments: CommentModel[] = [];

    message: string;

    beingAdded: boolean = false;

    private commentObserver: Observer<CommentModel>;
    comment$: Observable<CommentModel>;

    constructor(@Inject(ADF_COMMENTS_SERVICE) private commentsService: CommentsService) {
        this.comment$ = new Observable<CommentModel>((observer) => this.commentObserver = observer)
            .pipe(
                share()
            );

        this.comment$.subscribe((comment: CommentModel) => {
            this.comments.push(comment);
        });
    }

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

        this.commentsService.get(this.id).subscribe(
            (comments: CommentModel[]) => {
                if (!this.isArrayInstance(comments)) {
                    return;
                }

                comments = this.sortedComments(comments);
                this.addCommentsToObserver(comments);

            },
            (err) => {
                this.error.emit(err);
            }
        );
    }

    addComment() {
        if (!this.canAddComment()) {
            return;
        }

        const comment: string = this.sanitize(this.message);

        this.beingAdded = true;

        this.commentsService.add(this.id, comment)
            .subscribe(
                (res: CommentModel) => {
                    this.addToComments(res);
                    this.resetMessage();
                },
                (err) => {
                    this.error.emit(err);
                },
                () => {
                    this.beingAdded = false;
                }
            );
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
        return comments.sort((comment1: CommentModel, comment2: CommentModel) => {
            const date1 = new Date(comment1.created);
            const date2 = new Date(comment2.created);

            return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
        });
    }

    private addCommentsToObserver(comments: CommentModel[]): void {
        comments.forEach((currentComment: CommentModel) => {
            this.commentObserver.next(currentComment);
        });
    }

    private resetComments(): void {
        this.comments = [];
    }

    private sanitize(input: string): string {
        return input.replace(/<[^>]+>/g, '')
            .replace(/^\s+|\s+$|\s+(?=\s)/g, '')
            .replace(/\r?\n/g, '<br/>');
    }
}
