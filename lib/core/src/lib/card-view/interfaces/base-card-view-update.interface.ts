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

import { Subject } from 'rxjs';
import { CardViewBaseItemModel } from '../models/card-view-baseitem.model';
import { UpdateNotification } from './update-notification.interface';
import { ClickNotification } from './click-notification.interface';

export interface BaseCardViewUpdate {
    itemUpdated$: Subject<UpdateNotification>;
    itemClicked$: Subject<ClickNotification>;
    updateItem$: Subject<CardViewBaseItemModel>;

    update(property: CardViewBaseItemModel, newValue: any);
    clicked(property: CardViewBaseItemModel);
    updateElement(notification: CardViewBaseItemModel);
}
