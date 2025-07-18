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

import { AppExtensionService, ExtensionsModule, ViewerExtensionRef } from '@alfresco/adf-extensions';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { Track } from '../../models/viewer.model';
import { ViewUtilService } from '../../services/view-util.service';
import { ImgViewerComponent } from '../img-viewer/img-viewer.component';
import { MediaPlayerComponent } from '../media-player/media-player.component';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';
import { TxtViewerComponent } from '../txt-viewer/txt-viewer.component';
import { UnknownFormatComponent } from '../unknown-format/unknown-format.component';

@Component({
    selector: 'adf-viewer-render',
    templateUrl: './viewer-render.component.html',
    styleUrls: ['./viewer-render.component.scss'],
    host: { class: 'adf-viewer-render' },
    encapsulation: ViewEncapsulation.None,
    imports: [
        TranslatePipe,
        MatProgressSpinnerModule,
        NgSwitch,
        NgSwitchCase,
        NgIf,
        PdfViewerComponent,
        ImgViewerComponent,
        MediaPlayerComponent,
        TxtViewerComponent,
        NgTemplateOutlet,
        UnknownFormatComponent,
        ExtensionsModule,
        NgForOf,
        NgSwitchDefault
    ],
    providers: [ViewUtilService]
})
export class ViewerRenderComponent implements OnChanges, OnInit {
    /**
     * If you want to load an external file that does not come from ACS you
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

    /** Enable when where is possible the editing functionalities  */
    @Input()
    readOnly = true;

    /**
     * Controls which actions are enabled in the viewer.
     * Example:
     * { rotate: true, crop: false } will enable rotation but disable cropping.
     */
    @Input()
    allowedEditActions: { [key: string]: boolean } = {
        rotate: true,
        crop: true
    };

    /** media subtitles for the media player*/
    @Input()
    tracks: Track[] = [];

    /** Identifier of a node that is opened by the viewer. */
    @Input()
    nodeId: string = null;

    /** Template containing ViewerExtensionDirective instances providing different viewer extensions based on supported file extension. */
    @Input()
    viewerTemplateExtensions: TemplateRef<any>;

    /** Custom error message to be displayed in the viewer. */
    @Input()
    customError: string = undefined;

    /** Emitted when the filename extension changes. */
    @Output()
    extensionChange = new EventEmitter<string>();

    /** Emitted when the img is submitted in the img viewer. */
    @Output()
    submitFile = new EventEmitter<Blob>();

    /** Emitted when the img is submitted in the img viewer. */
    @Output()
    close = new EventEmitter<boolean>();

    /** Emitted when the img is saving. */
    @Output()
    isSaving = new EventEmitter<boolean>();

    extensionTemplates: { template: TemplateRef<any>; isVisible: boolean }[] = [];
    extensionsSupportedByTemplates: string[] = [];
    extension: string;
    internalFileName: string;
    viewerType: string = 'unknown';
    isLoading = false;

    /**
     * Returns a list of the active Viewer content extensions.
     *
     * @returns list of extension references
     */
    get viewerExtensions(): ViewerExtensionRef[] {
        return this.extensionService.getViewerExtensions();
    }

    /**
     * Provides a list of file extensions supported by external plugins.
     *
     * @returns list of extensions
     */
    get externalExtensions(): string[] {
        return this.viewerExtensions.map((ext) => ext.fileExtension);
    }

    private _externalViewer: ViewerExtensionRef;
    get externalViewer(): ViewerExtensionRef {
        if (!this._externalViewer) {
            this._externalViewer = this.viewerExtensions.find((ext) => ext.fileExtension === '*');
        }

        return this._externalViewer;
    }

    cacheTypeForContent = 'no-cache';

    constructor(
        private viewUtilService: ViewUtilService,
        private extensionService: AppExtensionService,
        public dialog: MatDialog,
        public readonly injector: Injector
    ) {}

    ngOnInit() {
        this.cacheTypeForContent = 'no-cache';
        this.isLoading = true;
    }

    ngOnChanges() {
        this.isLoading = true;
        if (this.blobFile) {
            this.setUpBlobData();
        } else if (this.urlFile) {
            this.setUpUrlFile();
        }
    }

    markAsLoaded() {
        this.isLoading = false;
    }

    private setUpBlobData() {
        this.internalFileName = this.fileName;
        this.viewerType = this.viewUtilService.getViewerTypeByMimeType(this.blobFile.type);
        if (this.viewerType === 'unknown') {
            this.isLoading = false;
        }

        this.extensionChange.emit(this.blobFile.type);
        this.scrollTop();
    }

    private setUpUrlFile() {
        this.internalFileName = this.fileName ? this.fileName : this.viewUtilService.getFilenameFromUrl(this.urlFile);
        this.extension = this.viewUtilService.getFileExtension(this.internalFileName);
        this.viewerType = this.viewUtilService.getViewerType(this.extension, this.mimeType, this.extensionsSupportedByTemplates);
        if (this.viewerType === 'unknown') {
            this.isLoading = false;
        }

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
        this.isLoading = false;
    }

    onClose() {
        this.close.next(true);
    }
}
