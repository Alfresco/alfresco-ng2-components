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

/* tslint:disable:component-selector, no-console  */

import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import {
    baseHost,
    WidgetComponent,
    FormService,
    LogService,
    ThumbnailService,
    ProcessContentService,
    //  ExternalContentLink,
    ActivitiContentService,
    ContentLinkModel
    // ExternalContent
} from '@alfresco/adf-core';
import { ContentNodeDialogService } from '@alfresco/adf-content-services';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'attach-widget',
    templateUrl: './share-attach-widget.component.html',
    styleUrls: ['./share-attach-widget.component.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class ShareAttachWidgetComponent extends WidgetComponent implements OnInit {

    @ViewChild('uploadFiles')
    fileInput: ElementRef;

    hasFile: boolean;
    displayText: string;
    multipleOption: string = '';
    mimeTypeIcon: string;
    alfrescoLogoUrl: string ='../assets/images/alfresco-flower.svg';

    constructor(public formService: FormService,
                private logService: LogService,
                public thumbnailService: ThumbnailService,
                public processContentService: ProcessContentService,
                private activitiContentService: ActivitiContentService,
                private contentDialog: ContentNodeDialogService) {
        super();
    }

    ngOnInit() {
        if (this.field &&
            this.field.value &&
            this.field.value.length > 0) {
            this.hasFile = true;
        }
        this.getMultipleFileParam();
    }

    isAllFileSourceAllowed(){
        return this.field.params &&
               this.field.params.fileSource &&
               this.field.params.fileSource.serviceId === 'all-file-sources';
    }

    openSelectDialog() {
        if (this.field) {
            let params = this.field.params;
            if (params &&
                params.fileSource &&
                params.fileSource.selectedFolder) {
                this.contentDialog.openFileBrowseDialogByFolderId(params.fileSource.selectedFolder.pathId).subscribe(
                    (selections: MinimalNodeEntryEntity[]) => {
                        this.activitiContentService.applyAlfrescoNode(selections,
                            params.fileSource.selectedFolder.siteId,
                            params.fileSource.selectedFolder.accountId).subscribe;
                    });
            } else {
                this.contentDialog.openFileBrowseDialogBySite().subscribe(
                    (selections: MinimalNodeEntryEntity[]) => {
                        this.activitiContentService.applyAlfrescoNode(selections,
                            params.fileSource.selectedFolder.siteId,
                            params.fileSource.selectedFolder.accountId).subscribe;
                    });
            }
        }
    }

    removeFile(file: any) {
        if (this.field) {
            this.removeElementFromList(file);
        }
    }

    onFileChanged(event: any) {
        let files = event.target.files;
        let filesSaved = [];

        if (this.field.json.value) {
            filesSaved = [...this.field.json.value];
        }

        if (files && files.length > 0) {
            Observable.from(files).mergeMap(file => this.uploadRawContent(file)).subscribe((res) => {
                    filesSaved.push(res);
                },
                (error) => {
                    this.logService.error('Error uploading file. See console output for more details.');
                },
                () => {
                    this.field.value = filesSaved;
                    this.field.json.value = filesSaved;
                });

            this.hasFile = true;
        }
    }

    private uploadRawContent(file): Observable<any> {
        return this.processContentService.createTemporaryRawRelatedContent(file)
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

    private removeElementFromList(file) {
        let index = this.field.value.indexOf(file);

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

    fileClicked(obj: any): void {
        const file = new ContentLinkModel(obj);
        let fetch = this.processContentService.getContentPreview(file.id);
        if (file.isTypeImage() || file.isTypePdf()) {
            fetch = this.processContentService.getFileRawContent(file.id);
        }
        fetch.subscribe(
            (blob: Blob) => {
                file.contentBlob = blob;
                this.formService.formContentClicked.next(file);
            },
            (error) => {
                this.logService.error('Unable to send event for file ' + file.name);
            }
        );
    }

}
