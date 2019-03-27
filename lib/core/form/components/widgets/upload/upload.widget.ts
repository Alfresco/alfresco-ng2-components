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

import { LogService } from '../../../../services/log.service';
import { ThumbnailService } from '../../../../services/thumbnail.service';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, from } from 'rxjs';
import { FormService } from '../../../services/form.service';
import { ProcessContentService } from '../../../services/process-content.service';
import { ContentLinkModel } from '../core/content-link.model';
import { baseHost, WidgetComponent } from './../widget.component';
import { mergeMap, map } from 'rxjs/operators';

@Component({
    selector: 'upload-widget',
    templateUrl: './upload.widget.html',
    styleUrls: ['./upload.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class UploadWidgetComponent extends WidgetComponent implements OnInit {

    hasFile: boolean;
    displayText: string;
    multipleOption: string = '';
    mimeTypeIcon: string;

    @ViewChild('uploadFiles')
    fileInput: ElementRef;

    constructor(public formService: FormService,
                private logService: LogService,
                private thumbnailService: ThumbnailService,
                public processContentService: ProcessContentService) {
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
                    () => this.logService.error('Error uploading file. See console output for more details.'),
                    () => {
                        this.field.value = filesSaved;
                        this.field.json.value = filesSaved;
                        this.hasFile = true;
                    }
                );
        }
    }

    private uploadRawContent(file): Observable<any> {
        return this.processContentService.createTemporaryRawRelatedContent(file)
            .pipe(
                map((response: any) => {
                    this.logService.info(response);
                    response.contentBlob = file;
                    return response;
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

    getIcon(mimeType) {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    fileClicked(contentLinkModel: any): void {
        const file = new ContentLinkModel(contentLinkModel);
        let fetch = this.processContentService.getContentPreview(file.id);
        if (file.isTypeImage() || file.isTypePdf()) {
            fetch = this.processContentService.getFileRawContent(file.id);
        }
        fetch.subscribe(
            (blob: Blob) => {
                file.contentBlob = blob;
                this.formService.formContentClicked.next(file);
            },
            () => {
                this.logService.error('Unable to send event for file ' + file.name);
            }
        );
    }
}
