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

import { CommentProcessModel, CommentProcessService } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

@Component({
    selector: 'adf-process-instance-comments',
    templateUrl: './process-comments.component.html',
    styleUrls: ['./process-comments.component.css']
})
export class ProcessCommentsComponent implements OnChanges {

    @Input()
    processInstanceId: string;

    @Input()
    readOnly: boolean = true;

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
        let processInstanceId = changes['processInstanceId'];
        if (processInstanceId) {
            if (processInstanceId.currentValue) {
                this.getProcessInstanceComments(processInstanceId.currentValue);
            } else {
                this.resetComments();
            }
        }
    }

    private getProcessInstanceComments(processInstanceId: string): void {
        this.resetComments();
        if (processInstanceId) {
            this.commentProcessService.getProcessInstanceComments(processInstanceId).subscribe(
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
            this.commentProcessService.addProcessInstanceComment(this.processInstanceId, this.message)
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

    onError(error: any) {
        this.error.emit(error);
    }

}
