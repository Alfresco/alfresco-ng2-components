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

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommentModel } from '../models/comment.model';
import { CommentContentServiceInterface } from '../services/comment-content.service.interface';
import { testUser } from '../mock/comment-content.mock';

@Injectable()
export class CommentContentServiceMock implements CommentContentServiceInterface {
    private comments: CommentModel [] = [];

    addNodeComment(nodeId: string, message: string): Observable<CommentModel> {
        const comment = new CommentModel({
            id: nodeId,
            message: message,
            created: new Date(),
            createdBy: testUser,
            isSelected: false
        });
        this.comments.push(comment);

        return of(comment);
    }

    getNodeComments(_nodeId: string): Observable<CommentModel[]>{
        return of(this.comments);
    };
}
