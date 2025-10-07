/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ADF_COMMENTS_SERVICE, CommentsComponent } from '@alfresco/adf-core';
import { CommentProcessService } from './services/comment-process.service';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'adf-process-instance-comments',
    imports: [CommonModule, CommentsComponent],
    providers: [
        {
            provide: ADF_COMMENTS_SERVICE,
            useClass: CommentProcessService
        }
    ],
    templateUrl: './process-comments.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ProcessCommentsComponent {
    /** (**required**) The numeric ID of the process instance to display comments for. */
    @Input({ required: true })
    processInstanceId: string;

    /** Should the comments be read-only? */
    @Input()
    readOnly: boolean;
}
