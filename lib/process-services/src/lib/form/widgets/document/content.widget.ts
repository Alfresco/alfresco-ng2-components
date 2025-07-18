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

import { UrlService, ContentLinkModel, FormService, DownloadService } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ProcessContentService } from '../../services/process-content.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'adf-content',
    imports: [CommonModule, TranslatePipe, MatCardModule, MatIconModule, MatButtonModule],
    templateUrl: './content.widget.html',
    styleUrls: ['./content.widget.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentWidgetComponent implements OnChanges {
    /** The content id to show. */
    @Input()
    id: string;

    /** Toggles showing document content. */
    @Input()
    showDocumentContent: boolean = true;

    /** Emitted when the content is clicked. */
    @Output()
    contentClick = new EventEmitter();

    /** Emitted when the thumbnail has loaded. */
    @Output()
    thumbnailLoaded: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the content has loaded. */
    @Output()
    contentLoaded: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    content: ContentLinkModel;

    constructor(
        protected formService: FormService,
        private downloadService: DownloadService,
        private urlService: UrlService,
        private processContentService: ProcessContentService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        const contentId = changes['id'];
        if (contentId?.currentValue) {
            this.loadContent(contentId.currentValue);
        }
    }

    loadContent(id: number) {
        this.processContentService.getFileContent(id).subscribe(
            (response: ContentLinkModel) => {
                this.content = new ContentLinkModel(response);
                this.contentLoaded.emit(this.content);
                this.loadThumbnailUrl(this.content);
            },
            (error) => {
                this.error.emit(error);
            }
        );
    }

    loadThumbnailUrl(content: ContentLinkModel) {
        if (this.content.isThumbnailSupported()) {
            let observable: Observable<any>;

            if (this.content.isTypeImage()) {
                observable = this.processContentService.getFileRawContent(content.id);
            } else {
                observable = this.processContentService.getContentThumbnail(content.id);
            }

            if (observable) {
                observable.subscribe(
                    (response: Blob) => {
                        this.content.thumbnailUrl = this.urlService.createTrustedUrl(response);
                        this.thumbnailLoaded.emit(this.content.thumbnailUrl);
                    },
                    (error) => {
                        this.error.emit(error);
                    }
                );
            }
        }
    }

    openViewer(content: ContentLinkModel): void {
        let fetch = this.processContentService.getContentRenditionTypePreview(content.id);
        if (content.isTypeImage() || content.isTypePdf()) {
            fetch = this.processContentService.getFileRawContent(content.id);
        }
        fetch.subscribe(
            (blob: Blob) => {
                content.contentBlob = blob;
                this.contentClick.emit(content);
                this.formService.formContentClicked.next(content);
            },
            (error) => {
                this.error.emit(error);
            }
        );
    }

    /**
     * Invoke content download.
     *
     * @param content content link model
     */
    download(content: ContentLinkModel): void {
        this.processContentService.getFileRawContent(content.id).subscribe(
            (blob: Blob) => this.downloadService.downloadBlob(blob, content.name),
            (error) => {
                this.error.emit(error);
            }
        );
    }
}
