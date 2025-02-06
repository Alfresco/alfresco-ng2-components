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

import { Directive, inject, Input } from '@angular/core';
import { CardViewUpdateService } from '../services/card-view-update.service';
import { CardViewItem } from '../interfaces/card-view.interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class BaseCardView<T extends CardViewItem> {
    protected cardViewUpdateService = inject(CardViewUpdateService);

    @Input()
    editable = false;

    @Input()
    property: T;

    constructor() {
        this.cardViewUpdateService.updateItem$.pipe(takeUntilDestroyed()).subscribe((itemModel) => {
            if (this.property.key === itemModel.key) {
                this.property.value = itemModel.value;
            }
        });
    }

    get isEditable(): boolean {
        return this.editable && this.property.editable;
    }

    get isReadonlyProperty(): boolean {
        return this.editable && !this.property.editable;
    }

    get hasIcon(): boolean {
        return !!this.property.icon;
    }

}
