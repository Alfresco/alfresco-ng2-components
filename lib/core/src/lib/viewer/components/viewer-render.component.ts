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

import {
    Component, EventEmitter,
    Input, OnChanges, Output, TemplateRef,
    ViewEncapsulation, OnInit, OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { ViewUtilService } from '../services/view-util.service';
import { AppExtensionService, ViewerExtensionRef } from '@alfresco/adf-extensions';
import { MatDialog } from '@angular/material/dialog';
import { Track } from '../models/viewer.model';

@Component({
    selector: 'adf-viewer-render',
    templateUrl: './viewer-render.component.html',
    styleUrls: ['./viewer-render.component.scss'],
    host: {class: 'adf-viewer-render'},
    encapsulation: ViewEncapsulation.None,
    providers: [ViewUtilService]
})
export class ViewerRenderComponent implements OnChanges, OnInit, OnDestroy {

    /** If you want to load an external file that does not come from ACS you
     * can use this URL to specify where to load the file from.
     */
    @Input()
    urlFile = '';

    /** Loads a Blob File */
    @Input()
    blobFile: Blob;

    /** Toggles the 'Full Screen' feature. */
    @Input()
    allowFullScreen = true;

    /** Toggles PDF thumbnails. */
    @Input()
    allowThumbnails = true;

    /** The template for the pdf thumbnails. */
    @Input()
    thumbnailsTemplate: TemplateRef<any> = null;

    /** MIME type of the file content (when not determined by the filename extension). */
    @Input()
    mimeType: string;

    /** Override Content filename. */
    @Input()
    fileName: string;

    /** Override loading status */
    @Input()
    isLoading = false;

    /** Enable when where is possible the editing functionalities  */
    @Input()
    readOnly = true;

    /** media subtitles for the media player*/
    @Input()
    tracks: Track[] = [];

    /** Emitted when the filename extension changes. */
    @Output()
    extensionChange = new EventEmitter<string>();

    /** Emitted when the img is submitted in the img viewer. */
    @Output()
    submitFile = new EventEmitter<Blob>();

    /** Emitted when the img is submitted in the img viewer. */
    @Output()
    close = new EventEmitter<boolean>();

    extensionTemplates: { template: TemplateRef<any>; isVisible: boolean }[] = [];
    extension: string;
    internalFileName: string;
    viewerType: string = 'unknown';

    /**
     * Returns a list of the active Viewer content extensions.
     */
    get viewerExtensions(): ViewerExtensionRef[] {
        return this.extensionService.getViewerExtensions();
    }

    /**
     * Provides a list of file extensions supported by external plugins.
     */
    get externalExtensions(): string[] {
        return this.viewerExtensions.map(ext => ext.fileExtension);
    }

    private _externalViewer: ViewerExtensionRef;
    get externalViewer(): ViewerExtensionRef {
        if (!this._externalViewer) {
            this._externalViewer = this.viewerExtensions.find(ext => ext.fileExtension === '*');
        }

        return this._externalViewer;
    }

    cacheTypeForContent = '';

    private onDestroy$ = new Subject<boolean>();

    constructor(private viewUtilService: ViewUtilService,
                private extensionService: AppExtensionService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.cacheTypeForContent = '';
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnChanges() {
        this.isLoading = !this.blobFile && !this.urlFile;

        if (this.blobFile) {
            this.setUpBlobData();
        } else if (this.urlFile) {
            this.setUpUrlFile();
        }
    }

    private setUpBlobData() {
        this.internalFileName = this.fileName;
        this.viewerType = this.viewUtilService.getViewerTypeByMimeType(this.blobFile.type);

        this.extensionChange.emit(this.blobFile.type);
        this.scrollTop();
    }

    private setUpUrlFile() {
        this.internalFileName = this.fileName ? this.fileName : this.viewUtilService.getFilenameFromUrl(this.urlFile);
        this.extension = this.viewUtilService.getFileExtension(this.internalFileName);
        this.viewerType = this.viewUtilService.getViewerType(this.extension, this.mimeType);

        this.extensionChange.emit(this.extension);
        this.scrollTop();
    }

    scrollTop() {
        window.scrollTo(0, 1);
    }

    checkExtensions(extensionAllowed) {
        if (typeof extensionAllowed === 'string') {
            return this.extension.toLowerCase() === extensionAllowed.toLowerCase();
        } else if (extensionAllowed.length > 0) {
            return extensionAllowed.find((currentExtension) => this.extension.toLowerCase() === currentExtension.toLowerCase());
        }
    }

    onSubmitFile(newImageBlob: Blob) {
        this.submitFile.next(newImageBlob);
    }

    onUnsupportedFile() {
        this.viewerType = 'unknown';
    }

    onClose() {
        this.close.next(true);
    }

}
