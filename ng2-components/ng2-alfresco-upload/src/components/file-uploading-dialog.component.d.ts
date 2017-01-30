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
import { ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FileModel } from '../models/file.model';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { UploadService } from '../services/upload.service';
export declare class FileUploadingDialogComponent implements OnInit, OnDestroy {
    private cd;
    private _uploaderService;
    isDialogActive: boolean;
    filesUploadingList: FileModel[];
    totalCompleted: number;
    private _isDialogMinimized;
    private listSubscription;
    private counterSubscription;
    constructor(cd: ChangeDetectorRef, translate: AlfrescoTranslationService, _uploaderService: UploadService);
    ngOnInit(): void;
    toggleShowDialog(): void;
    toggleDialogMinimize(): void;
    ngOnDestroy(): void;
}
