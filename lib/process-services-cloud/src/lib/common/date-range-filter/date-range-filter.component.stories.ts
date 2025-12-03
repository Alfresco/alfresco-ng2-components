/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { applicationConfig, Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { provideStoryProcessServicesCloud } from '../../stories/process-services-cloud-story.providers';
import { mockFilterProperty } from '../mock/date-range-filter.mock';
import { DateRangeFilterComponent } from './date-range-filter.component';

const meta: Meta<DateRangeFilterComponent> = {
    component: DateRangeFilterComponent,
    title: 'Process Services Cloud/Process Common/Date Range Filter',
    decorators: [
        moduleMetadata({
            imports: [DateRangeFilterComponent]
        }),
        applicationConfig({
            providers: [...provideStoryProcessServicesCloud()]
        })
    ],
    argTypes: {
        processFilterProperty: {
            control: 'object',
            table: {
                type: { summary: 'ApplicationInstanceModel' }
            }
        },
        options: {
            control: 'object',
            table: {
                type: { summary: 'DateCloudFilterType[]' }
            }
        },
        dateChanged: {
            action: 'dateChanged',
            table: { category: 'Actions' }
        },
        dateTypeChange: {
            action: 'dateTypeChange',
            table: { category: 'Actions' }
        }
    },
    args: {
        processFilterProperty: mockFilterProperty
    }
};

export default meta;
type Story = StoryObj<DateRangeFilterComponent>;

export const DateRangeFilter: Story = {
    render: (args) => ({
        props: args
    })
};
