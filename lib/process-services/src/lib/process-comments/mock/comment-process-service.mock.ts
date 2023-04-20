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

import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommentModel, UserProcessModel, CommentsService } from '@alfresco/adf-core';
import { fakeUser1 } from '../mock/comment-process.mock';

@Injectable()
export class CommentProcessServiceMock implements Partial<CommentsService> {
    private comments: CommentModel [] = [];

    get(_id: string): Observable<CommentModel[]> {
        const user = new UserProcessModel(fakeUser1);

        this.comments.push(new CommentModel({
            id: 46,
            message: 'Hello from Process Model',
            created: new Date('2022-08-02T03:37:30.010+0000'),
            createdBy: user
        }));

        return of(this.comments);
    }

    add(_id: string, _message: string): Observable<CommentModel> {
        return from(this.comments).pipe(
            map((response) => new CommentModel({
                id: response.id,
                message: response.message,
                created: response.created,
                createdBy: response.createdBy
            }))
        );
    }
}
