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

import { CommentProcessModel, CommentProcessService } from '@adf/core';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

@Component({
    selector: 'adf-comments',
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

    comments: CommentProcessModel [] = [];

    private commentObserver: Observer<CommentProcessModel>;
    comment$: Observable<CommentProcessModel>;

    message: string;

    beingAdded: boolean = false;

    constructor(private commentProcessService: CommentProcessService) {
        this.comment$ = new Observable<CommentProcessModel>(observer =>  this.commentObserver = observer).share();
        this.comment$.subscribe((comment: CommentProcessModel) => {
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
            this.commentProcessService.getTaskComments(taskId).subscribe(
                (res: CommentProcessModel[]) => {
                    res = res.sort((comment1: CommentProcessModel, comment2: CommentProcessModel) => {
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
            this.commentProcessService.addTaskComment(this.taskId, this.message)
            .subscribe(
                (res: CommentProcessModel) => {
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
