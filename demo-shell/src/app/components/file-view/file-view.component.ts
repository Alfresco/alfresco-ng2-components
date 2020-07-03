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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import { ContentService, AllowableOperationsEnum, PermissionsEnum, NodesApiService } from '@alfresco/adf-core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PreviewService } from '../../services/preview.service';

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
    allowRightSidebar = true;
    allowLeftSidebar = true;
    moreActions = true;
    moreActionsMenu = false;
    customName = false;
    fileUrlSwitch = false;
    showLeftSidebar = null;
    showRightSidebar = false;
    customToolbar = false;
    isCommentEnabled = false;
    showTabWithIcon = false;
    showTabWithIconAndLabel = false;
    desiredAspect: string = null;
    showAspect: string = null;
    content: Blob;
    name: string;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private snackBar: MatSnackBar,
                private nodeApiService: NodesApiService,
                private contentServices: ContentService,
                private preview: PreviewService) {
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            const id = params.nodeId;
            if (id) {
                this.nodeApiService.getNode(id).subscribe(
                    (node) => {
                        if (node && node.isFile) {
                            this.isCommentEnabled = this.contentServices.hasPermissions(node, PermissionsEnum.NOT_CONSUMER) ||
                                this.contentServices.hasAllowableOperations(node, AllowableOperationsEnum.UPDATE);
                            this.nodeId = id;
                            return;
                        }
                        this.router.navigate(['/files', id]);
                    },
                    () => this.router.navigate(['/files', id])
                );
            } else if (this.preview.content) {
                this.content = this.preview.content;
                this.displayName = this.preview.name;
            }
        });
    }

    onViewerVisibilityChanged() {
        const primaryUrl = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].toString();
        this.router.navigateByUrl(primaryUrl);
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

    toggleOpenMoreActions() {
        this.moreActions = !this.moreActions;
    }

    toggleMoreActionsMenu() {
        this.moreActionsMenu = !this.moreActionsMenu;
    }

    toggleShowRightSidebar() {
        this.showRightSidebar = !this.showRightSidebar;
    }

    hideLeftSidebar() {
        this.showLeftSidebar = false;
    }

    toggleAllowRightSidebar() {
        this.allowRightSidebar = !this.allowRightSidebar;
    }

    toggleAllowLeftSidebar() {
        this.allowLeftSidebar = !this.allowLeftSidebar;
    }

    toggleShowTabWithIcon() {
        this.showTabWithIcon = !this.showTabWithIcon;
    }

    toggleShowTabWithIconAndLabel() {
        this.showTabWithIconAndLabel = !this.showTabWithIconAndLabel;
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

    applyAspect() {
        this.showAspect = this.desiredAspect;
    }
}
