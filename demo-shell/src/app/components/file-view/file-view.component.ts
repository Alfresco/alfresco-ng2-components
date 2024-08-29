/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ActivatedRoute, PRIMARY_OUTLET, Router } from '@angular/router';
import { ViewerComponent } from '@alfresco/adf-core';
import { AlfrescoViewerComponent, AllowableOperationsEnum, ContentService, NodesApiService, PermissionsEnum } from '@alfresco/adf-content-services';
import { PreviewService } from '../../services/preview.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-file-view',
    standalone: true,
    imports: [CommonModule, AlfrescoViewerComponent, ViewerComponent],
    templateUrl: './file-view.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FileViewComponent implements OnInit {
    nodeId: string = null;
    versionId: string = null;
    expanded: boolean;
    multi = false;
    isReadOnly = false;
    displayDefaultProperties = true;
    isCommentEnabled = false;
    name: string;
    fileName: string;
    blobFile: Blob;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private nodeApiService: NodesApiService,
        private contentServices: ContentService,
        private preview: PreviewService
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

    onViewerClosed() {
        const primaryUrl = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].toString();
        this.router.navigateByUrl(primaryUrl);
    }
}
