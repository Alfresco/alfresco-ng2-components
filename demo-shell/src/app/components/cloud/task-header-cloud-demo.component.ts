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

import { Component, ViewChild } from '@angular/core';
import { TaskHeaderCloudComponent } from '@alfresco/adf-process-services-cloud';
import { UntypedFormControl } from '@angular/forms';

@Component({
    templateUrl: './task-header-cloud-demo.component.html',
    styleUrls: ['./task-header-cloud-demo.component.scss']
})
export class TaskHeaderCloudDemoComponent {
    @ViewChild('taskHeader', { static: true })
    taskHeader: TaskHeaderCloudComponent;

    appName: string;
    taskId: string;

    errorMessage;

    appNameFormControl = new UntypedFormControl('');
    taskIdFormControl = new UntypedFormControl('');

    constructor() {}

    updateTaskHeader() {
        this.errorMessage = undefined;
        this.appName = this.appNameFormControl.value;
        this.taskId = this.taskIdFormControl.value;
    }

    onError(error) {
        this.errorMessage = error;
    }
}
