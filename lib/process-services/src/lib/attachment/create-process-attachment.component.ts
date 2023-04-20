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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ProcessContentService } from '../form/services/process-content.service';

@Component({
    selector: 'adf-create-process-attachment',
    styleUrls: ['./create-process-attachment.component.css'],
    templateUrl: './create-process-attachment.component.html'
})
export class CreateProcessAttachmentComponent implements OnChanges {

    /** (required) The ID of the process instance to display. */
    @Input()
    processInstanceId: string;

    /** Emitted when an error occurs while creating or uploading an attachment
     * from the user within the component.
     */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when an attachment is successfully created or uploaded
     * from within the component.
     */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    constructor(private activitiContentService: ProcessContentService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['processInstanceId'] && changes['processInstanceId'].currentValue) {
            this.processInstanceId = changes['processInstanceId'].currentValue;
        }
    }

    onFileUpload(event: any) {
        const filesList: File[] = event.detail.files.map((obj) => obj.file);

        for (const fileInfoObj of filesList) {
            const file: File = fileInfoObj;
            const opts = {
                isRelatedContent: true
            };
            this.activitiContentService.createProcessRelatedContent(this.processInstanceId, file, opts).subscribe(
                (res) => {
                    this.success.emit(res);
                },
                (err) => {
                    this.error.emit(err);
                });
        }
    }
}
