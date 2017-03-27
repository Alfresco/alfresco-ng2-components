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

import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { AlfrescoTranslationService, LogService, ContentService } from 'ng2-alfresco-core';
import { FormService } from './../services/form.service';
import { ContentLinkModel } from './widgets/core/content-link.model';
import { Observable } from 'rxjs/Rx';

@Component({
    moduleId: module.id,
    selector: 'activiti-content',
    templateUrl: './activiti-content.component.html',
    styleUrls: ['./activiti-content.component.css']
})
export class ActivitiContent implements OnChanges {

    @Input()
    id: string;

    @Input()
    showDocumentContent: boolean = true;

    @Output()
    contentClick = new EventEmitter();

    content: ContentLinkModel;

    constructor(private translate: AlfrescoTranslationService,
                protected formService: FormService,
                private logService: LogService,
                private contentService: ContentService) {
        if (this.translate) {
            this.translate.addTranslationFolder('ng2-activiti-form', 'node_modules/ng2-activiti-form/src');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const contentId = changes['id'];
        if (contentId && contentId.currentValue) {
            this.loadContent(contentId.currentValue);
        }
    }

    loadContent(id: number) {
        this.formService
            .getFileContent(id)
            .subscribe(
                (response: ContentLinkModel) => {
                    this.content = new ContentLinkModel(response);
                    this.loadThumbnailUrl(this.content);
                },
                error => {
                    this.logService.error(error);
                }
            );
    }

    loadThumbnailUrl(content: ContentLinkModel) {
        if (this.content.isThumbnailSupported()) {
            let observable: Observable<any>;

            if (this.content.isTypeImage()) {
                observable = this.formService.getFileRawContent(content.id);
            } else {
                observable = this.formService.getContentThumbnailUrl(content.id);
            }

            if (observable) {
                observable.subscribe(
                    (response: Blob) => {
                        this.content.thumbnailUrl = this.contentService.createTrustedUrl(response);
                    },
                    error => {
                        this.logService.error(error);
                    }
                );
            }
        }
    }

    openViewer(content: ContentLinkModel): void {
        this.formService.getFileRawContent(content.id).subscribe(
            (blob: Blob) => {
                content.contentBlob = blob;
                this.contentClick.emit(content);
                this.logService.info('Content clicked' + content.id);
                this.formService.formContentClicked.next(content);
            },
            error => this.logService.error(error)
        );
    }

    /**
     * Invoke content download.
     */
    download(content: ContentLinkModel): void {
        this.formService.getFileRawContent(content.id).subscribe(
            (blob: Blob) => this.contentService.downloadBlob(blob, content.name),
            error => this.logService.error(error)
        );
    }
}
