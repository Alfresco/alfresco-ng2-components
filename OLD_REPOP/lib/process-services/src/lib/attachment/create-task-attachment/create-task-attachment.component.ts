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

import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ProcessContentService } from '../../form/services/process-content.service';
import { CommonModule } from '@angular/common';
import { RelatedContentRepresentation } from '@alfresco/js-api';
import { MatButtonModule } from '@angular/material/button';
import { UploadDirective } from '@alfresco/adf-core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'adf-create-task-attachment',
    imports: [CommonModule, MatButtonModule, UploadDirective, MatIconModule],
    styleUrls: ['./create-task-attachment.component.scss'],
    templateUrl: './create-task-attachment.component.html'
})
export class AttachmentComponent implements OnChanges {
    private processContentService = inject(ProcessContentService);

    /** (required) The numeric ID of the task to display. */
    @Input({ required: true })
    taskId: string;

    /**
     * Emitted when an error occurs while creating or uploading an
     *  attachment from the user within the component.
     */
    @Output()
    error = new EventEmitter<any>();

    /**
     * Emitted when an attachment is created or uploaded successfully
     * from within the component.
     */
    @Output()
    success = new EventEmitter<RelatedContentRepresentation>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['taskId']?.currentValue) {
            this.taskId = changes['taskId'].currentValue;
        }
    }

    onFileUpload(event: any) {
        const filesList: File[] = event.detail.files.map((obj) => obj.file);

        for (const fileInfoObj of filesList) {
            const file: File = fileInfoObj;
            const opts = {
                isRelatedContent: true
            };
            this.processContentService.createTaskRelatedContent(this.taskId, file, opts).subscribe(
                (res) => {
                    this.success.emit(res);
                },
                (err) => {
                    this.error.emit(err);
                }
            );
        }
    }
}
