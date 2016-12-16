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

import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { TaskDetailsModel } from '../models/task-details.model';
import { Observer, Observable } from 'rxjs/Rx';

let dialogPolyfill: any;

@Component({
    selector: 'activiti-checklist',
    moduleId: module.id,
    templateUrl: './activiti-checklist.component.html',
    styleUrls: ['./activiti-checklist.component.css'],
    providers: [ActivitiTaskListService]
})
export class ActivitiChecklist implements OnInit, OnChanges {

    @Input()
    taskId: string;

    @Input()
    readOnly: boolean = false;

    @ViewChild('dialog')
    dialog: any;

    taskName: string;

    checklist: TaskDetailsModel [] = [];

    private taskObserver: Observer<TaskDetailsModel>;
    task$: Observable<TaskDetailsModel>;

    /**
     * Constructor
     * @param auth
     * @param translate
     */
    constructor(private translate: AlfrescoTranslationService,
                private activitiTaskList: ActivitiTaskListService) {

        if (translate) {
            translate.addTranslationFolder('ng2-activiti-tasklist', 'node_modules/ng2-activiti-tasklist/src');
        }
        this.task$ = new Observable<TaskDetailsModel>(observer => this.taskObserver = observer).share();
    }

    ngOnInit() {
        this.task$.subscribe((task: TaskDetailsModel) => {
            this.checklist.push(task);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        let taskId = changes['taskId'];
        if (taskId && taskId.currentValue) {
            this.getTaskChecklist(taskId.currentValue);
            return;
        }
    }

    public getTaskChecklist(taskId: string) {
        this.checklist = [];
        if (this.taskId) {
            this.activitiTaskList.getTaskChecklist(this.taskId).subscribe(
                (res: TaskDetailsModel[]) => {
                    res.forEach((task) => {
                        this.taskObserver.next(task);
                    });
                },
                (err) => {
                    console.log(err);
                }
            );
        } else {
            this.checklist = [];
        }
    }

    public showDialog() {
        if (this.dialog) {
            if (!this.dialog.nativeElement.showModal) {
                dialogPolyfill.registerDialog(this.dialog.nativeElement);
            }
            this.dialog.nativeElement.showModal();
        }
    }

    public add() {
        let newTask = new TaskDetailsModel({name: this.taskName, parentTaskId: this.taskId, assignee: {id: '1'}});
        this.activitiTaskList.addTask(newTask).subscribe(
            (res: TaskDetailsModel) => {
                this.checklist.push(res);
            },
            (err) => {
                console.log(err);
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
