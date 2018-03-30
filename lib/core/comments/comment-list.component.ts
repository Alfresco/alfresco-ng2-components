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

import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommentModel } from '../models/comment.model';
import { EcmUserService } from '../userinfo/services/ecm-user.service';
import { PeopleProcessService } from '../services/people-process.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'adf-comment-list',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CommentListComponent {

    /** The comments data used to populate the list. */
    @Input()
    comments: CommentModel[];

    /** Emitted when the user clicks on one of the comment rows. */
    @Output()
    clickRow: EventEmitter<CommentModel> = new EventEmitter<CommentModel>();

    selectedComment: CommentModel;

    constructor(private datePipe: DatePipe, public peopleProcessService: PeopleProcessService,
                public ecmUserService: EcmUserService) {
    }

    selectComment(comment: CommentModel): void {
        if (this.selectedComment) {
            this.selectedComment.isSelected = false;
        }
        comment.isSelected = true;
        this.selectedComment = comment;
        this.clickRow.emit(this.selectedComment);
    }

    getUserShortName(user: any): string {
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

    isPictureDefined(user: any): boolean {
        return user.pictureId || user.avatarId;
    }

    getUserImage(user: any): string {
        if (this.isAContentUsers(user)) {
            return this.ecmUserService.getUserProfileImage(user.avatarId);
        } else {
            return this.peopleProcessService.getUserImage(user);
        }
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

    private isAContentUsers(user: any): boolean {
        return user.avatarId;
    }
}
