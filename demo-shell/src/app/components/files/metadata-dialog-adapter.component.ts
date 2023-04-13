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

import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';

@Component({
    templateUrl: './metadata-dialog-adapter.component.html',
    encapsulation: ViewEncapsulation.None
})
export class MetadataDialogAdapterComponent {

    public contentEntry: MinimalNodeEntryEntity;

    displayEmptyMetadata = false;

    constructor(@Inject(MAT_DIALOG_DATA) data: any,
                private containingDialog?: MatDialogRef<MetadataDialogAdapterComponent>) {
        this.contentEntry = data.contentEntry;
        this.displayEmptyMetadata = data.displayEmptyMetadata;
    }

    close() {
        this.containingDialog.close();
    }
}
