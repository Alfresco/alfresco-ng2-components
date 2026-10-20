/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, inject, input, output, viewChild, viewChildren, ViewEncapsulation } from '@angular/core';
import { PathElement } from '@alfresco/js-api';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { DataRow, DragDropStateService } from '@alfresco/adf-core';
import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
    selector: 'adf-compact-breadcrumb',
    templateUrl: './compact-breadcrumb.component.html',
    styleUrls: ['./compact-breadcrumb.component.scss'],
    imports: [MatMenu, MatButton, MatMenuTrigger, TranslatePipe, MatMenuItem, CdkDropList, CdkDropListGroup],
    providers: [
        {
            provide: OVERLAY_DEFAULT_CONFIG,
            useValue: { usePopover: false }
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class CompactBreadcrumbComponent {
    private readonly dragDropStateService = inject(DragDropStateService);

    readonly nodes = input<PathElement[]>([]);

    readonly breadcrumbDropListsChange = output<CdkDropList[]>();

    private readonly breadcrumbMenu = viewChild.required(MatMenuTrigger);
    private readonly dropLists = viewChildren(CdkDropList);

    openMenu(): void {
        if (this.dragDropStateService.dragging()) {
            this.breadcrumbMenu().openMenu();
            this.breadcrumbDropListsChange.emit([...this.dropLists()]);
        }
    }

    onDrop(event: CdkDragDrop<PathElement, PathElement, DataRow>): void {
        // eslint-disable-next-line no-console
        console.log(event);
    }
}
