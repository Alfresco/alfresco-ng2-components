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

import { CommentModel, CommentProcessService } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';

@Component({
    selector: 'adf-process-instance-comments',
    templateUrl: './process-comments.component.html',
    styleUrls: ['./process-comments.component.scss']
})
export class ProcessCommentsComponent implements OnChanges {

    /** (**required**) The numeric ID of the process instance to display comments for. */
    @Input()
    processInstanceId: string;

    /** Should the comments be read-only? */
    @Input()
    readOnly: boolean = true;

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    comments: CommentModel [] = [];

    private commentObserver: Observer<CommentModel>;
    comment$: Observable<CommentModel>;

    message: string;

    beingAdded: boolean = false;

    constructor(private commentProcessService: CommentProcessService) {
        this.comment$ = new Observable<CommentModel>(observer =>  this.commentObserver = observer)
            .pipe(share());
        this.comment$.subscribe((comment: CommentModel) => {
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
                (res: CommentModel[]) => {
                    res = res.sort((comment1: CommentModel, comment2: CommentModel) => {
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
                    (res: CommentModel) => {
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
