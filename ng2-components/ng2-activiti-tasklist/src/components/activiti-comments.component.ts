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

import { Component, Input, Output, OnInit, ViewChild, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { Comment } from '../models/comment.model';
import { Observer, Observable } from 'rxjs/Rx';

@Component({
    selector: 'activiti-comments',
    moduleId: module.id,
    templateUrl: './activiti-comments.component.html',
    styleUrls: ['./activiti-comments.component.css'],
    providers: [ActivitiTaskListService]
})
export class ActivitiComments implements OnInit, OnChanges {

    @Input()
    taskId: string;

    @Input()
    readOnly: boolean = false;

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('dialog')
    dialog: any;

    comments: Comment [] = [];

    private commentObserver: Observer<Comment>;
    comment$: Observable<Comment>;

    message: string;

    /**
     * Constructor
     * @param translate Translation service
     * @param activitiTaskList Task service
     */
    constructor(private translate: AlfrescoTranslationService,
                private activitiTaskList: ActivitiTaskListService) {

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-tasklist/src');
        }

        this.comment$ = new Observable<Comment>(observer =>  this.commentObserver = observer).share();
    }

    ngOnInit() {
        this.comment$.subscribe((comment: Comment) => {
            this.comments.push(comment);
        });
        this.getTaskComments(this.taskId);
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

    private getTaskComments(taskId: string) {
        this.resetComments();
        if (taskId) {
            this.activitiTaskList.getTaskComments(taskId).subscribe(
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
        this.dialog.nativeElement.showModal();
    }

    public add() {
        this.activitiTaskList.addTaskComment(this.taskId, this.message).subscribe(
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
