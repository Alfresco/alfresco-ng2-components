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

import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivitiForm, FormService } from 'ng2-activiti-form';


declare let __moduleName: string;
declare var componentHandler;

@Component({
    moduleId: __moduleName,
    selector: 'activiti-demo',
    templateUrl: './activiti-demo.component.html',
    styleUrls: ['./activiti-demo.component.css'],
    directives: [ActivitiForm],
    providers: [FormService]
})
export class ActivitiDemoComponent implements OnInit, AfterViewChecked {

    tasks: any[] = [];
    selectedTask: any;

    hasTasks(): boolean {
        return this.tasks && this.tasks.length > 0;
    }

    constructor(private formService: FormService) {}

    ngOnInit() {
        this.formService.getTasks().subscribe(val => this.tasks = val || []);
    }

    ngAfterViewChecked() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    onTaskClicked(task, e) {
        this.selectedTask = task;
    }

}
