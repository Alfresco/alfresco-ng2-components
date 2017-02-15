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

import { Component, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiProcessService } from './../services/activiti-process.service';
import { Comment } from 'ng2-activiti-tasklist';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

declare let componentHandler: any;
declare let dialogPolyfill: any;

@Component({
    selector: 'activiti-process-instance-comments',
    templateUrl: './activiti-process-comments.component.html',
    styleUrls: ['./activiti-process-comments.component.css'],
    providers: [ActivitiProcessService]
})
export class ActivitiProcessComments implements OnChanges {

    @Input()
    processInstanceId: string;

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('dialog')
    dialog: any;

    comments: Comment [] = [];

    commentObserver: Observer<Comment>;

    comment$: Observable<Comment>;

    message: string;

    /**
     * Constructor
     * @param translate Translation service
     * @param activitiProcess Process service
     */
    constructor(private translate: AlfrescoTranslationService,
                private activitiProcess: ActivitiProcessService) {

        if (translate) {
            translate.addTranslationFolder('ng2-activiti-processlist', 'node_modules/ng2-activiti-processlist/src');
        }

        this.comment$ = new Observable<Comment>(observer => this.commentObserver = observer).share();
        this.comment$.subscribe((comment: Comment) => {
            this.comments.push(comment);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        let processInstanceId = changes['processInstanceId'];
        if (processInstanceId) {
            if (processInstanceId.currentValue) {
                this.getProcessComments(processInstanceId.currentValue);
            } else {
                this.resetComments();
            }
        }
    }

    private getProcessComments(processInstanceId: string) {
        this.comments = [];
        if (processInstanceId) {
            this.activitiProcess.getProcessInstanceComments(processInstanceId).subscribe(
                (res: Comment[]) => {
                    res.forEach((comment) => {
                        this.commentObserver.next(comment);
                    });
                },
                (err) => {
                    this.error.emit(err);
                }
            );
        } else {
            this.resetComments();
        }
    }

    private resetComments() {
        this.comments = [];
    }

    public showDialog() {
        if (!this.dialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.dialog.nativeElement);
        }
        if (this.dialog) {
            this.dialog.nativeElement.showModal();
        }
    }

    public add() {
        this.activitiProcess.addProcessInstanceComment(this.processInstanceId, this.message).subscribe(
            (res: Comment) => {
                this.comments.push(res);
                this.message = '';
            },
            (err) => {
                this.error.emit(err);
            }
        );
        this.cancel();
    }

    public cancel() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
    }
}
