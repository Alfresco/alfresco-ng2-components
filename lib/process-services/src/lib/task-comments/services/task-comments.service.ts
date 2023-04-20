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

import { AlfrescoApiService, CommentModel, CommentsService } from '@alfresco/adf-core';
import { ActivitiCommentsApi, CommentRepresentation } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserProcessModel } from '../../common/models/user-process.model';
import { PeopleProcessService } from '../../common/services/people-process.service';

@Injectable({
  providedIn: 'root'
})
export class TaskCommentsService implements CommentsService {

  private _commentsApi: ActivitiCommentsApi;
  get commentsApi(): ActivitiCommentsApi {
      this._commentsApi = this._commentsApi ?? new ActivitiCommentsApi(this.apiService.getInstance());
      return this._commentsApi;
  }

  constructor(
    private apiService: AlfrescoApiService,
    private peopleProcessService: PeopleProcessService
  ) {}

  /**
   * Gets all comments that have been added to a task.
   *
   * @param id ID of the target task
   * @returns Details for each comment
   */
  get(id: string): Observable<CommentModel[]> {
    return from(this.commentsApi.getTaskComments(id))
    .pipe(
        map((response) => {
            const comments: CommentModel[] = [];

            response.data.forEach((comment: CommentRepresentation) => {
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
    return from(this.commentsApi.addTaskComment({ message }, id))
      .pipe(
          map(
            (response: CommentRepresentation) => this.newCommentModel(response)
          ),
          catchError(
            (err: any) => this.handleError(err)
          )
      );
  }

  private addToComments(comments: CommentModel[], comment: CommentRepresentation): void {
    const user = new UserProcessModel(comment.createdBy);

    const newComment: CommentRepresentation = {
      id: comment.id,
      message: comment.message,
      created: comment.created,
      createdBy: user
    };

    comments.push(this.newCommentModel(newComment));
  }

  private newCommentModel(representation: CommentRepresentation): CommentModel {
    return new CommentModel({
      id: representation.id,
      message: representation.message,
      created: representation.created,
      createdBy: representation.createdBy
    });
  }

  private handleError(error: any) {
    return throwError(error || 'Server error');
  }

  getUserImage(user: UserProcessModel): string {
    return this.peopleProcessService.getUserImage(user);
  }
}
