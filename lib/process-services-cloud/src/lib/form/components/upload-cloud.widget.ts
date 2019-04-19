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

/* tslint:disable:component-selector  */

import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, from } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { WidgetComponent, baseHost, LogService, FormService, ThumbnailService, ProcessContentService } from '@alfresco/adf-core';
import { FormCloudService } from '../services/form-cloud.service';

@Component({
    selector: 'upload-cloud-widget',
    templateUrl: './upload-cloud.widget.html',
    styleUrls: ['./upload-cloud.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class UploadCloudWidgetComponent extends WidgetComponent implements OnInit {

    hasFile: boolean;
    displayText: string;
    multipleOption: string = '';
    mimeTypeIcon: string;

    currentFiles = [];

    @ViewChild('uploadFiles')
    fileInput: ElementRef;

    constructor(public formService: FormService,
                private thumbnailService: ThumbnailService,
                private formCloudService: FormCloudService,
                public processContentService: ProcessContentService,
                private logService: LogService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field &&
            this.field.value &&
            this.field.value.length > 0) {
            this.hasFile = true;
            this.currentFiles = [...this.field.value];
        }
        this.getMultipleFileParam();
    }

    removeFile(file: any) {
        if (this.field) {
            this.removeElementFromList(file);
        }
    }

    onFileChanged(event: any) {
        const files = event.target.files;

        if (files && files.length > 0) {
            from(files)
                .pipe(mergeMap((file) => this.uploadRawContent(file)))
                .subscribe(
                    (res) => {
                        this.currentFiles.push(res);
                    },
                    (error) => this.logService.error(`Error uploading file. See console output for more details. ${error}` ),
                    () => {
                        this.fixIncompatibilityFromPreviousAndNewForm(this.currentFiles);
                        this.hasFile = true;
                    }
                );
        }
    }

    fixIncompatibilityFromPreviousAndNewForm(filesSaved) {
        this.field.form.values[this.field.id] = filesSaved;
    }

    getIcon(mimeType) {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    private uploadRawContent(file): Observable<any> {
        return this.formCloudService.createTemporaryRawRelatedContent(file, this.field.form.nodeId)
            .pipe(
                map((response: any) => {
                    this.logService.info(response);
                    return { nodeId : response.id, name: response.name, content: response.content, createdAt: response.createdAt };
                })
            );
    }

    getMultipleFileParam() {
        if (this.field &&
            this.field.params &&
            this.field.params.multiple) {
            this.multipleOption = this.field.params.multiple ? 'multiple' : '';
        }
    }

    private removeElementFromList(file) {
        const index = this.currentFiles.indexOf(file);

        if (index !== -1) {
            this.currentFiles.splice(index, 1);
            this.fixIncompatibilityFromPreviousAndNewForm(this.currentFiles);
        }

        this.hasFile = this.currentFiles.length > 0;

        this.resetFormValueWithNoFiles();
    }

    private resetFormValueWithNoFiles() {
        if (this.currentFiles.length === 0) {
            this.currentFiles = [];
        }
    }

    fileClicked(nodeId: any): void {
        this.formService.formContentClicked.next(nodeId);
    }
}
