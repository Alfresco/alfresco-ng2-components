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
import { ProcessServicesCloudStoryModule } from '../../testing/process-services-cloud-story.module';
import { mockFilterProperty } from '../mock/date-range-filter.mock';
import { ProcessCommonModule } from '../process-common.module';
import { DateRangeFilterComponent } from './date-range-filter.component';

export default {
    component: DateRangeFilterComponent,
    title: 'Process Services Cloud/Process Common/Date Range Filter',
    decorators: [
        moduleMetadata({
            imports: [ProcessServicesCloudStoryModule, ProcessCommonModule]
        })
    ],
    argTypes: {
        processFilterProperty: {
            control: 'object',
            defaultValue: mockFilterProperty,
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
    }
} as Meta;

const template: Story<DateRangeFilterComponent> = (args: DateRangeFilterComponent) => ({
    props: args
});

export const dateRangeFilter = template.bind({});
