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

import { EXTENDIBLE_COMPONENT, FileUtils } from '@alfresco/adf-core';
import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { NodesApiService } from '../../common/services/nodes-api.service';
import { ContentService } from '../../common/services/content.service';
import { AllowableOperationsEnum } from '../../common/models/allowable-operations.enum';
import { Node } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { PermissionModel } from '../../document-list/models/permissions.model';
import { UploadBase } from './base-upload/upload-base';
import { NodeAllowableOperationSubject } from '../../interfaces/node-allowable-operation-subject.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'adf-upload-button',
    imports: [CommonModule, MatButtonModule, TranslatePipe, MatIconModule],
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.scss'],
    viewProviders: [{ provide: EXTENDIBLE_COMPONENT, useExisting: forwardRef(() => UploadButtonComponent) }],
    encapsulation: ViewEncapsulation.None
})
export class UploadButtonComponent extends UploadBase implements OnInit, OnChanges, NodeAllowableOperationSubject {
    private contentService = inject(ContentService);
    private nodesApiService = inject(NodesApiService);

    /** Allows/disallows upload folders (only for Chrome). */
    @Input()
    uploadFolders: boolean = false;

    /** Allows/disallows multiple files */
    @Input()
    multipleFiles: boolean = false;

    /** Defines the text of the upload button. */
    @Input()
    staticTitle: string;

    /** Custom tooltip text. */
    @Input()
    tooltip: string = null;

    /** Custom added file. The upload button type will be 'button' instead of 'file' */
    @Input()
    file: File;

    /** Emitted when create permission is missing. */
    @Output()
    permissionEvent = new EventEmitter<PermissionModel>();

    private hasAllowableOperations: boolean = false;
    protected permissionValue = new Subject<boolean>();

    ngOnInit() {
        this.permissionValue.subscribe((permission: boolean) => {
            this.hasAllowableOperations = permission;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const rootFolderId = changes['rootFolderId'];
        if (rootFolderId?.currentValue) {
            this.checkPermission();
        }
    }

    isButtonDisabled(): boolean {
        return this.disabled ? true : undefined;
    }

    onFilesAdded($event: any): void {
        const files = FileUtils.toFileArray($event.currentTarget.files);

        if (this.hasAllowableOperations) {
            this.uploadFiles(files);
        } else {
            this.permissionEvent.emit(new PermissionModel({ type: 'content', action: 'upload', permission: 'create' }));
        }
        // reset the value of the input file
        $event.target.value = '';
    }

    onClickUploadButton(): void {
        if (this.file) {
            const files = [this.file];

            if (this.hasAllowableOperations) {
                this.uploadFiles(files);
            } else {
                this.permissionEvent.emit(new PermissionModel({ type: 'content', action: 'upload', permission: 'create' }));
            }
        }
    }

    onDirectoryAdded($event: any): void {
        if (this.hasAllowableOperations) {
            const files = FileUtils.toFileArray($event.currentTarget.files);
            this.uploadFiles(files);
        } else {
            this.permissionEvent.emit(new PermissionModel({ type: 'content', action: 'upload', permission: 'create' }));
        }
        // reset the value of the input file
        $event.target.value = '';
    }

    checkPermission() {
        if (this.rootFolderId) {
            const opts: any = {
                includeSource: true,
                include: ['allowableOperations']
            };

            this.nodesApiService.getNode(this.rootFolderId, opts).subscribe(
                (res) => this.permissionValue.next(this.nodeHasPermission(res, AllowableOperationsEnum.CREATE)),
                (error: { error: Error }) => {
                    if (error?.error) {
                        this.error.emit({ error: error.error.message } as any);
                    } else {
                        this.error.emit({ error: 'FILE_UPLOAD.BUTTON.PERMISSION_CHECK_ERROR' } as any);
                    }
                }
            );
        }
    }

    nodeHasPermission(node: Node, permission: AllowableOperationsEnum | string): boolean {
        return this.contentService.hasAllowableOperations(node, permission);
    }
}
