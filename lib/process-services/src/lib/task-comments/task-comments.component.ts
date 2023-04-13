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

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ADF_COMMENTS_SERVICE } from '@alfresco/adf-core';
import { TaskCommentsService } from './services/task-comments.service';

@Component({
    selector: 'adf-task-comments',
    templateUrl: './task-comments.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [{
        provide: ADF_COMMENTS_SERVICE,
        useClass: TaskCommentsService
    }]
})
export class TaskCommentsComponent {
    /** The numeric ID of the task. */
    @Input()
    taskId: string;

    /** Determines if comments are read only. */
    @Input()
    readOnly: boolean;
}
