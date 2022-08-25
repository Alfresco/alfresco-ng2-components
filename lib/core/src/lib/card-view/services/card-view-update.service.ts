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

import { MinimalNode } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CardViewBaseItemModel } from '../models/card-view-baseitem.model';

export interface UpdateNotification {
    target: CardViewBaseItemModel;
    changed: any;
}

export interface ClickNotification {
    target: any;
}

export const transformKeyToObject = (key: string, value): any => {
    const objectLevels: string[] = key.split('.').reverse();

    return objectLevels.reduce<any>((previousValue, currentValue) => ({ [currentValue]: previousValue}), value);
};

@Injectable({
    providedIn: 'root'
})
export class CardViewUpdateService {

    itemUpdated$ = new Subject<UpdateNotification>();
    itemClicked$ = new Subject<ClickNotification>();
    updateItem$ = new Subject<CardViewBaseItemModel>();
    updatedAspect$ = new Subject<MinimalNode>();

    update(property: CardViewBaseItemModel, newValue: any) {
        this.itemUpdated$.next({
            target: property,
            changed: transformKeyToObject(property.key, newValue)
        });
    }

    clicked(property: CardViewBaseItemModel) {
        this.itemClicked$.next({
            target: property
        });
    }

    /**
     * Updates the cardview items property
     *
     * @param notification
     */
    updateElement(notification: CardViewBaseItemModel) {
        this.updateItem$.next(notification);
    }

    updateNodeAspect(node: MinimalNode) {
        this.updatedAspect$.next(node);
    }

}
