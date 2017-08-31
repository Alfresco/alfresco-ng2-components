/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from '../models/comment.model';
import { User } from '../models/user.model';

@Component({
    selector: 'adf-comment-list',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.scss']
})

export class CommentListComponent {

    @Input()
    comments: Comment[];

    @Output()
    clickRow: EventEmitter<Comment> = new EventEmitter<Comment>();

    selectedComment: Comment;

    constructor(private datePipe: DatePipe) {
    }

    selectComment(event: any): void {
        this.selectedComment = event.value.obj;
        this.clickRow.emit(this.selectedComment);
    }

    getUserShortName(user: User): string {
        let shortName = '';
        if (user) {
            if (user.firstName) {
                shortName = user.firstName[0].toUpperCase();
            }
            if (user.lastName) {
                shortName += user.lastName[0].toUpperCase();
            }
        }
        return shortName;
    }

    transformDate(aDate: string): string {
        let formattedDate: string;
        let givenDate = Number.parseInt(this.datePipe.transform(aDate, 'yMMdd'));
        let today = Number.parseInt(this.datePipe.transform(Date.now(), 'yMMdd'));
        if (givenDate === today) {
            formattedDate = 'Today, ' + this.datePipe.transform(aDate, 'hh:mm a');
        } else {
            let yesterday = Number.parseInt(this.datePipe.transform(Date.now() - 24 * 3600 * 1000, 'yMMdd'));
            if (givenDate === yesterday) {
                formattedDate = 'Yesterday, ' + this.datePipe.transform(aDate, 'hh:mm a');
            } else {
                formattedDate = this.datePipe.transform(aDate, 'MMM dd y, hh:mm a');
            }
        }
        return formattedDate;
    }

    hasComments(): boolean {
        return this.comments && this.comments.length && true;
    }

    onErrorImageLoad(user: User) {
        user.userImage = null;
    }

}
