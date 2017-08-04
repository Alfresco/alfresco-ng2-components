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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { Observable, Observer } from 'rxjs/Rx';

import { Comment } from '../models/comment.model';
import { TaskListService } from '../services/tasklist.service';

@Component({
    selector: 'adf-comments, activiti-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnChanges {

    @Input()
    taskId: string;

    @Input()
    readOnly: boolean = false;

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    comments: Comment [] = [];

    private commentObserver: Observer<Comment>;
    comment$: Observable<Comment>;

    message: string;

    beingAdded: boolean = false;

    /**
     * Constructor
     * @param translate Translation service
     * @param activitiTaskList Task service
     */
    constructor(translateService: AlfrescoTranslationService,
                private activitiTaskList: TaskListService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'assets/ng2-activiti-tasklist');
        }

        this.comment$ = new Observable<Comment>(observer =>  this.commentObserver = observer).share();
        this.comment$.subscribe((comment: Comment) => {
            this.comments.push(comment);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        let taskId = changes['taskId'];
        if (taskId) {
            if (taskId.currentValue) {
                this.getTaskComments(taskId.currentValue);
            } else {
                this.resetComments();
            }
        }
    }

    private getTaskComments(taskId: string): void {
        this.resetComments();
        if (taskId) {
            this.activitiTaskList.getComments(taskId).subscribe(
                (res: Comment[]) => {
                    res = res.sort((comment1: Comment, comment2: Comment) => {
                        let date1 = new Date(comment1.created);
                        let date2 = new Date(comment2.created);
                        return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
                    });

                    res.forEach((comment) => {
                        this.commentObserver.next(comment);
                    });
                },
                (err) => {
                    this.error.emit(err);
                }
            );
        }
    }

    private resetComments(): void {
        this.comments = [];
    }

    add(): void {
        if (this.message && this.message.trim() && !this.beingAdded) {
            this.beingAdded = true;
            this.activitiTaskList.addComment(this.taskId, this.message).subscribe(
                (res: Comment) => {
                    this.comments.unshift(res);
                    this.message = '';
                    this.beingAdded = false;
                },
                (err) => {
                    this.error.emit(err);
                    this.beingAdded = false;
                }
            );
        }
    }

    clear(): void {
        this.message = '';
    }

    isReadOnly(): boolean {
        return this.readOnly;
    }
}
