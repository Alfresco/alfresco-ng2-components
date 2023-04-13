/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/* eslint-disable @angular-eslint/component-selector */

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
    AppConfigService,
    AppConfigValues,
    DownloadService,
    FormService,
    LogService,
    ThumbnailService
} from '@alfresco/adf-core';
import { ContentNodeDialogService, ContentService } from '@alfresco/adf-content-services';
import {
    AlfrescoEndpointRepresentation,
    Node,
    NodeChildAssociation,
    RelatedContentRepresentation
} from '@alfresco/js-api';
import { from, of, Subject, zip } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { AttachFileWidgetDialogService } from './attach-file-widget-dialog.service';
import { UploadWidgetComponent } from '../upload/upload.widget';
import { ProcessContentService } from '../../services/process-content.service';
import { ActivitiContentService } from '../../services/activiti-alfresco.service';

@Component({
    selector: 'attach-widget',
    templateUrl: './attach-file-widget.component.html',
    styleUrls: ['./attach-file-widget.component.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class AttachFileWidgetComponent extends UploadWidgetComponent implements OnInit, OnDestroy {

    typeId = 'AttachFileWidgetComponent';
    repositoryList: AlfrescoEndpointRepresentation[] = [];
    private tempFilesList = [];
    private onDestroy$ = new Subject<boolean>();

    constructor(public formService: FormService,
                private logger: LogService,
                public thumbnails: ThumbnailService,
                public processContentService: ProcessContentService,
                private activitiContentService: ActivitiContentService,
                private contentService: ContentService,
                private contentDialog: ContentNodeDialogService,
                private appConfigService: AppConfigService,
                private downloadService: DownloadService,
                private attachDialogService: AttachFileWidgetDialogService) {
        super(formService, logger, thumbnails, processContentService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.activitiContentService.getAlfrescoRepositories().subscribe((repoList) => {
            this.repositoryList = repoList;
        });

        this.formService.taskSaved
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(formSaved => {
                if (formSaved.form.id === this.field.form.id) {
                    this.tempFilesList = [];
                }
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    isFileSourceConfigured(): boolean {
        return !!this.field.params && !!this.field.params.fileSource;
    }

    isMultipleSourceUpload(): boolean {
        return !this.field.readOnly && this.isFileSourceConfigured() && !this.isOnlyLocalSourceSelected();
    }

    isAllFileSourceSelected(): boolean {
        return this.field.params &&
            this.field.params.fileSource &&
            this.field.params.fileSource.serviceId === 'all-file-sources' &&
            !this.field.params.link;
    }

    isOnlyLocalSourceSelected(): boolean {
        return this.field.params &&
            this.field.params.fileSource &&
            this.field.params.fileSource.serviceId === 'local-file';
    }

    isSimpleUploadButton(): boolean {
        return this.isUploadButtonVisible() &&
            !this.isFileSourceConfigured() ||
            this.isOnlyLocalSourceSelected();
    }

    isUploadButtonVisible(): boolean {
        return (!this.hasFile || this.multipleOption) && !this.field.readOnly;
    }

    isDefinedSourceFolder(): boolean {
        return !!this.field.params?.fileSource?.selectedFolder;
    }

    isTemporaryFile(file): boolean {
        return this.tempFilesList.findIndex((elem) => elem.name === file.name) >= 0;
    }

    getNodeFromTempFile(file): NodeChildAssociation {
        return this.tempFilesList.find((elem) => elem.name === file.name);
    }

    openSelectDialogFromFileSource() {
        const params = this.field.params;
        const repository = this.repositoryList.find((repo) => repo.name === params?.fileSource?.name);
        if (repository && this.isExternalHost(repository)) {
            this.uploadFileFromExternalCS(repository, params?.fileSource?.selectedFolder?.pathId);
        } else {
            this.contentDialog.openFileBrowseDialogByFolderId(params.fileSource.selectedFolder.pathId).subscribe(
                (selections: Node[]) => {
                    this.tempFilesList.push(...selections);
                    this.uploadFileFromCS(selections,
                        this.field.params.fileSource.selectedFolder.accountId,
                        this.field.params.fileSource.selectedFolder.siteId);
                });
        }
    }

    onAttachFileChanged(event: any) {
        this.tempFilesList.push(...Array.from(event.target.files));
        this.onFileChanged(event);
    }

    onRemoveAttachFile(file: File | RelatedContentRepresentation) {
        if (this.isTemporaryFile(file)) {
            this.tempFilesList.splice(this.tempFilesList.indexOf((file as RelatedContentRepresentation).contentBlob), 1);
        }
        this.removeFile(file);
    }

    onAttachFileClicked(file: any) {
        if (file.isExternal || !file.contentAvailable) {
            this.logger.info(`The file ${file.name} comes from an external source and cannot be showed at this moment`);
            return;
        }
        if (this.isTemporaryFile(file)) {
            this.formService.formContentClicked.next(file);
        } else {
            this.fileClicked(file);
        }
    }

    downloadContent(file: any | RelatedContentRepresentation): void {
        if (this.isTemporaryFile(file)) {
            const fileBlob = (file as RelatedContentRepresentation).contentBlob;
            if (fileBlob) {
                this.downloadService.downloadBlob(fileBlob, file.name);
            } else {
                const nodeUploaded: NodeChildAssociation = this.getNodeFromTempFile(file);
                const nodeUrl = this.contentService.getContentUrl(nodeUploaded.id);
                this.downloadService.downloadUrl(nodeUrl, file.name);
            }
        }
        if (file.sourceId) {
            const sourceHost = this.findSource(file.source);
            if (sourceHost && this.isExternalHost(sourceHost)) {
                this.attachDialogService.downloadURL(sourceHost, file.sourceId).subscribe((nodeUrl) => {
                    this.downloadService.downloadUrl(nodeUrl, file.name);
                });
            } else {
                const nodeUrl = this.contentService.getContentUrl(file.sourceId);
                this.downloadService.downloadUrl(nodeUrl, file.name);
            }
        } else {
            this.processContentService.getFileRawContent(file.id).subscribe(
                (blob: Blob) => {
                    this.downloadService.downloadBlob(blob, file.name);
                },
                () => {
                    this.logger.error('Impossible retrieve content for download');
                }
            );
        }
    }

    openSelectDialog(repository: AlfrescoEndpointRepresentation) {
        if (this.isExternalHost(repository)) {
            this.uploadFileFromExternalCS(repository);
        } else {
            this.contentDialog.openFileBrowseDialogByDefaultLocation().subscribe(
                (selections: Node[]) => {
                    this.tempFilesList.push(...selections);
                    this.uploadFileFromCS(selections, `alfresco-${repository.id}-${repository.name}`);
                });
        }
    }

    isSelected(): boolean {
        return this.hasFile;
    }

    private isExternalHost(repository: AlfrescoEndpointRepresentation): boolean {
        const currentECMHost = this.getDomainHost(this.appConfigService.get(AppConfigValues.ECMHOST));
        const chosenRepositoryHost = this.getDomainHost(repository.repositoryUrl);
        return chosenRepositoryHost !== currentECMHost;
    }

    private findSource(sourceIdentifier: string): AlfrescoEndpointRepresentation {
        return this.repositoryList.find(repository => sourceIdentifier === `alfresco-${repository.id}-${repository.name}`);
    }

    private uploadFileFromExternalCS(repository: AlfrescoEndpointRepresentation, currentFolderId?: string) {
        const accountIdentifier = `alfresco-${repository.id}-${repository.name}`;
        this.attachDialogService.openLogin(repository, currentFolderId, accountIdentifier).subscribe(
            (selections: any[]) => {
                selections.forEach((node) => node.isExternal = true);
                this.tempFilesList.push(...selections);
                this.uploadFileFromCS(selections, accountIdentifier);
            });
    }

    private uploadFileFromCS(fileNodeList: any[], accountId: string, siteId?: string) {
        const filesSaved = [];

        fileNodeList.forEach(node => {
            node.isLink = this.field.params.link;
        });

        from(fileNodeList).pipe(
            mergeMap((node) =>
                zip(
                    of(node?.content?.mimeType),
                    this.activitiContentService.applyAlfrescoNode(node, siteId, accountId),
                    of(node.isExternal)
                )
            )
        )
            .subscribe(([mimeType, res, isExternal]) => {
                    res.mimeType = mimeType;
                    res.isExternal = isExternal;
                    filesSaved.push(res);
                },
                (error) => {
                    this.logger.error(error);
                },
                () => {
                    const previousFiles = this.field.value ? this.field.value : [];
                    this.field.value = [...previousFiles, ...filesSaved];
                    this.field.json.value = [...previousFiles, ...filesSaved];
                    this.hasFile = true;
                });
    }

    private getDomainHost(urlToCheck: string): string {
        const result = urlToCheck.match('^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)');
        return result[1];
    }

}
