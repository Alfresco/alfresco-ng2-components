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

import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ADF_COMMENTS_SERVICE, CommentModel, CommentsComponent } from '@alfresco/adf-core';
import { NodeCommentsService } from './services/node-comments.service';

@Component({
    selector: 'adf-node-comments',
    imports: [CommentsComponent],
    templateUrl: './node-comments.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: ADF_COMMENTS_SERVICE,
            useClass: NodeCommentsService
        }
    ]
})
export class NodeCommentsComponent {
    /** nodeId of the document that has comments */
    @Input({ required: true })
    nodeId: string;

    /** make the comments component readOnly */
    @Input()
    readOnly: boolean;

    /** Emits when a new comment is added */
    @Output()
    commentAdded = new EventEmitter<CommentModel>();
}
