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

import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CommentModel } from '../models/comment.model';
import { EcmUserService } from '../services/ecm-user.service';
import { PeopleProcessService } from '../services/people-process.service';
import { UserPreferencesService, UserPreferenceValues } from '../services/user-preferences.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-comment-list',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CommentListComponent implements OnInit, OnDestroy {

    /** The comments data used to populate the list. */
    @Input()
    comments: CommentModel[];

    /** Emitted when the user clicks on one of the comment rows. */
    @Output()
    clickRow: EventEmitter<CommentModel> = new EventEmitter<CommentModel>();

    selectedComment: CommentModel;
    currentLocale;
    private onDestroy$ = new Subject<boolean>();

    constructor(public peopleProcessService: PeopleProcessService,
                public ecmUserService: EcmUserService,
                public userPreferenceService: UserPreferencesService) {
    }

    ngOnInit() {
        this.userPreferenceService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.currentLocale = locale);
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
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

    private isAContentUsers(user: any): boolean {
        return user.avatarId;
    }
}
