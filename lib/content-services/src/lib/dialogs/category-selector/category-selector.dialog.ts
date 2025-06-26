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

import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Category } from '@alfresco/js-api';
import { CategoriesManagementComponent, CategoriesManagementMode } from '../../category';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

export interface CategorySelectorDialogOptions {
    select: Subject<Category[]>;
    multiSelect?: boolean;
}

@Component({
    selector: 'adf-category-selector-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, TranslatePipe, CategoriesManagementComponent, MatButtonModule],
    templateUrl: './category-selector.dialog.html',
    styleUrls: ['./category-selector.dialog.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CategorySelectorDialogComponent implements OnInit {
    categories: Category[] = [];
    categoriesManagementMode = CategoriesManagementMode.ASSIGN;
    multiSelect = true;

    constructor(
        private dialog: MatDialogRef<CategorySelectorDialogComponent, boolean>,
        @Inject(MAT_DIALOG_DATA) private options: CategorySelectorDialogOptions
    ) {}

    ngOnInit() {
        this.multiSelect = this.options.multiSelect ?? true;
    }

    selectCategories() {
        this.options.select.next(this.categories);
        this.dialog.close(true);
    }
}
