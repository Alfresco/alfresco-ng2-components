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

import { Input, OnDestroy } from '@angular/core';
import { CardViewUpdateService, UpdateNotification } from '../services/card-view.services';
import { CardViewItem } from '../interfaces/card-view.interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export abstract class BaseCardView<T extends CardViewItem> implements OnDestroy {

    @Input()
    property: T;

    protected destroy$ = new Subject<boolean>();

    constructor(protected cardViewUpdateService: CardViewUpdateService) {
        this.cardViewUpdateService.updateItem$
            .pipe(takeUntil(this.destroy$))
            .subscribe((notification: UpdateNotification) => {
            if (this.property.key === notification.target.key) {
                this.property.value = notification.target.value;
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

}
