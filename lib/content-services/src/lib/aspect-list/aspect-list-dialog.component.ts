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
import { AspectListDialogComponentData } from './aspect-list-dialog-data.interface';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { AspectListComponent } from './aspect-list.component';
import { AutoFocusDirective } from '../directives/auto-focus.directive';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'adf-aspect-list-dialog',
    imports: [CommonModule, MatDialogModule, TranslateModule, MatButtonModule, AspectListComponent, AutoFocusDirective],
    templateUrl: './aspect-list-dialog.component.html',
    styleUrls: ['./aspect-list-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AspectListDialogComponent implements OnInit {
    title: string;
    description: string;
    currentNodeId: string;
    overTableMessage: string;
    counter = 0;

    currentAspectSelection: string[] = [];

    constructor(private dialog: MatDialogRef<AspectListDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: AspectListDialogComponentData) {
        this.title = data.title;
        this.description = data.description;
        this.overTableMessage = data.overTableMessage;
        this.currentNodeId = data.nodeId;
    }

    ngOnInit() {
        this.dialog.backdropClick().subscribe(() => {
            this.close();
        });
        this.dialog.keydownEvents().subscribe((event) => {
            // Esc
            if (event.keyCode === 27) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.close();
            }
        });
    }

    onValueChanged(aspectList: string[]) {
        this.currentAspectSelection = aspectList;
    }

    onUpdateCounter(count: number) {
        this.counter = count;
    }

    close() {
        this.data.select.complete();
    }

    onCancel() {
        this.close();
    }

    onApply() {
        this.data.select.next(this.currentAspectSelection);
        this.close();
    }
}
