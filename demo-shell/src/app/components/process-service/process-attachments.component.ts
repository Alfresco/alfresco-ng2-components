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

import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ProcessInstance, ProcessService ,
    ProcessAttachmentListComponent, ProcessUploadService } from '@alfresco/adf-process-services';
import { UploadService } from '@alfresco/adf-core';

@Component({
    selector: 'app-process-attachments',
    templateUrl: './process-attachments.component.html',
    styleUrls: ['./process-attachments.component.css'],
    providers: [
        {provide: UploadService, useClass: ProcessUploadService}
    ]
})

export class ProcessAttachmentsComponent implements OnInit, OnChanges {

    @Input()
    processInstanceId: string;

    @ViewChild(ProcessAttachmentListComponent)
    processAttachList: ProcessAttachmentListComponent;

    fileShowed: boolean = false;
    content: Blob;
    contentName: string;
    processInstance: ProcessInstance;

    constructor(private uploadService: UploadService, private processService: ProcessService) {
    }

    ngOnInit() {
        this.uploadService.fileUploadComplete.subscribe(value => this.onFileUploadComplete(value.data));
    }

    ngOnChanges() {
        if (this.processInstanceId) {
            this.processService.getProcess(this.processInstanceId).subscribe((processInstance: ProcessInstance) => {
                this.processInstance = processInstance;
            });
        }
    }

    onFileUploadComplete(content: any) {
        this.processAttachList.add(content);
    }

    onAttachmentClick(content: any): void {
        this.fileShowed = true;
        this.content = content.contentBlob;
        this.contentName = content.name;
    }

    isCompletedProcess(): boolean {
        return this.processInstance && this.processInstance.ended !== undefined && this.processInstance.ended !== null;
    }

}
