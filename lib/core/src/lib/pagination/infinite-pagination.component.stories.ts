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

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CoreStoryModule } from '../testing/core.story.module';
import { PaginationModule } from './pagination.module';
import { InfinitePaginationComponent } from './infinite-pagination.component';
import { BehaviorSubject } from 'rxjs';
import { PaginationModel } from '../../..';
import { PaginatedComponent } from './paginated-component.interface';

class TestPaginatedComponent implements PaginatedComponent {

  private _pagination: BehaviorSubject<PaginationModel>;

  get pagination(): BehaviorSubject<PaginationModel> {
    if (!this._pagination) {
      const defaultPagination = {
        maxItems: 10,
        skipCount: 0,
        totalItems: 0,
        hasMoreItems: false
      };
      this._pagination = new BehaviorSubject<PaginationModel>(defaultPagination);
    }
    return this._pagination;
  }

  updatePagination(pagination: PaginationModel) {
    this.pagination.next(pagination);
  }
}

const paginatedComponent = new TestPaginatedComponent();

export default {
  component: InfinitePaginationComponent,
  title: 'Core/Pagination/InfinitePagination',
  decorators: [
    moduleMetadata({
      imports: [CoreStoryModule, PaginationModule]
    })
  ],
  argTypes: {
    target: {
      control: 'object',
      description: 'Component that provides custom pagination support.',
      mapping: { def: paginatedComponent },
      table: { type: { summary: 'PaginatedComponent' } }
    },
    pageSize: {
      control: 'number',
      description: 'Number of items that are added with each "load more" event.',
      table: { type: { summary: 'number' } }
    },
    isLoading: {
      control: 'boolean',
      description: 'Is a new page loading?',
      defaultValue: false,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    loadMore: {
      action: 'loadMore',
      description: 'Emitted when the "Load More" button is clicked.',
      table: { category: 'Actions' }
    }
  }
} as Meta;

const template: Story<InfinitePaginationComponent> = (args: InfinitePaginationComponent) => ({
  props: {
    ...args,
    target: 'def'
  }
});

export const infinitePagination = template.bind({});
