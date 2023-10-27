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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import { NotificationService } from '@alfresco/adf-core';
import { ContentService, AllowableOperationsEnum, PermissionsEnum, NodesApiService, FileUploadErrorEvent } from '@alfresco/adf-content-services';
import { PreviewService } from '../../services/preview.service';

@Component({
    selector: 'app-file-view',
    templateUrl: './file-view.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FileViewComponent implements OnInit {
    nodeId: string = null;
    versionId: string = null;
    displayEmptyMetadata = false;
    expanded: boolean;
    multi = false;
    isReadOnly = false;
    isPreset = false;
    customPreset: string = null;
    displayDefaultProperties = true;
    isCommentEnabled = false;
    desiredAspect: string = null;
    showAspect: string = null;
    name: string;
    fileName: string;
    blobFile: Blob;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private nodeApiService: NodesApiService,
        private contentServices: ContentService,
        private preview: PreviewService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            const id = params.nodeId;
            this.versionId = params.versionId;
            if (id) {
                this.nodeApiService.getNode(id).subscribe(
                    (node) => {
                        if (node?.isFile) {
                            this.isCommentEnabled =
                                this.contentServices.hasPermissions(node, PermissionsEnum.NOT_CONSUMER) ||
                                this.contentServices.hasAllowableOperations(node, AllowableOperationsEnum.UPDATE);
                            this.nodeId = id;
                            return;
                        }
                        this.router.navigate(['/files', id]);
                    },
                    () => this.router.navigate(['/files', id])
                );
            } else if (this.preview?.content) {
                this.blobFile = this.preview.content;
                this.fileName = this.preview.name;
            }
        });
    }

    onViewVersion(versionId: string) {
        this.preview.showResource(this.nodeId, versionId);
    }

    onViewerClosed() {
        const primaryUrl = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].toString();
        this.router.navigateByUrl(primaryUrl);
    }

    onUploadError(event: FileUploadErrorEvent) {
        const errorMessage = event.error;
        this.notificationService.showError(errorMessage);
    }

    toggleEmptyMetadata() {
        this.displayEmptyMetadata = !this.displayEmptyMetadata;
    }

    toggleMulti() {
        this.multi = !this.multi;
    }

    toggleReadOnly() {
        this.isReadOnly = !this.isReadOnly;
    }

    toggleDisplayProperties() {
        this.displayDefaultProperties = !this.displayDefaultProperties;
    }

    togglePreset() {
        this.isPreset = !this.isPreset;
        if (!this.isPreset) {
            this.customPreset = null;
        }
    }

    applyCustomPreset() {
        this.isPreset = false;
        setTimeout(() => {
            this.isPreset = true;
        }, 100);
    }

    applyAspect() {
        this.showAspect = this.desiredAspect;
    }
}
