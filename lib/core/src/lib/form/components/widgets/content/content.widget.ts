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

import { ContentService } from '../../../../services/content.service';
import { LogService } from '../../../../services/log.service';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ProcessContentService } from '../../../services/process-content.service';
import { ContentLinkModel } from '../core/content-link.model';
import { FormService } from './../../../services/form.service';

@Component({
    selector: 'adf-content',
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

    constructor(protected formService: FormService,
                private logService: LogService,
                private contentService: ContentService,
                private processContentService: ProcessContentService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        const contentId = changes['id'];
        if (contentId && contentId.currentValue) {
            this.loadContent(contentId.currentValue);
        }
    }

    loadContent(id: number) {
        this.processContentService
            .getFileContent(id)
            .subscribe(
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
                        this.content.thumbnailUrl = this.contentService.createTrustedUrl(response);
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
        let fetch = this.processContentService.getContentPreview(content.id);
        if (content.isTypeImage() || content.isTypePdf()) {
            fetch = this.processContentService.getFileRawContent(content.id);
        }
        fetch.subscribe(
            (blob: Blob) => {
                content.contentBlob = blob;
                this.contentClick.emit(content);
                this.logService.info('Content clicked' + content.id);
                this.formService.formContentClicked.next(content);
            },
            (error) => {
                this.error.emit(error);
            }
        );
    }

    /**
     * Invoke content download.
     */
    download(content: ContentLinkModel): void {
        this.processContentService.getFileRawContent(content.id).subscribe(
            (blob: Blob) => this.contentService.downloadBlob(blob, content.name),
            (error) => {
                this.error.emit(error);
            }
        );
    }
}
