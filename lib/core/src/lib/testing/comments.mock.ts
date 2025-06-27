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

import { of } from 'rxjs';
import { CommentModel, User } from '../models';

export const mockCommentUser = new User({
    enabled: true,
    firstName: 'hruser',
    displayName: 'hruser',
    id: 'hruser',
    email: 'test'
});

export const commentsResponseMock = {
    getComments: () =>
        of([
            new CommentModel({
                id: 1,
                message: 'Test Comment',
                created: new Date(),
                createdBy: mockCommentUser,
                isSelected: false
            }),
            new CommentModel({
                id: 2,
                message: 'Test Comment',
                created: new Date(),
                createdBy: mockCommentUser,
                isSelected: false
            }),
            new CommentModel({
                id: 3,
                message: 'Test Comment',
                created: new Date(),
                createdBy: mockCommentUser,
                isSelected: false
            })
        ]),
    addComment: (message = 'test comment') =>
        of(
            new CommentModel({
                id: 1,
                message,
                created: new Date(),
                createdBy: mockCommentUser,
                isSelected: false
            })
        )
};
