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

import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, ViewEncapsulation, inject } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { DataRow } from '../../data/data-row.model';

@Component({
    selector: 'adf-datatable-row',
    template: `<ng-content />`,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'adf-datatable-row',
        role: 'row'
    }
})
export class DataTableRowComponent implements FocusableOption {
    private readonly element = inject(ElementRef);

    @Input() row: DataRow;

    @Input() disabled = true;

    @Output()
    select: EventEmitter<any> = new EventEmitter<any>();

    @HostBinding('class.adf-is-selected')
    get isSelected(): boolean {
        if (!this.row) {
            return false;
        }
        return this.row.isSelected;
    }

    @HostBinding('attr.aria-selected')
    get isAriaSelected(): boolean {
        if (!this.row) {
            return false;
        }
        return this.row.isSelected;
    }

    @HostBinding('attr.aria-label')
    get ariaLabel(): string | null {
        if (!this.row) {
            return null;
        }
        const label = this.row.getValue('name') || this.row.getValue('title') || '';
        return this.row.isSelected && label ? `${label} selected` : label;
    }

    @HostBinding('attr.tabindex')
    get tabindex(): number | null {
        return this.disabled ? null : 0;
    }

    @HostListener('keydown.space', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if ((event.target as Element).tagName === this.element.nativeElement.tagName) {
            event.preventDefault();
            this.select.emit(event);
        }
    }

    focus() {
        this.element.nativeElement.focus();
    }
}
