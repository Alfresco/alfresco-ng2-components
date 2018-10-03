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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-file-view',
    templateUrl: 'file-view.component.html',
    styleUrls: ['file-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FileViewComponent implements OnInit {

    nodeId: string = null;
    displayEmptyMetadata = false;
    expanded: boolean;
    multi = false;
    isReadOnly = false;
    isPreset = false;
    customPreset: string = null;
    displayDefaultProperties = true;
    showToolbar = true;
    displayName = null;
    urlFile = null;
    allowGoBack = true;
    openWith = false;
    allowDownload = true;
    allowPrint = true;
    allowShare = true;
    allowSidebar = true;
    allowLeftSidebar = true;
    moreActions = true;
    customName = false;
    fileUrlSwitch = false;
    showLeftSidebar = null;
    showRightSidebar = false;
    customToolbar = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private snackBar: MatSnackBar,
                private apiService: AlfrescoApiService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params.nodeId;
            if (id) {
                this.apiService.getInstance().nodes.getNodeInfo(id).then(
                    (node) => {
                        if (node && node.isFile) {
                            this.nodeId = id;
                            return;
                        }
                        this.router.navigate(['/files', id]);
                    },
                    () => this.router.navigate(['/files', id])
                );
            }
        });
    }

    onUploadError(errorMessage: string) {
        this.snackBar.open(errorMessage, '', { duration: 4000 });
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

    toggleShowToolbar() {
        this.showToolbar = !this.showToolbar;
    }

    toggleAllowGoBack() {
        this.allowGoBack = !this.allowGoBack;
    }

    toggleOpenWith() {
        this.openWith = !this.openWith;
    }

    toggleAllowDownload() {
        this.allowDownload = !this.allowDownload;
    }

    toggleAllowPrint() {
        this.allowPrint = !this.allowPrint;
    }

    toggleAllowShare() {
        this.allowShare = !this.allowShare;
    }

    toggleOpenMoreActions() {
        this.moreActions = !this.moreActions;
    }

    toggleShowRightSidebar() {
        this.showRightSidebar = !this.showRightSidebar;
    }

    hideLeftSidebar() {
        this.showLeftSidebar = false;
    }

    toggleAllowSidebar() {
        this.allowSidebar = !this.allowSidebar;
    }

    toggleAllowLeftSidebar() {
        this.allowLeftSidebar = !this.allowLeftSidebar;
    }

    toggleCustomName() {
        this.customName = !this.customName;

        if (!this.customName) {
            this.displayName = null;
        }
    }

    toggleFileUrl() {
        this.fileUrlSwitch = !this.fileUrlSwitch;

        if (!this.fileUrlSwitch) {
            this.urlFile = null;
        }
    }

    togglePreset() {
        this.isPreset = !this.isPreset;
        if (!this.isPreset) {
            this.customPreset = null;
        }
    }

    toggleToolbar() {
        this.customToolbar = !this.customToolbar;
    }

    applyCustomPreset() {
        this.isPreset = false;
        setTimeout(() => {
            this.isPreset = true;
        }, 100);
    }
}
