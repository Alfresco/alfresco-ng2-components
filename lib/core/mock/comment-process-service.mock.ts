/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { UserProcessModel } from '../models/user-process.model';

export let fakeUser1 = { id: 1, email: 'fake-email@dom.com', firstName: 'firstName', lastName: 'lastName' };

export let fakeUser2 = { id: 1001, email: 'some-one@somegroup.com', firstName: 'some', lastName: 'one' };

export let fakeTasksComment = {
    size: 2, total: 2, start: 0,
    data: [
        {
            id: 1, message: 'fake-message-1', created: '', createdBy: fakeUser1
        },
        {
            id: 2, message: 'fake-message-2', created: '', createdBy: fakeUser1
        }
    ]
};

export let fakeProcessComment = new CommentModel({id: 1, message: 'Test', created: new Date('2016-11-10T03:37:30.010+0000'), createdBy: new UserProcessModel({
    id: 13,
    firstName: 'Wilbur',
    lastName: 'Adams',
    email: 'wilbur@app.com'
})});
