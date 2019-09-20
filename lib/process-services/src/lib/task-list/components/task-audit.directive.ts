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

/* tslint:disable:no-input-rename  */

import { ContentService } from '@alfresco/adf-core';
import { Directive, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TaskListService } from './../services/tasklist.service';

const JSON_FORMAT: string = 'json';
const PDF_FORMAT: string = 'pdf';

@Directive({
    selector: 'button[adf-task-audit]',
    host: {
        'role': 'button',
        '(click)': 'onClickAudit()'
    }
})
export class TaskAuditDirective implements OnChanges {

    /** (**required**) The id of the task. */
    @Input('task-id')
    taskId: string;

    /** Name of the downloaded file (for PDF downloads). */
    @Input()
    fileName: string = 'Audit';

    /** Format of the audit information. Can be "pdf" or "json". */
    @Input()
    format: string = 'pdf';

    /** Enables downloading of the audit when the decorated element is clicked. */
    @Input()
    download: boolean = true;

    /** Emitted when the decorated element is clicked. */
    @Output()
    clicked: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    public audit: any;

    /**
     *
     * @param translateService
     * @param taskListService
     */
    constructor(private contentService: ContentService,
                private taskListService: TaskListService) {
    }

    ngOnChanges(): void {
        if (!this.isValidType()) {
            this.setDefaultFormatType();
        }
    }

    isValidType() {
        if (this.format && (this.isJsonFormat() || this.isPdfFormat())) {
            return true;
        }
        return false;
    }

    setDefaultFormatType(): void {
        this.format = PDF_FORMAT;
    }

    /**
     * fetch the audit information in the requested format
     */
    fetchAuditInfo(): void {
        if (this.isPdfFormat()) {
            this.taskListService.fetchTaskAuditPdfById(this.taskId).subscribe(
                (blob: Blob) => {
                    this.audit = blob;
                    if (this.download) {
                        this.contentService.downloadBlob(this.audit, this.fileName + '.pdf');
                    }
                    this.clicked.emit({ format: this.format, value: this.audit, fileName: this.fileName });
                },
                (err) => {
                    this.error.emit(err);
                });
        } else {
            this.taskListService.fetchTaskAuditJsonById(this.taskId).subscribe(
                (res) => {
                    this.audit = res;
                    this.clicked.emit({ format: this.format, value: this.audit, fileName: this.fileName });
                },
                (err) => {
                    this.error.emit(err);
                });
        }
    }

    onClickAudit() {
        this.fetchAuditInfo();
    }

    isJsonFormat() {
        return this.format === JSON_FORMAT;
    }

    isPdfFormat() {
        return this.format === PDF_FORMAT;
    }

}
