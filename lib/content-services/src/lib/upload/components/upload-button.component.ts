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

import {
    ContentService, EXTENDIBLE_COMPONENT, FileUtils,
    LogService, NodeAllowableOperationSubject, TranslationService, UploadService, AllowableOperationsEnum
} from '@alfresco/adf-core';
import {
    Component, EventEmitter, forwardRef, Input,
    OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation, NgZone
} from '@angular/core';
import { Node } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { PermissionModel } from '../../document-list/models/permissions.model';
import { UploadBase } from './base-upload/upload-base';

@Component({
    selector: 'adf-upload-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.scss'],
    viewProviders: [
        { provide: EXTENDIBLE_COMPONENT, useExisting: forwardRef(() => UploadButtonComponent) }
    ],
    encapsulation: ViewEncapsulation.None
})
export class UploadButtonComponent extends UploadBase implements OnInit, OnChanges, NodeAllowableOperationSubject {

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

    /** Emitted when create permission is missing. */
    @Output()
    permissionEvent: EventEmitter<PermissionModel> = new EventEmitter<PermissionModel>();

    private hasAllowableOperations: boolean = false;

    protected permissionValue: Subject<boolean> = new Subject<boolean>();

    constructor(protected uploadService: UploadService,
                private contentService: ContentService,
                protected translationService: TranslationService,
                protected logService: LogService,
                protected ngZone: NgZone) {
        super(uploadService, translationService, ngZone);
    }

    ngOnInit() {
        this.permissionValue.subscribe((permission: boolean) => {
            this.hasAllowableOperations = permission;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const rootFolderId = changes['rootFolderId'];
        if (rootFolderId && rootFolderId.currentValue) {
            this.checkPermission();
        }
    }

    isButtonDisabled(): boolean {
        return this.disabled ? true : undefined;
    }

    onFilesAdded($event: any): void {
        const files: File[] = FileUtils.toFileArray($event.currentTarget.files);

        if (this.hasAllowableOperations) {
            this.uploadFiles(files);
        } else {
            this.permissionEvent.emit(new PermissionModel({ type: 'content', action: 'upload', permission: 'create' }));
        }
        // reset the value of the input file
        $event.target.value = '';
    }

    onDirectoryAdded($event: any): void {
        if (this.hasAllowableOperations) {
            const files: File[] = FileUtils.toFileArray($event.currentTarget.files);
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

            this.contentService.getNode(this.rootFolderId, opts).subscribe(
                (res) => this.permissionValue.next(this.nodeHasPermission(res.entry, AllowableOperationsEnum.CREATE)),
                (error) => this.error.emit(error)
            );
        }
    }

    nodeHasPermission(node: Node, permission: AllowableOperationsEnum | string): boolean {
        return this.contentService.hasAllowableOperations(node, permission);
    }
}
