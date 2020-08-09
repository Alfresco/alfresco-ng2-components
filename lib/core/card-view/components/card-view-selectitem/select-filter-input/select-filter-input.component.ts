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

import { Component, ViewEncapsulation, ViewChild, ElementRef, OnDestroy, Inject, Output, EventEmitter } from '@angular/core';
import { ESCAPE, TAB } from '@angular/cdk/keycodes';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-select-filter-input',
    templateUrl: './select-filter-input.component.html',
    styleUrls: ['./select-filter-input.component.scss'],
    host: { 'class': 'adf-select-filter-input' },
    encapsulation: ViewEncapsulation.None
})
export class SelectFilterInputComponent implements OnDestroy {
    @ViewChild('selectFilterInput', { read: ElementRef, static: false }) selectFilterInput: ElementRef;
    @Output() change = new EventEmitter<string>();

    term = '';
    private onDestroy$ = new Subject<void>();

    constructor(@Inject(MatSelect) private matSelect: MatSelect) {}

    onModelChange(value: string) {
        this.change.next(value);
    }

    ngOnInit() {
        this.change
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((val: string) => this.term = val );

        this.matSelect.openedChange
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((isOpened: boolean) => {
                if (isOpened) {
                    this.selectFilterInput.nativeElement.focus();
                } else {
                    this.change.next('');
                }
            });
    }

    reset(event?: KeyboardEvent) {
        if (event) {
            event.stopPropagation();
        }

        this.change.next('');
        this.selectFilterInput.nativeElement.focus();
    }

    handleKeydown($event: KeyboardEvent) {
        if (this.term) {
            if ($event.keyCode === ESCAPE) {
                event.stopPropagation();
                this.change.next('');
            }

            if (($event.target as HTMLInputElement).tagName === 'INPUT' && $event.keyCode === TAB) {
                event.stopPropagation();
            }
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
