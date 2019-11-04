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
    ViewEncapsulation,
    ElementRef,
    Input,
    HostBinding,
    HostListener,
    Output,
    EventEmitter
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { DataRow } from '../../data/data-row.model';

@Component({
    selector: 'adf-datatable-row',
    template: `<ng-content></ng-content>`,
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'adf-datatable-row',
        tabindex: '0',
        role: 'row'
    }
})
export class DataTableRowComponent implements FocusableOption {
    @Input() row: DataRow;

    @Input() disabled = false;

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
    get ariaLabel(): string|null {
        if (!this.row) {
            return null;
        }
        return this.row.getValue('name') || '';
    }

    @HostBinding('attr.tabindex')
    get tabindex(): number|null {
        return this.disabled ? null : 0;
    }

    @HostListener('keydown.space', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if ((event.target as Element).tagName === this.element.nativeElement.tagName) {
            event.preventDefault();
            this.select.emit(event);
        }
    }

    constructor(private element: ElementRef) {}

    focus() {
        this.element.nativeElement.focus();
    }
}
