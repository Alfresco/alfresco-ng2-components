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
import { mergeMap, map, catchError } from 'rxjs/operators';
import { WidgetComponent, baseHost, LogService, FormService, ThumbnailService, ContentLinkModel } from '@alfresco/adf-core';
import { ProcessCloudContentService } from '../services/process-cloud-content.service';

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

    @ViewChild('uploadFiles')
    fileInput: ElementRef;

    constructor(
        public formService: FormService,
        private thumbnailService: ThumbnailService,
        public processCloudContentService: ProcessCloudContentService,
        private logService: LogService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field &&
            this.field.value &&
            this.field.value.length > 0) {
            this.hasFile = true;
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
        const filesSaved = [];

        if (files && files.length > 0) {
            from(files)
                .pipe(mergeMap((file) => this.uploadRawContent(file)))
                .subscribe(
                    (res) => {
                        filesSaved.push(res);
                    },
                    (error) => this.logService.error(`Error uploading file. See console output for more details. ${error}`),
                    () => {
                        this.fixIncompatibilityFromPreviousAndNewForm(filesSaved);
                        this.hasFile = true;
                    }
                );
        }
    }

    fixIncompatibilityFromPreviousAndNewForm(filesSaved) {
        this.field.value = filesSaved;
        this.field.form.values[this.field.id] = filesSaved;
        this.hasFile = true;
    }

    getIcon(mimeType) {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    private uploadRawContent(file): Observable<any> {
        return this.processCloudContentService.createTemporaryRawRelatedContent(file, this.field.form.nodeId, this.field.form.contentHost)
            .pipe(
                map((response: any) => {
                    this.logService.info(response);
                    return {
                        nodeId: response.id,
                        name: response.name,
                        content: response.content,
                        createdAt: response.createdAt
                    };
                }),
                catchError((err) => this.handleError(err))
            );
    }

    private handleError(error: any): any {
        return this.logService.error(error || 'Server error');
    }

    getMultipleFileParam() {
        if (this.field &&
            this.field.params &&
            this.field.params.multiple) {
            this.multipleOption = this.field.params.multiple ? 'multiple' : '';
        }
    }

    private removeElementFromList(file) {
        const savedValues = this.field.form.values[this.field.id]
                            ? this.field.form.values[this.field.id] : this.field.value;
        const index = savedValues.indexOf(file);
        if (index !== -1) {
            const filteredValues = savedValues.filter((value: any) => value.nodeId !== file.nodeId);
            this.resetFormValues(filteredValues);
        }
    }

    private resetFormValues(values) {
        if (values && values.length > 0) {
            this.field.value = values;
            this.field.form.values[this.field.id] = values;
            this.hasFile = this.field.form.values[this.field.id].length > 0;
        } else {
            this.field.value = [];
            this.field.form.values[this.field.id] = [];
            this.hasFile = false;
        }
    }

    fileClicked(file: ContentLinkModel): void {
        this.formService.formContentClicked.next(file);
    }
}
