/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCommentsComponent } from './task-comments.component';
import { TaskCommentsService } from './services/task-comments.service';
import { ADF_COMMENTS_SERVICE, ADF_COMMENT_LIST_SERVICE, CoreModule } from '@alfresco/adf-core';
import { TaskCommentListService } from './services/task-comment-list.service';

@NgModule({
    imports: [
        CommonModule,
        CoreModule
    ],
    declarations: [TaskCommentsComponent],
    exports: [TaskCommentsComponent],
    providers: [
        {
            provide: ADF_COMMENTS_SERVICE,
            useClass: TaskCommentsService
        },
        {
            provide: ADF_COMMENT_LIST_SERVICE,
            useClass: TaskCommentListService
        }
    ]
})
export class TaskCommentsModule {}
