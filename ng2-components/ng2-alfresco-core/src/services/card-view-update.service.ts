/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CardViewBaseItemModel } from '../models/card-view-baseitem.model';

export interface UpdateNotification {
    target: any;
    changed: any;
}

export interface ClickNotification {
    target: any;
}

@Injectable()
export class CardViewUpdateService {

    // Observable sources
    private itemUpdatedSource = new Subject<UpdateNotification>();

    // Observable streams
    public itemUpdated$ = this.itemUpdatedSource.asObservable();

    public itemClicked$: Subject<ClickNotification> = new Subject<ClickNotification>();

    update(property: CardViewBaseItemModel, changed: any) {
        this.itemUpdatedSource.next({
            target: property,
            changed
        });
    }

    clicked(property: CardViewBaseItemModel) {
        this.itemClicked$.next({
            target: property
        });
    }
}
