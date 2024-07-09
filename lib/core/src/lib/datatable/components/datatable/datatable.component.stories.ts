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

import { applicationConfig, Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { CoreStoryModule } from '../../../testing/core.story.module';
import { DataTableComponent } from './datatable.component';
import { DataTableModule } from '../../datatable.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { mockPathInfos } from '../mocks/datatable.mock';
import { importProvidersFrom } from '@angular/core';

export default {
    component: DataTableComponent,
    title: 'Core/Datatable/Datatable',
    decorators: [
        moduleMetadata({
            imports: [DataTableModule, MatProgressSpinnerModule, RouterTestingModule]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
        })
    ],
    argTypes: {
        data: {
            control: 'object',
            description: 'Data source for the table',
            table: {
                category: 'Data',
                type: { summary: 'DataTableAdapter' }
            }
        },
        display: {
            control: 'inline-radio',
            options: ['list', 'gallery'],
            description: 'The display mode of the table.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'list' }
            }
        },
        rows: {
            control: 'object',
            description: 'The rows that the datatable will show.',
            table: {
                category: 'Data',
                type: { summary: 'any[]' },
                defaultValue: { summary: '[]' }
            }
        },
        sorting: {
            control: 'object',
            description: 'A string array.\n\n' + 'First element describes the key to sort by.\n\n' + 'Second element describes the sorting order.',
            table: {
                type: { summary: 'any[]' },
                defaultValue: { summary: '[]' }
            }
        },
        columns: {
            control: 'object',
            description: 'The columns that the datatable will show.',
            table: {
                category: 'Data',
                type: { summary: 'any[]' },
                defaultValue: { summary: '[]' }
            }
        },
        selectionMode: {
            control: 'inline-radio',
            description: 'Row selection mode.',
            options: ['none', 'single', 'multiple'],
            table: {
                category: 'Selection',
                type: { summary: 'string' },
                defaultValue: { summary: 'single' }
            }
        },
        multiselect: {
            control: 'boolean',
            description: 'Toggles multiple row selection, which renders checkboxes at the beginning of each row.',
            table: {
                category: 'Selection',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        mainTableAction: {
            control: 'boolean',
            description: 'Toggles main data table action column.',
            table: {
                category: 'Data Actions Column',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        actions: {
            control: 'boolean',
            description: 'Toggles the data actions column.',
            table: {
                category: 'Data Actions Column',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        showMainDatatableActions: {
            control: 'boolean',
            description: 'Toggles the main datatable action.',
            table: {
                category: 'Data Actions Column',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        actionsPosition: {
            control: 'inline-radio',
            description: 'Position of the actions dropdown menu.',
            options: ['right', 'left'],
            table: {
                category: 'Data Actions Column',
                type: { summary: 'string' },
                defaultValue: { summary: 'right' }
            }
        },
        actionsVisibleOnHover: {
            control: 'boolean',
            description: 'Toggles whether the actions dropdown should only be visible if the row is hovered over or the dropdown menu is open.',
            table: {
                category: 'Data Actions Column',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        fallbackThumbnail: {
            control: 'text',
            description: 'Fallback image for rows where the thumbnail is missing.',
            table: {
                type: { summary: 'string' }
            }
        },
        contextMenu: {
            control: 'boolean',
            description: 'Toggles custom context menu for the component.',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        rowStyle: {
            control: 'object',
            description:
                'The inline style to apply to every row. See [NgStyle](https://angular.io/docs/ts/latest/api/common/index/NgStyle-directive.html) docs for more details and usage examples.',
            table: {
                category: 'Custom Row Styles',
                type: { summary: '{ [key: string]: any }' }
            }
        },
        rowStyleClass: {
            control: 'text',
            description: 'The CSS class to apply to every row.',
            table: {
                category: 'Custom Row Styles',
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        showHeader: {
            control: 'inline-radio',
            description: 'Toggles the header visibility mode.',
            options: ['never', 'always', 'data'],
            table: {
                category: 'Header',
                type: { summary: 'string' },
                defaultValue: { summary: 'data' }
            }
        },
        stickyHeader: {
            control: 'boolean',
            description: 'Toggles the sticky header mode.',
            table: {
                category: 'Header',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        loading: {
            control: 'boolean',
            table: {
                category: 'Table Template',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        noPermission: {
            control: 'boolean',
            table: {
                category: 'Table Template',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        rowMenuCacheEnabled: {
            control: 'boolean',
            description: 'Should the items for the row actions menu be cached for reuse after they are loaded the first time?',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        allowFiltering: {
            control: 'boolean',
            description: 'Flag that indicate if the datatable allow the use facet widget search for filtering.',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        rowClick: {
            action: 'rowClick',
            description: 'Emitted when the user clicks a row.',
            table: { category: 'Actions' }
        },
        rowDblClick: {
            action: 'rowDblClick',
            description: 'Emitted when the user double-clicks a row.',
            table: { category: 'Actions' }
        },
        /* commented until [AAE-10239] fixed
        showRowContextMenu: {
          action: 'showRowContextMenu',
          description: 'Emitted before the context menu is displayed for a row.',
          table: { category: 'Actions' }
        },
        showRowActionsMenu: {
          action: 'showRowActionsMenu',
          description: 'Emitted before the actions menu is displayed for a row.',
          table: { category: 'Actions' }
        },
        */
        executeRowAction: {
            action: 'executeRowAction',
            description: 'Emitted when the user executes a row action.',
            table: { category: 'Actions' }
        },
        columnOrderChanged: {
            action: 'columnOrderChanged',
            description: 'Emitted when the order of columns changed.',
            table: { category: 'Actions' }
        }
    },
    args: {
        display: 'list',
        rows: [
            {
                id: 1,
                textCol: 'This is a very long text inside the text column to check if the hidden text will be displayed on hover.',
                imageCol: 'material-icons://folder_open',
                iconCol: 'folder_open',
                dateCol: new Date(),
                fileSizeCol: '536870912',
                locationCol: mockPathInfos[0],
                booleanCol: true,
                amountCol: 100.55,
                numberCol: 10000.31,
                jsonCol: mockPathInfos[0]
            },
            {
                id: 2,
                textCol: 'Text 2',
                imageCol: 'material-icons://cloud_outline',
                iconCol: 'cloud_outline',
                dateCol: new Date().setDate(new Date().getDate() - 1),
                fileSizeCol: '524288',
                locationCol: mockPathInfos[1],
                booleanCol: false,
                amountCol: 1020.123,
                numberCol: 240.3,
                jsonCol: mockPathInfos[1]
            },
            {
                id: 3,
                textCol: 'Text 3',
                imageCol: 'material-icons://save',
                iconCol: 'save',
                dateCol: new Date().setDate(new Date().getDate() - 5),
                fileSizeCol: '10737418240B',
                locationCol: mockPathInfos[1],
                booleanCol: 'true',
                amountCol: -2020,
                numberCol: 120,
                jsonCol: mockPathInfos[1]
            },
            {
                id: 4,
                textCol: 'Text 4',
                imageCol: 'material-icons://delete',
                iconCol: 'delete',
                dateCol: new Date().setDate(new Date().getDate() - 6),
                fileSizeCol: '512B',
                locationCol: mockPathInfos[2],
                booleanCol: 'false',
                amountCol: 230.76,
                numberCol: 3.032,
                jsonCol: mockPathInfos[2]
            },
            {
                id: 5,
                textCol: 'Text 5',
                imageCol: 'material-icons://person_outline',
                iconCol: 'person_outline',
                dateCol: new Date().setDate(new Date().getDate() - 7),
                fileSizeCol: '1073741824B',
                locationCol: mockPathInfos[0],
                booleanCol: 'false',
                amountCol: 0.444,
                numberCol: 2000,
                jsonCol: mockPathInfos[0]
            }
        ],
        sorting: ['id', 'asc'],
        columns: [
            { type: 'text', key: 'id', title: 'Id', sortable: true },
            {
                type: 'text',
                key: 'textCol',
                title: 'Text Column',
                sortable: true,
                draggable: true,
                cssClass: 'adf-ellipsis-cell',
                copyContent: true
            },
            { type: 'image', key: 'imageCol', title: 'Image Column', draggable: true, cssClass: 'adf-ellipsis-cell' },
            { type: 'icon', key: 'iconCol', title: 'Icon Column', draggable: true, cssClass: 'adf-ellipsis-cell' },
            { type: 'date', key: 'dateCol', title: 'Date Column', sortable: true, draggable: true, cssClass: 'adf-ellipsis-cell' },
            {
                type: 'date',
                key: 'dateCol',
                title: 'Date Time Ago Column',
                sortable: true,
                draggable: true,
                cssClass: 'adf-ellipsis-cell',
                dateConfig: { format: 'timeAgo' }
            },
            { type: 'fileSize', key: 'fileSizeCol', title: 'File Size Column', sortable: true, draggable: true, cssClass: 'adf-ellipsis-cell' },
            { type: 'location', format: '/files', key: 'locationCol', title: 'Location Column', draggable: true, cssClass: 'adf-ellipsis-cell' },
            { type: 'boolean', key: 'booleanCol', title: 'Boolean Column', draggable: true, cssClass: 'adf-ellipsis-cell' },
            { type: 'amount', key: 'amountCol', title: 'Amount Column', draggable: true, cssClass: 'adf-ellipsis-cell' },
            { type: 'number', key: 'numberCol', title: 'Number Column', draggable: true, cssClass: 'adf-ellipsis-cell' },
            { type: 'json', key: 'jsonCol', title: 'JSON Column', draggable: true, cssClass: 'adf-ellipsis-cell' }
        ],
        selectionMode: 'single',
        multiselect: false,
        mainTableAction: true,
        actions: false,
        showMainDatatableActions: false,
        actionsPosition: 'right',
        actionsVisibleOnHover: false,
        contextMenu: false,
        rowStyleClass: '',
        showHeader: 'data',
        stickyHeader: false,
        loading: false,
        noPermission: false,
        rowMenuCacheEnabled: false,
        allowFiltering: false
    }
} as Meta<DataTableComponent>;

const insertContentToTemplate = (content: string): string =>
    `<adf-datatable
    [rows]=rows
    [sorting]=sorting
    [columns]=columns
    [selectionMode]=selectionMode
    [multiselect]=multiselect
    [mainTableAction]=mainTableAction
    [actions]=actions
    [showMainDatatableActions]=showMainDatatableActions
    [actionsPosition]=actionsPosition
    [actionsVisibleOnHover]=actionsVisibleOnHover
    [contextMenu]=contextMenu
    [rowStyleClass]=rowStyleClass
    [showHeader]=showHeader
    [stickyHeader]=stickyHeader
    [loading]=loading
    [noPermission]=noPermission
    [rowMenuCacheEnabled]=rowMenuCacheEnabled
    [allowFiltering]=allowFiltering
    (rowClick)=rowClick($event)
    (rowDblClick)=rowDblClick($event)
    (executeRowAction)=executeRowAction($event)
    (columnOrderChanged)=columnOrderChanged($event)
    >
    ${content}
  </adf-datatable>`;

export const DefaultDatatable: StoryFn<DataTableComponent> = (args) => ({
    props: args,
    template: insertContentToTemplate('')
});

export const EmptyWithList: StoryFn<DataTableComponent> = (args) => ({
    props: {
        ...args,
        rows: []
    },
    template: insertContentToTemplate(`
    <adf-empty-list>
      <div adf-empty-list-header>Empty List Header</div>
      <div adf-empty-list-body>Empty List Body</div>
      <div adf-empty-list-footer>Empty List Footer</div>
    </adf-empty-list>
  `)
});

export const EmptyWithTemplate: StoryFn<DataTableComponent> = (args) => ({
    props: {
        ...args,
        rows: []
    },
    template: insertContentToTemplate(`
    <adf-no-content-template>
      <ng-template>Sorry, no content</ng-template>
    </adf-no-content-template>
  `)
});

export const LoadingWithTemplate: StoryFn<DataTableComponent> = (args) => ({
    props: {
        ...args,
        loading: true
    },
    template: insertContentToTemplate(`
    <adf-loading-content-template>
      <ng-template>
        <mat-progress-spinner [mode]='indeterminate'>
        </mat-progress-spinner>
      </ng-template>
    </adf-loading-content-template>
  `)
});

export const NoPermissionWithTemplate: StoryFn<DataTableComponent> = (args) => ({
    props: {
        ...args,
        noPermission: true
    },
    template: insertContentToTemplate(`
    <adf-no-permission-template>
      <ng-template>
        <div style=color:red;>You don't have permission to this content.</div>
      </ng-template>
    </adf-no-permission-template>
  `)
});

export const MainMenuWithTemplate: StoryFn<DataTableComponent> = (args) => ({
    props: {
        ...args,
        mainTableAction: true,
        showMainDatatableActions: true
    },
    template: insertContentToTemplate(`
    <adf-main-menu-datatable-template>
      <ng-template let-mainMenuTrigger>
        <adf-datatable-column-selector [columns]=columns [mainMenuTrigger]=mainMenuTrigger>
        </adf-datatable-column-selector>
      </ng-template>
    </adf-main-menu-datatable-template>
  `)
});

export const StickyHeader: StoryFn<DataTableComponent> = (args) => ({
    props: {
        ...args,
        stickyHeader: true
    },
    template: '<div style="overflow:scroll;display:block;height:230px;">' + insertContentToTemplate(``) + '</div>'
});
