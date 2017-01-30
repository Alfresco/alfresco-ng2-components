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
import { ElementRef, EventEmitter } from '@angular/core';
import { AlfrescoApiService } from 'ng2-alfresco-core';
export declare class ViewerComponent {
    private apiService;
    private element;
    private document;
    urlFile: string;
    fileNodeId: string;
    overlayMode: boolean;
    showViewer: boolean;
    showToolbar: boolean;
    showViewerChange: EventEmitter<boolean>;
    urlFileContent: string;
    otherMenu: any;
    displayName: string;
    extension: string;
    mimeType: string;
    loaded: boolean;
    constructor(apiService: AlfrescoApiService, element: ElementRef, document: any);
    ngOnChanges(changes: any): Promise<{}>;
    close(): void;
    cleanup(): void;
    ngOnDestroy(): void;
    getFilenameFromUrl(url: string): string;
    private getFileExtension(fileName);
    private isImage();
    private isMedia();
    private isImageExtension();
    private isMediaMimeType();
    private isMediaExtension(extension);
    private isImageMimeType();
    private isPdf();
    supportedExtension(): boolean;
    handleKeyboardEvent(event: KeyboardEvent): void;
    private blockOtherScrollBar();
    private unblockOtherScrollBar();
    private isParentElementHeaderBar();
    private closestElement(elelemnt, nodeName);
    private hideOtherHeaderBar();
    isLoaded(): boolean;
}
