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
import { CoreStoryModule } from '../../../testing/core.story.module';
import { DataTableComponent } from './datatable.component';
import { DataTableModule } from '../../datatable.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export default {
    component: DataTableComponent,
    title: 'Core/Datatable/Datatable',
    decorators: [
        moduleMetadata({
            imports: [
                CoreStoryModule,
                DataTableModule,
                MatProgressSpinnerModule,
                BrowserAnimationsModule,
                RouterTestingModule
            ]
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
            defaultValue: 'list',
            description: 'The display mode of the table.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'list' }
            }
        },
        rows: {
            control: 'object',
            description: 'The rows that the datatable will show.',
            defaultValue: [
                {
                    id: 1,
                    textCol: 'This is a very long text inside the text column to check if the hidden text will be displayed on hover.',
                    imageCol: 'material-icons://folder_open',
                    iconCol: 'folder_open',
                    dateCol: new Date(),
                    fileSizeCol: '536870912',
                    locationCol: '/path/to/location-link',
                    jsonCol: {
                        id: 1,
                        textCol: 'Text 1',
                        imageCol: 'material-icons://folder_open',
                        iconCol: 'folder_open',
                        dateCol: new Date(),
                        fileSizeCol: '536870912',
                        locationCol: '/path/to/location-link'
                    }
                },
                {
                    id: 2,
                    textCol: 'Text 2',
                    imageCol: 'material-icons://cloud_outline',
                    iconCol: 'cloud_outline',
                    dateCol: new Date(),
                    fileSizeCol: '524288',
                    locationCol: { name: '/path/to/location-link' },
                    jsonCol: {
                        id: 2,
                        textCol: 'Text 2',
                        imageCol: 'material-icons://cloud_outline',
                        iconCol: 'cloud_outline',
                        dateCol: new Date(),
                        fileSizeCol: '524288',
                        locationCol: '/path/to/location-link'
                    }
                },
                {
                    id: 3,
                    textCol: 'Text 3',
                    imageCol: 'material-icons://save',
                    iconCol: 'save',
                    dateCol: new Date(),
                    fileSizeCol: '10737418240B',
                    locationCol: '/path/to/location-link',
                    jsonCol: {
                        id: 3,
                        textCol: 'Text 3',
                        imageCol: 'material-icons://save',
                        iconCol: 'save',
                        dateCol: new Date(),
                        fileSizeCol: '10737418240B',
                        locationCol: '/path/to/location-link'
                    }
                },
                {
                    id: 4,
                    textCol: 'Text 4',
                    imageCol: 'material-icons://delete',
                    iconCol: 'delete',
                    dateCol: new Date(),
                    fileSizeCol: '512B',
                    locationCol: '/path/to/location-link',
                    jsonCol: {
                        id: 4,
                        textCol: 'Text 4',
                        imageCol: 'material-icons://delete',
                        iconCol: 'delete',
                        dateCol: new Date(),
                        fileSizeCol: '512B',
                        locationCol: '/path/to/location-link'
                    }
                },
                {
                    id: 5,
                    textCol: 'Text 5',
                    imageCol: 'material-icons://person_outline',
                    iconCol: 'person_outline',
                    dateCol: new Date(),
                    fileSizeCol: '1073741824B',
                    locationCol: '/path/to/location-link',
                    jsonCol: {
                        id: 5,
                        textCol: 'Text 5',
                        imageCol: 'material-icons://person_outline',
                        iconCol: 'person_outline',
                        dateCol: new Date(),
                        fileSizeCol: '1073741824B',
                        locationCol: '/path/to/location-link'
                    }
                }
            ],
            table: {
                category: 'Data',
                type: { summary: 'any[]' },
                defaultValue: { summary: '[]' }
            }
        },
        sorting: {
            control: 'object',
            defaultValue: ['id', 'asc'],
            description: 'A string array.\n\n' +
                'First element describes the key to sort by.\n\n' +
                'Second element describes the sorting order.',
            table: {
                type: { summary: 'any[]' },
                defaultValue: { summary: '[]' }
            }
        },
        columns: {
            control: 'object',
            description: 'The columns that the datatable will show.',
            defaultValue: [
                { type: 'text', key: 'id', title: 'Id', sortable: true },
                { type: 'text', key: 'textCol', title: 'Text Column', sortable: true, draggable: true, cssClass: 'adf-ellipsis-cell', copyContent: true },
                { type: 'image', key: 'imageCol', title: 'Image Column', draggable: true, cssClass: 'adf-ellipsis-cell' },
                { type: 'icon', key: 'iconCol', title: 'Icon Column', draggable: true, cssClass: 'adf-ellipsis-cell' },
                { type: 'date', key: 'dateCol', title: 'Date Column', sortable: true, draggable: true, cssClass: 'adf-ellipsis-cell' },
                { type: 'fileSize', key: 'fileSizeCol', title: 'File Size Column', sortable: true, draggable: true, cssClass: 'adf-ellipsis-cell' },
                { type: 'location', format: '/somewhere', key: 'locationCol', title: 'Location Column', draggable: true, cssClass: 'adf-ellipsis-cell' },
                { type: 'json', key: 'jsonCol', title: 'JSON Column', draggable: true, cssClass: 'adf-ellipsis-cell' }
            ],
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
            defaultValue: 'single',
            table: {
                category: 'Selection',
                type: { summary: 'string' },
                defaultValue: { summary: 'single' }
            }
        },
        multiselect: {
            control: 'boolean',
            description: 'Toggles multiple row selection, which renders checkboxes at the beginning of each row.',
            defaultValue: false,
            table: {
                category: 'Selection',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        mainTableAction: {
            control: 'boolean',
            description: 'Toggles main data table action column.',
            defaultValue: true,
            table: {
                category: 'Data Actions Column',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        actions: {
            control: 'boolean',
            description: 'Toggles the data actions column.',
            defaultValue: false,
            table: {
                category: 'Data Actions Column',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        showMainDatatableActions: {
            control: 'boolean',
            description: 'Toggles the main datatable action.',
            defaultValue: false,
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
            defaultValue: 'right',
            table: {
                category: 'Data Actions Column',
                type: { summary: 'string' },
                defaultValue: { summary: 'right' }
            }
        },
        actionsVisibleOnHover: {
            control: 'boolean',
            description: 'Toggles whether the actions dropdown should only be visible if the row is hovered over or the dropdown menu is open.',
            defaultValue: false,
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
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        rowStyle: {
            control: 'object',
            description: 'The inline style to apply to every row. See [NgStyle](https://angular.io/docs/ts/latest/api/common/index/NgStyle-directive.html) docs for more details and usage examples.',
            table: {
                category: 'Custom Row Styles',
                type: { summary: '{ [key: string]: any }' }
            }
        },
        rowStyleClass: {
            control: 'text',
            description: 'The CSS class to apply to every row.',
            defaultValue: '',
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
            defaultValue: 'data',
            table: {
                category: 'Header',
                type: { summary: 'string' },
                defaultValue: { summary: 'data' }
            }
        },
        stickyHeader: {
            control: 'boolean',
            description: 'Toggles the sticky header mode.',
            defaultValue: false,
            table: {
                category: 'Header',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        loading: {
            control: 'boolean',
            defaultValue: false,
            table: {
                category: 'Table Template',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        noPermission: {
            control: 'boolean',
            defaultValue: false,
            table: {
                category: 'Table Template',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        rowMenuCacheEnabled: {
            control: 'boolean',
            description: 'Should the items for the row actions menu be cached for reuse after they are loaded the first time?',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        allowFiltering: {
            control: 'boolean',
            description: 'Flag that indicate if the datatable allow the use facet widget search for filtering.',
            defaultValue: false,
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
    }
} as Meta;

const insertContentToTemplate = (content: string): string => (
    `<adf-datatable
    [display]=display
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
  </adf-datatable>`
);

export const defaultDatatable: Story<DataTableComponent> = (args: DataTableComponent) => ({
    props: args,
    template: insertContentToTemplate('')
});

export const emptyWithList: Story<DataTableComponent> = (args: DataTableComponent) => ({
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

export const emptyWithTemplate: Story<DataTableComponent> = (args: DataTableComponent) => ({
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

export const loadingWithTemplate: Story<DataTableComponent> = (args: DataTableComponent) => ({
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

export const noPermissionWithTemplate: Story<DataTableComponent> = (args: DataTableComponent) => ({
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

export const mainMenuWithTemplate: Story<DataTableComponent> = (args: DataTableComponent) => ({
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

export const stickyHeader: Story<DataTableComponent> = (args: DataTableComponent) => ({
    props: {
        ...args,
        stickyHeader: true
    },
    template: '<div style="overflow:scroll;display:block;height:230px;">' + insertContentToTemplate(``) + '</div>'
});
