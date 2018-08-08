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

import { Component, Input, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { VersionListComponent } from './version-list.component';
import { AppConfigService, ContentService, AlfrescoApiService } from '@alfresco/adf-core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'adf-version-manager',
    templateUrl: './version-manager.component.html',
    styleUrls: ['./version-manager.component.scss'],
    animations: [
        trigger('uploadToggle', [
            state('open', style({ height: '175px', opacity: 1, visibility: 'visible' })),
            state('close', style({ height: '0%', opacity: 0, visibility: 'hidden' })),
            transition('open => close', [
                style({ visibility: 'hidden' }),
                animate('0.4s cubic-bezier(0.25, 0.8, 0.25, 1)')
            ]),
            transition('close => open', [
                style({ visibility: 'visible' }),
                animate('0.4s cubic-bezier(0.25, 0.8, 0.25, 1)')
            ])
        ])
    ],
    encapsulation: ViewEncapsulation.None
})
export class VersionManagerComponent {

    /** Target node to manage version history. */
    @Input()
    node: MinimalNodeEntryEntity;

    /** Toggles showing/hiding of comments. */
    @Input()
    showComments = true;

    /** Enable/disable downloading a version of the current node. */
    @Input()
    allowDownload = true;

    /** Emitted when a file is uploaded successfully. */
    @Output()
    uploadSuccess: EventEmitter<MinimalNodeEntryEntity> = new EventEmitter<MinimalNodeEntryEntity>();

    /** Emitted when an error occurs during upload. */
    @Output()
    uploadError: EventEmitter<MinimalNodeEntryEntity> = new EventEmitter<MinimalNodeEntryEntity>();

    @ViewChild('versionList')
    versionListComponent: VersionListComponent;

    uploadState: string = 'close';

    constructor(config: AppConfigService,
                private contentService: ContentService,
                private alfrescoApiService: AlfrescoApiService) {
    }

    refresh(node: MinimalNodeEntryEntity) {
        this.alfrescoApiService.nodeUpdated.next(node);
        this.versionListComponent.loadVersionHistory();
        this.uploadSuccess.emit(node);
        this.uploadState = 'close';
    }

    onUploadSuccess(event: any) {
        this.alfrescoApiService.nodeUpdated.next(event.value.entry);
        this.versionListComponent.loadVersionHistory();
        this.uploadSuccess.emit(event.value.entry);
        this.uploadState = 'close';
    }

    onUploadError(event: any) {
        this.uploadError.emit(event);
    }

    onUploadCancel() {
        this.uploadState = 'close';
    }

    toggleNewVersion() {
        this.uploadState = this.uploadState === 'open' ? 'close' : 'open';
    }

    canUpdate(): boolean {
        return this.contentService.hasPermission(this.node, 'update');
    }
}
