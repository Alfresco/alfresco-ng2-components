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

import {
    AlfrescoApiService,
    LogService,
    CommentModel,
    CommentsService
} from '@alfresco/adf-core';
import { CommentEntry, CommentsApi, Comment } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ContentService } from  '../../common/services/content.service';

@Injectable({
  providedIn: 'root'
})
export class NodeCommentsService implements CommentsService {

  private _commentsApi: CommentsApi;
  get commentsApi(): CommentsApi {
      this._commentsApi = this._commentsApi ?? new CommentsApi(this.apiService.getInstance());
      return this._commentsApi;
  }

  constructor(
    private apiService: AlfrescoApiService,
    private logService: LogService,
    private contentService: ContentService
  ) {}

  /**
   * Gets all comments that have been added to a task.
   *
   * @param id ID of the target task
   * @returns Details for each comment
   */
  get(id: string): Observable<CommentModel[]> {
    return from(this.commentsApi.listComments(id))
      .pipe(
        map((response) => {
            const comments: CommentModel[] = [];

            response.list.entries.forEach((comment: CommentEntry) => {
              this.addToComments(comments, comment);
            });

            return comments;
        }),
        catchError(
          (err: any) => this.handleError(err)
        )
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
    return from(this.commentsApi.createComment(id, { content: message }))
      .pipe(
        map(
          (response: CommentEntry) => this.newCommentModel(response.entry)
        ),
        catchError(
          (err: any) => this.handleError(err)
        )
    );
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
      createdBy: comment.createdBy
    });
  }

  private handleError(error: any) {
    this.logService.error(error);
    return throwError(error || 'Server error');
  }

  getUserImage(avatarId: string): string {
    return this.contentService.getContentUrl(avatarId);
  }
}
