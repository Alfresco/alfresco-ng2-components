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

import { Component, DestroyRef, ElementRef, EventEmitter, Inject, inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-select-filter-input',
    imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, TranslatePipe],
    templateUrl: './select-filter-input.component.html',
    styleUrls: ['./select-filter-input.component.scss'],
    host: { class: 'adf-select-filter-input' },
    encapsulation: ViewEncapsulation.None
})
export class SelectFilterInputComponent implements OnInit {
    @ViewChild('selectFilterInput', { read: ElementRef, static: false }) selectFilterInput: ElementRef;
    @Output() change = new EventEmitter<string>();

    term = '';
    previousSelected: any[];

    private readonly destroyRef = inject(DestroyRef);

    constructor(@Inject(MatSelect) private matSelect: MatSelect) {}

    onModelChange(value: string) {
        this.change.next(value);
    }

    ngOnInit() {
        this.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val: string) => (this.term = val));

        this.matSelect.openedChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((isOpened: boolean) => {
            if (isOpened) {
                this.selectFilterInput.nativeElement.focus();
            } else {
                this.change.next('');
            }
        });

        if (this.matSelect.ngControl) {
            this.previousSelected = this.matSelect.ngControl.value;
            this.matSelect.ngControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((values) => {
                let restoreSelection = false;
                if (this.matSelect.multiple && Array.isArray(this.previousSelected)) {
                    if (!Array.isArray(values)) {
                        values = [];
                    }
                    const options = this.matSelect.options.map((option) => option.value);
                    this.previousSelected.forEach((previous) => {
                        const isSelected = [...values, ...options].some((current) => this.matSelect.compareWith(current, previous));
                        if (!isSelected) {
                            values.push(previous);
                            restoreSelection = true;
                        }
                    });
                }

                this.previousSelected = values;
                if (restoreSelection) {
                    // eslint-disable-next-line no-underscore-dangle
                    this.matSelect._onChange(values);
                }
            });
        }
    }

    reset(event?: Event) {
        if (event) {
            event.stopPropagation();
        }

        this.change.next('');
        this.selectFilterInput.nativeElement.focus();
    }

    handleKeydown($event: KeyboardEvent) {
        if (this.term) {
            if ($event.code === 'Escape') {
                $event.stopPropagation();
                this.change.next('');
            }

            if (($event.target as HTMLInputElement).tagName === 'INPUT' && $event.code === 'Tab') {
                $event.stopPropagation();
            }
        }
    }
}
