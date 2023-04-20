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

import { Injectable } from '@angular/core';

export interface SortableByCategoryItem {
  name: string;
  category?: string;
}

export interface ItemsByCategory<T> {
  category: string;
  items: T[];
}

@Injectable({
  providedIn: 'root'
})
export class SortByCategoryMapperService<T extends SortableByCategoryItem = SortableByCategoryItem> {

  private defaultCategories: string[] = [];

  mapItems(items: T[], defaultCategories: string[]): ItemsByCategory<T>[] {
    this.defaultCategories = defaultCategories;

    const sortedItems = this.sortItems(items);
    const itemsByCategory = this.mapItemsByCategory(sortedItems);
    const itemsSortedByCategory = this.sortCategories(itemsByCategory);

    return itemsSortedByCategory;
  }

  private mapItemsByCategory(items: T[]): ItemsByCategory<T>[] {
    const itemsByCategoryObject: { [category: string]: T[] } = {};

    items.forEach((item) => {
      const category = this.mapItemDefaultCategory(item);
      if (!itemsByCategoryObject[category]) {
        itemsByCategoryObject[category] = [];
      }

      itemsByCategoryObject[category].push(item);
    });

    const itemsByCategory: ItemsByCategory<T>[] = Object.keys(itemsByCategoryObject).map((key) => {
      const category = key;
      return { category, items: itemsByCategoryObject[category] };
    });

    return itemsByCategory;
  }

  private sortItems(items: T[]): T[] {
    return items.sort((itemA, itemB) => itemA.name.localeCompare(itemB.name));
  }

  private sortCategories(itemsByCategory: ItemsByCategory<T>[]): ItemsByCategory<T>[] {
    return itemsByCategory.sort((itemA, itemB) => {
      if (itemB.category === '' && itemA.category === '') {
        return 0;
      }

      if (itemA.category === '') {
        return 1;
      }

      if (itemB.category === '') {
        return -1;
      }

      return itemA.category.localeCompare(itemB.category);
    }
    );
  }

  private mapItemDefaultCategory(listItem: SortableByCategoryItem): string {
    const itemCategory = listItem.category;

    if (!this.isDefaultCategory(itemCategory)) {
      return (itemCategory ?? '');
    }

    return '';
  }

  private isDefaultCategory(category?: string): boolean {
    return category ? this.defaultCategories.includes(category) : false;
  }
}
