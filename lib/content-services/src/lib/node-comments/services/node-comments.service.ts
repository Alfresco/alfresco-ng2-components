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

import { CommentModel, CommentsService, User } from '@alfresco/adf-core';
import { CommentEntry, CommentsApi, Comment, PeopleApi } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlfrescoApiService } from '../../services/alfresco-api.service';

@Injectable({
    providedIn: 'root'
})
export class NodeCommentsService implements CommentsService {
    private _commentsApi: CommentsApi;
    get commentsApi(): CommentsApi {
        this._commentsApi = this._commentsApi ?? new CommentsApi(this.apiService.getInstance());
        return this._commentsApi;
    }

    private _peopleApi: PeopleApi;
    get peopleApi(): PeopleApi {
        this._peopleApi = this._peopleApi ?? new PeopleApi(this.apiService.getInstance());
        return this._peopleApi;
    }

    constructor(private readonly apiService: AlfrescoApiService) {}

    /**
     * Gets all comments that have been added to a task.
     *
     * @param id ID of the target task
     * @returns Details for each comment
     */
    get(id: string): Observable<CommentModel[]> {
        return from(this.commentsApi.listComments(id)).pipe(
            map((response) => {
                const comments: CommentModel[] = [];

                response.list.entries.forEach((comment: CommentEntry) => {
                    this.addToComments(comments, comment);
                });

                return comments;
            })
        );
    }

    /**
     * Adds a comment to a task.
     *
     * @param id ID of the target task
     * @param message Text for the comment
     * @returns Details about the comment
     */
    add(id: string, message: string): Observable<CommentModel> {
        return from(this.commentsApi.createComment(id, { content: message })).pipe(map((response) => this.newCommentModel(response.entry)));
    }

    private addToComments(comments: CommentModel[], comment: CommentEntry): void {
        const newComment: Comment = comment.entry;

        comments.push(this.newCommentModel(newComment));
    }

    private newCommentModel(comment: Comment): CommentModel {
        return new CommentModel({
            id: comment.id,
            message: comment.content,
            created: comment.createdAt,
            createdBy: new User(comment.createdBy)
        });
    }

    getUserImage(userId: string): string {
        return this.peopleApi.getAvatarImageUrl(userId);
    }
}
