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

import {
    Component,
    OnChanges,
    SimpleChanges,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { FormService } from './../services/form.service';
import { ContentLinkModel } from './widgets/core/content-link.model';
import { DomSanitizer } from '@angular/platform-browser';

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
    previewnotavailable: string;

    @Output()
    contentClick = new EventEmitter();

    content: ContentLinkModel;

    baseComponentPath = module.id.replace('/alfresco-content.component.js', '');

    constructor(private translate: AlfrescoTranslationService,
                protected formService: FormService,
                private logService: LogService,
                private sanitizer: DomSanitizer ) {

        if (this.translate) {
            this.translate.addTranslationFolder('ng2-activiti-form', 'node_modules/ng2-activiti-form/src');
        }

    }

    ngOnChanges(changes: SimpleChanges) {
        let contentId = changes['id'];
        if (contentId && contentId.currentValue) {
            this.loadContent(contentId.currentValue);
            return;
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
        if (this.content.isTypeImage()) {
            this.formService.getFileRawContent(content.id).subscribe(
                (response: Blob) => {
                    this.content.thumbnailUrl = this.createUrlPreview(response);
                },
                error => {
                    this.logService.error(error);
                }
            );
        } else if (this.content.isThumbnailSupported()) {
            this.content.contentRawUrl = this.formService.getFileRawContentUrl(content.id);
            this.content.thumbnailUrl = this.formService.getContentThumbnailUrl(content.id);
        }
    }

    openViewer(content: ContentLinkModel) {
        this.contentClick.emit(content);
        this.logService.info('Content clicked' + content.id);
    }

    /**
     * Download file opening it in a new window
     */
    download($event) {
        $event.stopPropagation();
    }

    private sanitizeUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    private createUrlPreview(blob: Blob) {
        let imageUrl = window.URL.createObjectURL(blob);
        let sanitize: any = this.sanitizeUrl(imageUrl);
        return sanitize.changingThisBreaksApplicationSecurity;
    }
}
