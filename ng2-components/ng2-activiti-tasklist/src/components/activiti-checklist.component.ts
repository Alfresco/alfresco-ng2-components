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

import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { AlfrescoTranslationService, AlfrescoAuthenticationService, AlfrescoPipeTranslate } from 'ng2-alfresco-core';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';
import { TaskDetailsModel } from '../models/task-details.model';

declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-checklist',
    moduleId: __moduleName,
    templateUrl: './activiti-checklist.component.html',
    styleUrls: ['./activiti-checklist.component.css'],
    providers: [ActivitiTaskListService],
    pipes: [ AlfrescoPipeTranslate ]

})
export class ActivitiChecklist implements OnInit, OnChanges {

    @Input()
    taskId: string;

    checklist: TaskDetailsModel [] = [];

    /**
     * Constructor
     * @param auth
     * @param translate
     */
    constructor(private auth: AlfrescoAuthenticationService,
                private translate: AlfrescoTranslationService,
                private activitiTaskList: ActivitiTaskListService) {

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-tasklist');
        }
    }

    ngOnInit() {
        if (this.taskId) {
            this.load(this.taskId);
        }
    }

    ngOnChanges(change) {
        this.load(this.taskId);
    }

    public add() {
        alert('Add CheckList');
    }

    public load(taskId: string) {
        if (this.taskId) {
            this.activitiTaskList.getTaskChecklist(this.taskId).subscribe(
                (res: TaskDetailsModel[]) => {
                    this.checklist = res;
                }
            );
        } else {
            this.checklist = [];
        }
    }
}
