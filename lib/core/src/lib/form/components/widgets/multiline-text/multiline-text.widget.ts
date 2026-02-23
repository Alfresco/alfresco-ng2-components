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

/* eslint-disable @angular-eslint/component-selector */

import { NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { isObservable } from 'rxjs';
import { ADF_CUSTOM_MESSAGE } from '../core/custom-validation-message.token';
import { ErrorWidgetComponent } from '../error/error.component';
import { WidgetComponent } from '../widget.component';

@Component({
    selector: 'multiline-text-widget',
    templateUrl: './multiline-text.widget.html',
    styleUrls: ['./multiline-text.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    imports: [MatFormFieldModule, NgIf, TranslatePipe, MatInputModule, FormsModule, ErrorWidgetComponent],
    encapsulation: ViewEncapsulation.None
})
export class MultilineTextWidgetComponentComponent extends WidgetComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly enableCustomMessage = inject(ADF_CUSTOM_MESSAGE, { optional: true });

    ngOnInit(): void {
        if (this.enableCustomMessage != null) {
            if (isObservable(this.enableCustomMessage)) {
                this.enableCustomMessage.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enabled: boolean) => {
                    if (this.field) {
                        this.field.enableCustomValidationMessage = enabled ?? false;
                    }
                });
            } else {
                this.field.enableCustomValidationMessage = this.enableCustomMessage;
            }
        } else {
            this.field.enableCustomValidationMessage = false;
        }
    }
}
