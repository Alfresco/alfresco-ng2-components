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

import { CommentModel } from '../../../models/comment.model';

export const testUser = {
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    email: 'tu@domain.com'
};

export const mockCommentOne = new CommentModel({
    id: 1,
    message: 'Test Comment',
    created: new Date(),
    createdBy: testUser
});

export const mockCommentTwo = new CommentModel({
    id: 2,
    message: '2nd Test Comment',
    created: new Date(),
    createdBy: testUser
});

export const commentUserPictureDefined = new CommentModel({
    id: 2,
    message: '2nd Test Comment',
    created: new Date(),
    createdBy: {
        enabled: true,
        firstName: 'some',
        lastName: 'one',
        email: 'some-one@somegroup.com',
        emailNotificationsEnabled: true,
        company: {},
        id: 'fake-email@dom.com',
        avatarId: '001-001-001'
    }
});

export const commentUserNoPictureDefined = new CommentModel({
    id: 2,
    message: '2nd Test Comment',
    created: new Date(),
    createdBy: {
        enabled: true,
        firstName: 'some',
        lastName: 'one',
        email: 'some-one@somegroup.com',
        emailNotificationsEnabled: true,
        company: {},
        id: 'fake-email@dom.com'
    }
});
