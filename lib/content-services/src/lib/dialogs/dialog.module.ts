/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NgModule } from '@angular/core';
import { FolderDialogComponent } from './folder/folder.dialog';
import { NodeLockDialogComponent } from './node-lock/node-lock.dialog';
import { LibraryDialogComponent } from './library/library.dialog';
import { DownloadZipDialogModule } from './download-zip/download-zip.dialog.module';
import { CategorySelectorDialogComponent } from './category-selector/category-selector.dialog';

export const CONTENT_DIALOG_DIRECTIVES = [
    DownloadZipDialogModule,
    FolderDialogComponent,
    NodeLockDialogComponent,
    LibraryDialogComponent,
    CategorySelectorDialogComponent
];

/** @deprecated use `..CONTENT_DIALOG_DIRECTIVES` or standalone component imports instead */
@NgModule({
    imports: [...CONTENT_DIALOG_DIRECTIVES],
    exports: [...CONTENT_DIALOG_DIRECTIVES]
})
export class DialogModule { /* empty */ }
