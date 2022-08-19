/*!
 * @license
 * Copyright 2022 Alfresco Software, Ltd.
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
import { DataColumnModule } from './data-column.module';
import { DataColumnComponent } from './data-column.component';
import { DataTableModule } from './../datatable/datatable.module';
import { CoreStoryModule } from '../testing/core.story.module';
import * as data from './../mock/data-column.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { DataRow } from './../datatable';

export default {
    component: DataColumnComponent,
    title: 'Core/Data Column/Data Column',
    decorators: [
        moduleMetadata({
            imports: [
                CoreStoryModule,
                DataColumnModule,
                DataTableModule,
                RouterTestingModule
            ]
        })
    ],
    argTypes: {
        copyContent: {
            control: { type: 'boolean' },
            defaultValue: true
        },
        sortable: {
            control: { type: 'boolean' },
            defaultValue: true
        },
        draggable: {
            control: { type: 'boolean' },
            defaultValue: true
        },
        editable: {
            control: { type: 'boolean', disable: true },
            defaultValue: true
        },
        title: {
            control: { type: 'text' }
        },
        isHidden: {
            control: { type: 'boolean' },
            defaultValue: false
        },
        format: {
            control: { type: 'select', disable: true },
            options: [
                'medium',
                'short',
                'long',
                'full',
                'shortDate',
                'mediumDate',
                'longDate',
                'fullDate',
                'shortTime',
                'mediumTime',
                'longTime',
                'fullTime',
                'timeAgo'
            ]
        },
        cssClass: {
            control: { type: 'text' },
            defaultValue: ''
        },
        srTitle: {
            control: { type: 'text' },
            defaultValue: ''
        },
        data: {
            control: { disable: true },
            mapping: {
                text: data.dataText,
                icon: data.dataIcon,
                file: data.dataSizeInBytes
            }
        },
        columns: {
            control: { disable: true }
        },
        rows: {
            control: { disable: true }
        },
        key: {
            control: { type: 'text', disable: false }
        },
        type: {
            control: { disable: true }
        },
        formatTooltip: {
            control: { disable: true }
        }
    }
} as Meta;

const formatCustomTooltip = (row: DataRow): string =>
    row ? row.getValue('id') + ' by formatCustomTooltip' : null;

const template: Story = (args) => ({
    props: args,
    template: `
        ${
            args.columns && args.rows
                ? '<adf-datatable [columns]="columns' +
                  (args.type === 'date' ? '()' : '') +
                  '" [rows]="rows">'
                : '<adf-datatable [data]="data">'
        }
        <data-columns>
            <data-column [key]="key" [type]="type"
            title="${args.title}"
            [editable]="${args.editable}"
            [sortable]="${args.sortable}"
            [draggable]="${args.draggable}"
            [copyContent]="${args.copyContent}"
            format="${args.format}"
            [isHidden]="${args.isHidden}"
            class="${args.cssClass}"
            sr-title="${args.srTitle}"
            [formatTooltip]="formatTooltip">
            </data-column>
        </data-columns>
    </adf-datatable>`
});

export const textTemplateColumn = template.bind({});
textTemplateColumn.args = {
    data: 'text',
    key: 'id',
    type: 'text',
    title: 'Text Column'
};

export const iconTemplateColumn = template.bind({});
iconTemplateColumn.argTypes = {
    copyContent: { control: { disable: true } }
};
iconTemplateColumn.args = {
    data: 'icon',
    key: 'icon',
    type: 'icon',
    title: 'Icon Column'
};

export const dateTemplateColumn = template.bind({});
dateTemplateColumn.argTypes = {
    format: { control: { disable: false } },
    title: { control: { disable: true } },
    copyContent: { control: { disable: true } },
    sortable: { control: { disable: true } },
    draggable: { control: { disable: true } },
    isHidden: { control: { disable: true } }
};
dateTemplateColumn.args = {
    data: undefined,
    format: 'medium',
    columns() {
        return [{ ...data.dateColumns, format: this.format }];
    },
    rows: data.dateRows,
    key: 'id',
    type: 'date'
};

export const fileTemplateColumn = template.bind({});
fileTemplateColumn.argTypes = {
    copyContent: { control: { disable: true } }
};
fileTemplateColumn.args = {
    data: 'file',
    key: 'size',
    type: 'fileSize',
    title: 'File Column'
};

export const locationTemplateColumn = template.bind({});
locationTemplateColumn.argTypes = {
    copyContent: { control: { disable: true } }
};
locationTemplateColumn.args = {
    columns: data.locationColumns,
    rows: data.locationRows,
    key: 'id',
    type: 'location',
    title: 'Location Column'
};

export const jsonTemplateColumn = template.bind({});
jsonTemplateColumn.argTypes = {
    editable: { control: { disable: false } },
    copyContent: { control: { disable: true } }
};
jsonTemplateColumn.args = {
    data: 'text',
    key: 'id',
    type: 'json',
    title: 'JSON Column'
};

export const customTooltipTemplateColumn = template.bind({});
customTooltipTemplateColumn.args = {
    data: 'text',
    key: 'id',
    type: 'text',
    title: 'Custom Tooltip Column',
    formatTooltip: formatCustomTooltip
};
