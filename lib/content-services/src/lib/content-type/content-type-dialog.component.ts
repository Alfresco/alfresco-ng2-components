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

import { TypeEntry } from '@alfresco/js-api';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ContentTypeDialogComponentData } from './content-type-metadata.interface';
import { ContentTypeService } from './content-type.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'adf-content-type-dialog',
    imports: [CommonModule, MatDialogModule, TranslatePipe, MatExpansionModule, MatTableModule, MatButtonModule],
    templateUrl: './content-type-dialog.component.html',
    styleUrls: ['./content-type-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentTypeDialogComponent implements OnInit {
    private dialog = inject<MatDialogRef<ContentTypeDialogComponent>>(MatDialogRef);
    data = inject<ContentTypeDialogComponentData>(MAT_DIALOG_DATA);
    private contentTypeService = inject(ContentTypeService);

    title: string;
    description: string;
    nodeType: string;
    confirmMessage: string;

    currentContentType: TypeEntry;
    typeProperties: any[] = [];

    propertyColumns: string[] = ['name', 'title', 'dataType'];

    constructor() {
        const data = this.data;

        this.title = data.title;
        this.description = data.description;
        this.confirmMessage = data.confirmMessage;
        this.nodeType = data.nodeType;

        this.contentTypeService.getContentTypeByPrefix(this.nodeType).subscribe((contentTypeEntry) => {
            this.currentContentType = contentTypeEntry;
            this.typeProperties = this.currentContentType.entry.properties.filter((property) =>
                property.id.startsWith(this.currentContentType.entry.model.namespacePrefix)
            );
        });
    }

    ngOnInit() {
        this.dialog.backdropClick().subscribe(() => {
            this.close();
        });
    }

    close() {
        this.data.select.complete();
    }

    onCancel() {
        this.close();
    }

    onApply() {
        this.data.select.next(true);
        this.close();
    }
}
