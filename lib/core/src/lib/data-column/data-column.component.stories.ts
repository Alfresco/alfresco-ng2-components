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
    ]
} as Meta;

export const textColumn: Story = args => ({
    props: {
        ...args,
        data: data.dataText,
        sortable: true
    },
    template: `
    <adf-datatable [data]="data">
        <data-columns>
            <data-column key="id" type="text" [sortable]="false" title="Text Column"></data-column>
        </data-columns>
    </adf-datatable>
    `
});

export const iconColumn: Story = args => ({
    props: {
        ...args,
        data: data.dataIcon
    },
    template: `
    <adf-datatable [data]="data">
        <data-columns>
            <data-column key="icon" type="icon" [sortable]="false" title="Icon Column"></data-column>
        </data-columns>
    </adf-datatable>
    `
});

export const dateColumn: Story = args => ({
    props: {
        ...args,
        columns: data.dateColumns,
        rows: data.dateRows
    },
    template: `
    <adf-datatable [columns]="columns" [rows]="rows">
        <data-columns>
            <data-column key="id" type="date" [sortable]="false"></data-column>
        </data-columns>
    </adf-datatable>
    `
});

export const fileColumn: Story = args => ({
    props: {
        ...args,
        data: data.dataSizeInBytes
    },
    template: `
    <adf-datatable [data]="data">
        <data-columns>
            <data-column key="size" type="fileSize" [sortable]="false" title="File Column"></data-column>
        </data-columns>
    </adf-datatable>
    `
});

export const locationColumn: Story = args => ({
    props: {
        ...args,
        columns: data.locationColumns,
        rows: data.locationRows
    },
    template: `
    <adf-datatable [columns]="columns" [rows]="rows">
        <data-columns>
            <data-column key="id" type="location" [sortable]="false"></data-column>
        </data-columns>
    </adf-datatable>
    `
});

export const jsonColumn: Story = args => ({
    props: {
        ...args,
        data: data.dataText
    },
    template: `
    <adf-datatable [data]="data">
        <data-columns>
            <data-column key="id" type="json" [sortable]="false" title="JSON Column"></data-column>
        </data-columns>
    </adf-datatable>
    `
});
