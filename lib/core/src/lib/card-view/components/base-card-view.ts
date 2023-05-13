/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Input, OnDestroy, Directive, inject } from '@angular/core';
import { CardViewUpdateService } from '../services/card-view-update.service';
import { CardViewItem } from '../interfaces/card-view.interfaces';
import { CardViewBaseItemModel } from '../models/card-view-baseitem.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class BaseCardView<T extends CardViewItem> implements OnDestroy {
    protected cardViewUpdateService = inject(CardViewUpdateService);

    @Input()
    property: T;

    protected destroy$ = new Subject<boolean>();

    constructor() {
        this.cardViewUpdateService.updateItem$
            .pipe(takeUntil(this.destroy$))
            .subscribe((itemModel: CardViewBaseItemModel) => {
            if (this.property.key === itemModel.key) {
                this.property.value = itemModel.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

}
