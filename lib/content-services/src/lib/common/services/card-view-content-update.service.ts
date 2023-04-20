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

import { UpdateNotification, CardViewBaseItemModel, CardViewUpdateService } from '@alfresco/adf-core';
import { MinimalNode } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BaseCardViewContentUpdate } from '../../interfaces/base-card-view-content-update.interface';

@Injectable({
  providedIn: 'root'
})
export class CardViewContentUpdateService implements BaseCardViewContentUpdate {

  itemUpdated$ = new Subject<UpdateNotification>();

  updatedAspect$ = new Subject<MinimalNode>();

  constructor(private cardViewUpdateService: CardViewUpdateService) {
    this.linkVariables();
  }

  update(property: CardViewBaseItemModel, newValue: any) {
    this.cardViewUpdateService.update(property, newValue);
  }

  updateElement(notification: CardViewBaseItemModel) {
    this.cardViewUpdateService.updateElement(notification);
  }

  updateNodeAspect(node: MinimalNode) {
    this.updatedAspect$.next(node);
  }

  private linkVariables() {
    this.linkItemUpdated();
  }

  private linkItemUpdated() {
    this.cardViewUpdateService.itemUpdated$.subscribe(res => {
      this.itemUpdated$.next(res);
    });
  }
}
