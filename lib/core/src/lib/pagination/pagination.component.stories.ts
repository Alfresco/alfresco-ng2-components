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

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CoreStoryModule } from '../testing/core.story.module';
import { PaginationModule } from './pagination.module';
import { PaginationComponent } from './pagination.component';

export default {
    component: PaginationComponent,
    title: 'Core/Pagination/Pagination',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, PaginationModule]
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
            defaultValue: [5, 10, 15, 20],
            description: 'An array of page sizes.',
            table: { type: { summary: 'number[]' } }
        },
        pagination: {
            control: 'object',
            description: 'Pagination object.',
            defaultValue: { skipCount: 0, maxItems: 25, totalItems: 100, count: 100, hasMoreItems: false },
            table: {
                type: { summary: 'PaginationModel' },
                defaultValue: {
                    summary: 'PaginationModel',
                    detail: '{\n skipCount: 0 /* How many entities exist in the collection before those included in this list? */,' +
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
    }
} as Meta;

const template: Story<PaginationComponent> = (args: PaginationComponent) => ({
    props: args
});

export const pagination = template.bind({});
pagination.parameters = { layout: 'centered' };
