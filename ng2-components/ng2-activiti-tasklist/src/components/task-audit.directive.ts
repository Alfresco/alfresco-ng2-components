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

import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ContentService } from 'ng2-alfresco-core';
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
export class TaskAuditDirective implements OnInit, OnChanges {

    @Input('task-id')
    taskId: string;

    @Input()
    fileName: string = 'Audit';

    @Input()
    format: string = 'pdf';

    @Input()
    download: boolean = true;

    @Output()
    clicked: EventEmitter<any> = new EventEmitter<any>();

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

    ngOnInit() {
        console.log('OnInit');
    }
    ngOnChanges(changes: SimpleChanges): void {
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
