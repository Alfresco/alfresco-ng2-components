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
import { OnInit, EventEmitter } from '@angular/core';
import { DocumentListService } from './../services/document-list.service';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ContentActionModel } from './../models/content-action.model';
export declare class DocumentMenuAction implements OnInit {
    private documentListService;
    private translate;
    currentFolderPath: string;
    success: EventEmitter<{}>;
    error: EventEmitter<{}>;
    dialog: any;
    actions: ContentActionModel[];
    message: string;
    folderName: string;
    constructor(documentListService: DocumentListService, translate: AlfrescoTranslationService);
    ngOnInit(): void;
    createFolder(name: string): void;
    showDialog(): void;
    cancel(): void;
    private getErrorMessage(response);
    private formatString(message, keys);
    isFolderNameEmpty(): boolean;
}
