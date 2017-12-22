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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {
    baseHost,
    UploadWidgetComponent,
    FormService,
    LogService,
    ThumbnailService,
    ProcessContentService,
    ActivitiContentService
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
export class ShareAttachWidgetComponent extends UploadWidgetComponent implements OnInit {

    alfrescoLogoUrl: string ='../assets/images/alfresco-flower.svg';

    private repositoryList = [];

    constructor(public formService: FormService,
        private logger: LogService,
        public thumbnails: ThumbnailService,
        public processContentService: ProcessContentService,
        private activitiContentService: ActivitiContentService,
        private contentDialog: ContentNodeDialogService) {

        super(formService, logger, thumbnails, processContentService);
    }

    ngOnInit(){
        if (this.field &&
            this.field.value &&
            this.field.value.length > 0) {
            this.hasFile = true;
        }
        this.getMultipleFileParam();
        this.activitiContentService.getAlfrescoRepositories(null, true).subscribe((repoList) => {
            this.repositoryList = repoList;
        });
    }

    isFileSourceConfigured(): boolean {
        return !!this.field.params && !!this.field.params.fileSource;
    }

    isMultipleSourceUpload(){
        return  !this.field.readOnly && this.isFileSourceConfigured();
    }

    isAllFileSourceAllowed() {
        return this.field.params &&
            this.field.params.fileSource &&
            this.field.params.fileSource.serviceId === 'all-file-sources';
    }

    isUploadButtonVisible(){
        return (!this.hasFile || this.multipleOption) && !this.field.readOnly;
    }

    isDefinedSourceFolder(){
        return !!this.field.params &&
               !!this.field.params.fileSource &&
               !!this.field.params.fileSource.selectedFolder;
    }

    openSelectDialog(repoId: string, repoName: string) {
        if (this.field) {
            let params = this.field.params;
            const accountIdentifier = 'alfresco-'+repoId+repoName;
            if (params &&
                params.fileSource &&
                params.fileSource.selectedFolder) {
                this.contentDialog.openFileBrowseDialogByFolderId(params.fileSource.selectedFolder.pathId).subscribe(
                    (selections: MinimalNodeEntryEntity[]) => {
                        this.uploadFileFromShare(selections,
                                this.field.params.fileSource.selectedFolder.siteId,
                                accountIdentifier);
                    });
            } else {
                this.contentDialog.openFileBrowseDialogBySite().subscribe(
                    (selections: MinimalNodeEntryEntity[]) => {
                        this.uploadFileFromShare(selections,null,accountIdentifier);
                    });
            }
        }
    }

    uploadFileFromShare(fileNodeList: MinimalNodeEntryEntity[], siteId: string, accountId: string) {
        let filesSaved = [];
        Observable.from(fileNodeList)
            .mergeMap(node =>
                this.activitiContentService.applyAlfrescoNode(node,
                    siteId,
                    accountId)
            ).subscribe((res) => {
                filesSaved.push(res);
            },
            (error) => { this.logger.error(error) },
            () => {
                this.field.value = filesSaved;
                this.field.json.value = filesSaved;
            });
            this.hasFile = true;
    }

}
