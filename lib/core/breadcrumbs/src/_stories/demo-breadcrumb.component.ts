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

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbItemComponent } from '../components/breadcrumb-item/breadcrumb-item.component';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'adf-demo-breadcrumb',
    template: `
        <adf-breadcrumb [compact]="compact">
            <adf-breadcrumb-item>
                <a href="/">Home</a>
            </adf-breadcrumb-item>

            <adf-breadcrumb-item>
                <a href="https://www.alfresco.com/">Alfresco</a>
            </adf-breadcrumb-item>

            <adf-breadcrumb-item>
                <a href="https://www.alfresco.com">External Link 1</a>
            </adf-breadcrumb-item>

            <adf-breadcrumb-item>
                <a href="https://www.alfresco.com/">External Link 2</a>
            </adf-breadcrumb-item>

            <adf-breadcrumb-item>
                <a href="https://www.alfresco.com/">External Link 3</a>
            </adf-breadcrumb-item>

            <adf-breadcrumb-item *ngIf="showBreadcrumbItemWithMenu" aria-current="location" aria-haspopup="true">
                <div>
                    Current Page
                    <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Menu">
                        <mat-icon>menu_open</mat-icon>
                    </button>

                    <mat-menu #menu="matMenu">
                        <button mat-menu-item>Menu Item 1</button>
                        <button mat-menu-item>Menu Item 2</button>
                    </mat-menu>
                </div>
            </adf-breadcrumb-item>
        </adf-breadcrumb>
    `,
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, MatIconModule, BreadcrumbItemComponent, BreadcrumbComponent, NgIf]
})
export class DemoBreadcrumbComponent {
    compact = false;
    showBreadcrumbItemWithMenu = false;
}
