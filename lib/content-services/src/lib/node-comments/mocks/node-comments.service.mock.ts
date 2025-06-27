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

import { CommentModel, User } from '../../../../../core/src/lib/models';
import { Observable, of } from 'rxjs';
import { CommentsService } from '../../../../../core/src/lib/comments/interfaces/comments-service.interface';

export class NodeCommentsServiceMock implements Partial<CommentsService> {
    get(_id: string): Observable<CommentModel[]> {
        return commentsResponseMock.getComments();
    }

    add(_id: string): Observable<CommentModel> {
        return commentsResponseMock.addComment();
    }
}

const commentUser = new User({
    enabled: true,
    firstName: 'mock',
    displayName: 'Mock User',
    id: 'mock-user-id',
    email: 'mock@example.com'
});

export const commentsResponseMock = {
    getComments: () =>
        of([
            new CommentModel({
                id: 1,
                message: 'Mock Comment 1',
                created: new Date(),
                createdBy: commentUser,
                isSelected: false
            }),
            new CommentModel({
                id: 2,
                message: 'Mock Comment 2',
                created: new Date(),
                createdBy: commentUser,
                isSelected: false
            })
        ]),
    addComment: (message = 'Mock comment') =>
        of(
            new CommentModel({
                id: 99,
                message,
                created: new Date(),
                createdBy: commentUser,
                isSelected: false
            })
        )
};
