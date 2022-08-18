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
import { MatIconModule } from '@angular/material/icon';
import * as data from './../mock/data-column.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { DataRow, ObjectDataTableAdapter } from './../datatable';

const formatCustomTooltip = (row: DataRow): string =>
    row ? row.getValue('id') + ' by formatCustomTooltip' : null;

export default {
    component: DataColumnComponent,
    title: 'Core/Data Column/Data Column',
    decorators: [
        moduleMetadata({
            imports: [
                CoreStoryModule,
                DataColumnModule,
                DataTableModule,
                MatIconModule,
                RouterTestingModule
            ]
        })
    ],
    argTypes: {
        copyContent: {
            control: {
                type: 'boolean'
            },
            defaultValue: true
        },
        sortable: {
            control: {
                type: 'boolean'
            },
            defaultValue: true
        },
        draggable: {
            control: {
                type: 'boolean'
            },
            defaultValue: true
        },
        editable: {
            control: {
                type: 'boolean'
            },
            defaultValue: true
        },
        title: {
            control: { type: 'text' }
        },
        isHidden: {
            control: {
                type: 'boolean'
            },
            defaultValue: false
        },
        format: {
            control: 'select',
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
            // mapping: {
            //     date: data.dateColumns
            // }
        },
        rows: {
            control: { disable: true }
            // mapping: {
            //     date: data.dateRows
            // }
        },
        key: { control: { disable: true } },
        type: { control: { disable: true } },
        formatTooltip: { control: { disable: true } }
    }
} as Meta;

const template: Story = (args) => {
    console.log(args.columns);
    const temp = {
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
            <data-column [key]="key" [type]="type" title="${
                args.title
            }" [editable]="${args.editable}" [sortable]="${
            args.sortable
        }" [draggable]="${args.draggable}" [copyContent]="${
            args.copyContent
        }" format="${args.format}"
            [isHidden]="${args.isHidden}" class="${args.cssClass}" srTitle="${
            args.srTitle
        }" [formatTooltip]="formatTooltip"></data-column>
        </data-columns>
    </adf-datatable>`
    };

    console.log(temp.template);

    return temp;
};

export const testTemplate = template.bind({});

testTemplate.args = {
    title: 'tytul',
    data: 'text',
    type: 'text',
    key: 'id',
    format: undefined,
    cssClass: '',
    srTitle: ''
};

export const textTemplateColumn = template.bind({});
textTemplateColumn.argTypes = {
    editable: { control: { disable: true } },
    format: { control: { disable: true } }
};
textTemplateColumn.args = {
    data: 'text',
    key: 'id',
    type: 'text',
    title: 'Text Column'
};

export const iconTemplateColumn = template.bind({});
iconTemplateColumn.argTypes = {
    editable: { control: { disable: true } },
    format: { control: { disable: true } },
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
    editable: { control: { disable: true } },
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
    editable: { control: { disable: true } },
    format: { control: { disable: true } },
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
    editable: { control: { disable: true } },
    format: { control: { disable: true } },
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
    format: { control: { disable: true } },
    copyContent: { control: { disable: true } }
};
jsonTemplateColumn.args = {
    data: 'text',
    key: 'id',
    type: 'json',
    title: 'JSON Column'
};

export const customTooltipTemplateColumn = template.bind({});
customTooltipTemplateColumn.argTypes = {
    format: { control: { disable: true } }
};
customTooltipTemplateColumn.args = {
    data: 'text',
    key: 'id',
    type: 'text',
    title: 'Custom Tooltip Column',
    formatTooltip: formatCustomTooltip
};

//////////////////////////////////////////

export const textColumn: Story = (args) => ({
    props: {
        ...args,
        data: data.dataText
    },
    template: `
    <adf-datatable [data]="data">
        <data-columns>
            <data-column key="id" type="text" [title]="title" [sortable]="sortable" [copyContent]="copyContent" [editable]="editable" ></data-column>
        </data-columns>
    </adf-datatable>
    `
});

export const iconColumn: Story = (args) => ({
    props: {
        ...args,
        data: data.dataIcon
    },
    template: `
    <adf-datatable [data]="data">
        <data-columns>
            <data-column key="icon" type="icon" title="Icon Column"></data-column>
        </data-columns>
    </adf-datatable>
    `
});

export const dateColumn: Story = (args) => ({
    props: {
        ...args,
        format: 'medium',
        columns: [{ ...data.dateColumns, format: args.format }],
        rows: data.dateRows
    },
    template: `
    <adf-datatable [columns]="columns" [rows]="rows">
        <data-columns>
            <data-column key="id" type="date"></data-column>
        </data-columns>
    </adf-datatable>
    `
});

export const fileColumn: Story = (args) => ({
    props: {
        ...args,
        data: data.dataSizeInBytes
    },
    template: `
    <adf-datatable [data]="data">
        <data-columns>
            <data-column key="size" type="fileSize" title="File Column"></data-column>
        </data-columns>
    </adf-datatable>
    `
});

export const locationColumn: Story = (args) => ({
    props: {
        ...args,
        columns: data.locationColumns,
        rows: data.locationRows
    },
    template: `
    <adf-datatable [columns]="columns" [rows]="rows">
        <data-columns>
            <data-column key="id" type="location"></data-column>
        </data-columns>
    </adf-datatable>
    `
});

export const jsonColumn: Story = (args) => ({
    props: {
        ...args,
        data: data.dataText
    },
    template: `
    <adf-datatable [data]="data">
        <data-columns>
            <data-column key="id" type="json" title="JSON Column" [editable]="editable"></data-column>
        </data-columns>
    </adf-datatable>
    `
});

export const customTooltipColumn: Story = (args) => ({
    props: {
        ...args,
        data: data.dataText,
        formatTooltip: formatCustomTooltip,
        hasCustomTooltip: false
    },
    template: `
    <adf-datatable [data]="data">
        <data-columns>
            <data-column key="id" type="text" title="Text Column" [formatTooltip]="formatTooltip"></data-column>
        </data-columns>
    </adf-datatable>
    `
});

export const customCssColumn: Story = (args) => ({
    props: {
        ...args,
        data: data.dataText
    },
    template: `
    <adf-datatable [data]="data">
        <data-columns>
            <data-column key="id" type="text" title="Text Column" [class]="cssClass"></data-column>
        </data-columns>
    </adf-datatable>
    `
});
