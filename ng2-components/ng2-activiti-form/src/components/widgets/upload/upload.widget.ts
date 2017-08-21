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

/* tslint:disable:component-selector  */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LogService, ThumbnailService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { FormService } from '../../../services/form.service';
import { ContentLinkModel } from '../core/content-link.model';
import { baseHost, WidgetComponent } from './../widget.component';

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

    constructor(public formService: FormService,
                private logService: LogService,
                private thumbnailService: ThumbnailService) {
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

    reset(file: any) {
        if (this.field) {
            this.removeElementFromList(this.field.value, file);
            this.removeElementFromList(this.field.json.value, file);
            this.hasFile = this.field.value.length > 0;
            this.resetFormValueWithNoFiles();
        }
    }

    onFileChanged(event: any) {
        let files = event.target.files;
        let filesSaved = [];
        if (files && files.length > 0) {
            Observable.from(files).
                flatMap(file => this.uploadRawContent(file)).subscribe((res) => {
                    filesSaved.push(res);
                },
                (error) => {
                    this.logService.error('Error uploading file. See console output for more details.');
                },
                () => {
                    this.field.value = filesSaved;
                    this.field.json.value = filesSaved;
                });
        }
    }

    private uploadRawContent(file): Observable<any> {
        return this.formService.createTemporaryRawRelatedContent(file)
            .map((response: any) => {
                this.logService.info(response);
                return response;
            });
    }

    private getMultipleFileParam() {
        if (this.field &&
            this.field.params &&
            this.field.params.multiple) {
            this.multipleOption = this.field.params.multiple ? 'multiple' : '';
        }
    }

    decode(fileName: string): string {
        return decodeURI(fileName);
    }

    private removeElementFromList(list, element) {
        let index = list.indexOf(element);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }

    private resetFormValueWithNoFiles() {
        if (this.field.value.length === 0) {
            this.field.value = null;
            this.field.json.value = null;
        }
    }

    getIcon(mimeType) {
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    fileClicked(file: ContentLinkModel): void {
        this.formService.getFileRawContent(file.id).subscribe(
            (blob: Blob) => {
                file.contentBlob = blob;
                this.formService.formContentClicked.next(file);
            },
            (error) => {
                this.logService.error('Unable to send evento for file ' + file.name);
            }
        );
    }

}
