/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import {
    Component,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    ElementRef,
    OnDestroy
} from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';
import { BehaviorSubject, Subject } from 'rxjs';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { ShareDataRow } from '../../data/share-data-row.model';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-name-column',
    template: `
        <span
            role="link"
            [attr.aria-label]="'NAME_COLUMN_LINK.ACCESSIBILITY.ARIA_LABEL' | translate:{
                name:  displayText$ | async
            }"
            class="adf-datatable-cell-value"
            title="{{ node | adfNodeNameTooltip }}"
            (click)="onClick()">

            {{ displayText$ | async }}
        </span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell adf-datatable-link adf-name-column' }
})
export class NameColumnComponent implements OnInit, OnDestroy {
    @Input()
    context: any;

    displayText$ = new BehaviorSubject<string>('');
    node: NodeEntry;

    private onDestroy$ = new Subject<boolean>();

    constructor(private element: ElementRef, private alfrescoApiService: AlfrescoApiService) {}

    ngOnInit() {
        this.updateValue();

        this.alfrescoApiService.nodeUpdated
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(node => {
                const row: ShareDataRow = this.context.row;
                if (row) {
                    const { entry } = row.node;

                    if (entry === node) {
                        row.node = { entry };
                        this.updateValue();
                    }
                }
            });
    }

    protected updateValue() {
        this.node = this.context.row.node;

        if (this.node && this.node.entry) {
            this.displayText$.next(this.node.entry.name || this.node.entry.id);
        }
    }

    onClick() {
        this.element.nativeElement.dispatchEvent(
            new CustomEvent('name-click', {
                bubbles: true,
                detail: {
                    node: this.node
                }
            })
        );
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
