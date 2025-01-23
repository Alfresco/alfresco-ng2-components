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

import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    imports: [CommonModule, MatIconModule, MatExpansionModule, TranslateModule],
    selector: 'adf-content-metadata-header',
    encapsulation: ViewEncapsulation.None,
    styles: [
        `
            adf-content-metadata-header {
                display: flex;
                align-items: center;
                width: 100%;
            }

            .adf-metadata-properties-title {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: 700;
                font-size: 15px;
                padding-left: 12px;
            }
        `
    ],
    template: `
        <ng-container>
            <mat-icon>{{ expanded ? 'expand_more' : 'chevron_right' }}</mat-icon>
            <mat-panel-title *ngIf="title" class="adf-metadata-properties-title" [title]="title | translate">{{ title | translate }}</mat-panel-title>
            <ng-content />
        </ng-container>
    `
})
export class ContentMetadataHeaderComponent {
    @Input() title: string = null;
    @Input() expanded = true;
}
