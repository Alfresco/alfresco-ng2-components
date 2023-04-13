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

import { CommentModel } from '@alfresco/adf-core';
import { CommentProcessService } from './services/comment-process.service';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { share, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-process-instance-comments',
    templateUrl: './process-comments.component.html',
    styleUrls: ['./process-comments.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-process-instance-comments' }
})
export class ProcessCommentsComponent implements OnChanges, OnDestroy {

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
    comment$: Observable<CommentModel>;
    message: string;
    beingAdded: boolean = false;

    private commentObserver: Observer<CommentModel>;
    private onDestroy$ = new Subject<boolean>();

    constructor(private commentProcessService: CommentProcessService) {
        this.comment$ = new Observable<CommentModel>(observer =>  this.commentObserver = observer).pipe(share());
        this.comment$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(comment => this.comments.push(comment));
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnChanges(changes: SimpleChanges) {
        const processInstanceId = changes['processInstanceId'];
        if (processInstanceId) {
            if (processInstanceId.currentValue) {
                this.getProcessInstanceComments(processInstanceId.currentValue);
            } else {
                this.resetComments();
            }
        }
    }

    add(): void {
        if (this.message && this.message.trim() && !this.beingAdded) {
            this.beingAdded = true;
            this.commentProcessService.add(this.processInstanceId, this.message)
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

    private getProcessInstanceComments(processInstanceId: string): void {
        this.resetComments();
        if (processInstanceId) {
            this.commentProcessService.get(processInstanceId).subscribe(
                (res: CommentModel[]) => {
                    res = res.sort((comment1: CommentModel, comment2: CommentModel) => {
                        const date1 = new Date(comment1.created);
                        const date2 = new Date(comment2.created);
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
}
