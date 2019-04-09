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
import { WidgetComponent, baseHost, LogService, FormService, ThumbnailService } from '@alfresco/adf-core';
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

    @ViewChild('uploadFiles')
    fileInput: ElementRef;

    constructor(public formService: FormService,
                private thumbnailService: ThumbnailService,
                private formCloudService: FormCloudService,
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
        let filesSaved = [];

        if (this.field.json.value) {
            filesSaved = [...this.field.json.value];
        }

        if (files && files.length > 0) {
            from(files)
                .pipe(mergeMap((file) => this.uploadRawContent(file)))
                .subscribe(
                    (res) => filesSaved.push(res),
                    (error) => this.logService.error(`Error uploading file. See console output for more details. ${error}` ),
                    () => {
                        this.field.form.values[this.field.id] = filesSaved;
                        this.hasFile = true;
                    }
                );
        }
    }

    getIcon(mimeType) {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    private uploadRawContent(file): Observable<any> {
        return this.formCloudService.createTemporaryRawRelatedContent(file, this.field.form.nodeId)
            .pipe(
                map((response: any) => {
                    this.logService.info(response);
                    return { nodeId : response.id};
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
        const index = this.field.value.indexOf(file);

        // remove from content too

        if (index !== -1) {
            this.field.value.splice(index, 1);
            this.field.json.value = this.field.value;
            this.field.updateForm();
        }

        this.hasFile = this.field.value.length > 0;

        this.resetFormValueWithNoFiles();
    }

    private resetFormValueWithNoFiles() {
        if (this.field.value.length === 0) {
            this.field.value = [];
            this.field.json.value = [];
        }
    }

    fileClicked(contentLinkModel: any): void {

    }
}
