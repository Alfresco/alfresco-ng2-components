/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { CoreStoryModule } from '../testing/core.story.module';
import { PAGINATION_DIRECTIVES } from './pagination.module';
import { PaginationComponent } from './pagination.component';
import { importProvidersFrom } from '@angular/core';

export default {
    component: PaginationComponent,
    title: 'Core/Pagination/Pagination',
    decorators: [
        moduleMetadata({
            imports: [...PAGINATION_DIRECTIVES]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
        })
    ],
    argTypes: {
        target: {
            control: 'object',
            description: 'Component that provides custom pagination support.',
            table: { type: { summary: 'PaginatedComponent' } }
        },
        supportedPageSizes: {
            control: 'object',
            description: 'An array of page sizes.',
            table: { type: { summary: 'number[]' } }
        },
        pagination: {
            control: 'object',
            description: 'Pagination object.',
            table: {
                type: { summary: 'PaginationModel' },
                defaultValue: {
                    summary: 'PaginationModel',
                    detail:
                        '{\n skipCount: 0 /* How many entities exist in the collection before those included in this list? */,' +
                        '\n maxItems: 25 /* The value of the maxItems parameter used to generate this list. The default value is 100. */,' +
                        '\n totalItems: 0 /* An integer describing the total number of entities in the collection. */,' +
                        '\n count: 0, /* The number of objects in the entries array. */' +
                        '\n hasMoreItems: false /* Are there more entities in the collection beyond those in this response? */\n}'
                }
            }
        },
        change: {
            action: 'change',
            description: 'Emitted when pagination changes in any way.',
            table: { category: 'Actions' }
        },
        changePageNumber: {
            action: 'changePageNumber',
            description: 'Emitted when the page number changes.',
            table: { category: 'Actions' }
        },
        changePageSize: {
            action: 'changePageSize',
            description: 'Emitted when the page size changes.',
            table: { category: 'Actions' }
        },
        nextPage: {
            action: 'nextPage',
            description: 'Emitted when the next page is requested.',
            table: { category: 'Actions' }
        },
        prevPage: {
            action: 'prevPage',
            description: 'Emitted when the previous page is requested.',
            table: { category: 'Actions' }
        }
    },
    args: {
        supportedPageSizes: [5, 10, 15, 20],
        pagination: { skipCount: 0, maxItems: 25, totalItems: 100, count: 100, hasMoreItems: false }
    }
} as Meta<PaginationComponent>;

const template: StoryFn<PaginationComponent> = (args) => ({
    props: args
});

export const Pagination = template.bind({});
Pagination.parameters = { layout: 'centered' };
