/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, DestroyRef, inject, isDevMode, OnInit, ViewEncapsulation } from '@angular/core';
import { AppConfigService, AppConfigValues, DownloadService, ErrorWidgetComponent, FormService, ThumbnailService } from '@alfresco/adf-core';
import { AlfrescoIconComponent, ContentNodeDialogService, ContentService } from '@alfresco/adf-content-services';
import { AlfrescoEndpointRepresentation, Node, NodeChildAssociation, RelatedContentRepresentation } from '@alfresco/js-api';
import { from, of, zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AttachFileWidgetDialogService } from './attach-file-widget-dialog.service';
import { UploadWidgetComponent } from '../upload/upload.widget';
import { ProcessContentService } from '../../services/process-content.service';
import { ActivitiContentService } from '../../services/activiti-alfresco.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'attach-widget',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatListModule,
        ErrorWidgetComponent,
        AlfrescoIconComponent
    ],
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
export class AttachFileWidgetComponent extends UploadWidgetComponent implements OnInit {
    typeId = 'AttachFileWidgetComponent';
    repositoryList: AlfrescoEndpointRepresentation[] = [];
    isStartProcessPage = false;

    private tempFilesList = [];

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        public formService: FormService,
        public thumbnails: ThumbnailService,
        public processContentService: ProcessContentService,
        private activitiContentService: ActivitiContentService,
        private contentService: ContentService,
        private contentDialog: ContentNodeDialogService,
        private appConfigService: AppConfigService,
        private downloadService: DownloadService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private attachDialogService: AttachFileWidgetDialogService
    ) {
        super(formService, thumbnails, processContentService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.isStartProcessPage = this.router.url.split('?')[0].includes('start-process');
        if (Array.isArray(this.field.value) && this.isFileSourceConfigured()) {
            this.tempFilesList.push(...this.field.value);
        }

        this.activitiContentService.getAlfrescoRepositories().subscribe((repoList) => {
            this.repositoryList = repoList;
        });

        this.formService.taskSaved.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((formSaved) => {
            if (formSaved.form.id === this.field.form.id) {
                this.tempFilesList = [];
            }
        });
    }

    isFileSourceConfigured(): boolean {
        return !!this.field.params?.fileSource;
    }

    isMultipleSourceUpload(): boolean {
        return !this.field.readOnly && this.isFileSourceConfigured() && !this.isOnlyLocalSourceSelected();
    }

    isAllFileSourceSelected(): boolean {
        return this.field.params?.fileSource?.serviceId === 'all-file-sources' && !this.field.params.link;
    }

    isOnlyLocalSourceSelected(): boolean {
        return this.field.params?.fileSource?.serviceId === 'local-file';
    }

    isSimpleUploadButton(): boolean {
        return (this.isUploadButtonVisible() && !this.isFileSourceConfigured()) || this.isOnlyLocalSourceSelected();
    }

    isUploadButtonVisible(): boolean {
        return (!this.hasFile || this.multipleOption) && !this.field.readOnly;
    }

    isDefinedSourceFolder(): boolean {
        return !!this.field.params?.fileSource?.selectedFolder;
    }

    isTemporaryFile(file: { name?: string }): boolean {
        return this.tempFilesList.findIndex((elem) => elem.name === file.name) >= 0;
    }

    getNodeFromTempFile(file: { name?: string }): NodeChildAssociation {
        return this.tempFilesList.find((elem) => elem.name === file.name);
    }

    openSelectDialogFromFileSource() {
        const params = this.field.params;
        const repository = this.repositoryList.find((repo) => repo.name === params?.fileSource?.name);
        if (repository && this.isExternalHost(repository)) {
            this.uploadFileFromExternalCS(repository, params?.fileSource?.selectedFolder?.pathId);
        } else {
            this.contentDialog.openFileBrowseDialogByFolderId(params.fileSource.selectedFolder.pathId).subscribe((selections: Node[]) => {
                this.tempFilesList.push(...selections);
                this.updateNodesParams();
                this.uploadFileFromCS(
                    selections,
                    this.field.params.fileSource.selectedFolder.accountId,
                    this.field.params.fileSource.selectedFolder.siteId
                );
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
            this.updateNodesParams();
        }
        this.removeFile(file);
    }

    onAttachFileClicked(file: any) {
        if (file.isExternal || (!file.sourceId && (this.isStartProcessPage || !file.contentAvailable))) {
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
                () => {}
            );
        }
    }

    openSelectDialog(repository: AlfrescoEndpointRepresentation) {
        if (this.isExternalHost(repository) && !isDevMode()) {
            this.uploadFileFromExternalCS(repository);
        } else {
            this.contentDialog.openFileBrowseDialogByDefaultLocation().subscribe((selections: Node[]) => {
                if (selections.length) {
                    this.tempFilesList.push(...selections);
                    this.updateNodesParams();
                    this.uploadFileFromCS(selections, `alfresco-${repository.id}-${repository.name}Alfresco`);
                }
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
        return this.repositoryList.find((repository) => sourceIdentifier === `alfresco-${repository.id}-${repository.name}`);
    }

    private uploadFileFromExternalCS(repository: AlfrescoEndpointRepresentation, currentFolderId?: string) {
        const accountIdentifier = `alfresco-${repository.id}-${repository.name}Alfresco`;
        this.attachDialogService.openLogin(repository, currentFolderId, accountIdentifier).subscribe((selections) => {
            selections.forEach((node) => (node['isExternal'] = true));
            this.tempFilesList.push(...selections);
            this.uploadFileFromCS(selections, accountIdentifier);
        });
    }

    private uploadFileFromCS(fileNodeList: Node[], accountId: string, siteId?: string) {
        const filesSaved = [];

        fileNodeList.forEach((node) => {
            node.isLink = this.field.params.link;
        });

        from(fileNodeList)
            .pipe(
                mergeMap((node) =>
                    zip(of(node?.content?.mimeType), this.activitiContentService.applyAlfrescoNode(node, siteId, accountId), of(node['isExternal']))
                )
            )
            .subscribe(
                ([mimeType, res, isExternal]) => {
                    res.mimeType = mimeType;
                    res['isExternal'] = isExternal;
                    filesSaved.push(res);
                },
                () => {},
                () => {
                    const previousFiles = this.field.value ? this.field.value : [];
                    this.field.value = [...previousFiles, ...filesSaved];
                    this.field.json.value = [...previousFiles, ...filesSaved];
                    this.hasFile = true;
                }
            );
    }

    private updateNodesParams(): void {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { nodes: this.tempFilesList.map((file) => file.id).join(',') },
            queryParamsHandling: 'merge'
        });
    }

    private getDomainHost(urlToCheck: string): string {
        const result = urlToCheck.match('^(?:https?://)?(?:[^@/\n]+@)?(?:www\\.)?([^:/?\n]+)');
        return result[1];
    }
}
