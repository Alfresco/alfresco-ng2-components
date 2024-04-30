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

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { DataColumnComponent } from './data-column.component';
import { DataTableModule } from '../datatable.module';
import { CoreStoryModule } from '../../testing/core.story.module';
import * as mockData from '../../mock/data-column.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { DataRow } from '../index';

export default {
    component: DataColumnComponent,
    title: 'Core/Data Column/Data Column',
    decorators: [
        moduleMetadata({
            imports: [
                CoreStoryModule,
                DataTableModule,
                RouterTestingModule
            ]
        })
    ],
    argTypes: {
        copyContent: {
            description:
                'Enables/disables a Clipboard directive to allow copying of cell contents.',
            control: { type: 'boolean' },
            defaultValue: false,
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'boolean'
                }
            }
        },
        cssClass: {
            description:
                'Additional CSS class to be applied to column (header and cells).',
            control: { type: 'text' },
            defaultValue: '',
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                }
            }
        },
        customData: {
            description:
                'You can specify any custom data which can be used by any specific feature',
            control: { disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'any'
                }
            }
        },
        draggable: {
            description: 'Toggles drag and drop for header column.',
            control: { type: 'boolean' },
            defaultValue: false,
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'boolean'
                },
                defaultValue: {
                    summary: false
                }
            }
        },
        resizable: {
            description: 'Toggles resize for column.',
            control: { type: 'boolean' },
            defaultValue: true,
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'boolean'
                },
                defaultValue: {
                    summary: true
                }
            }
        },
        editable: {
            description: 'Toggles the editing support of the column data.',
            control: { type: 'boolean', disable: true },
            defaultValue: false,
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'boolean'
                },
                defaultValue: {
                    summary: false
                }
            }
        },
        focus: {
            description: 'Enable or disable cell focus',
            control: { disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'boolean'
                },
                defaultValue: {
                    summary: true
                }
            }
        },
        format: {
            description:
                'Used for location type. Setups root path for router navigation.',
            control: { type: 'text', disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                }
            }
        },
        formatTooltip: {
            description: 'Custom tooltip formatter function.',
            control: { disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'Function'
                }
            }
        },
        id: {
            description: 'Column identifier.',
            control: { disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                },
                defaultValue: {
                    summary: ''
                }
            }
        },
        isHidden: {
            description: 'Hides columns',
            control: { type: 'boolean' },
            defaultValue: false,
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'boolean'
                },
                defaultValue: {
                    summary: 'false'
                }
            }
        },
        key: {
            description:
                'Data source key. Can be either a column/property key like title or a property path like `createdBy.name`.',
            control: { type: 'text', disable: false },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                }
            }
        },
        sortable: {
            description:
                'Toggles ability to sort by this column, for example by clicking the column header.',
            control: { type: 'boolean' },
            defaultValue: true,
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'boolean'
                },
                defaultValue: {
                    summary: true
                }
            }
        },
        sortingKey: {
            description:
                'When using server side sorting the column used by the api call where the sorting will be performed',
            control: { disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                }
            }
        },
        srTitle: {
            description: 'Title to be used for screen readers.',
            control: { type: 'text' },
            defaultValue: '',
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                }
            }
        },
        title: {
            description:
                'Display title of the column, typically used for column headers. You can use the i18n resource key to get it translated automatically.',
            control: { type: 'text' },
            defaultValue: '',
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                },
                defaultValue: {
                    summary: ''
                }
            }
        },
        type: {
            description:
                'Value type for the column. Possible settings are: `text`, `icon`, `image`, `date`, `fileSize`, `location`, `boolean`, `amount`, `number` and `json`.',
            control: { type: 'select', disable: false },
            options: [
                'text',
                'icon',
                'image',
                'date',
                'fileSize',
                'location',
                'boolean',
                'amount',
                'number',
                'json'
            ],
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'DataColumnType'
                },
                defaultValue: {
                    summary: 'text'
                }
            },
            defaultValue: 'text'
        },
        currencyConfig: {
            description:
                `The currencyConfig input allows you to customize the formatting and display of currency values within the component.`,
            control: { type: 'object', disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'CurrencyConfig'
                },
                defaultValue: {
                    summary: `{ code: 'USD', display: 'symbol' }`
                }
            },
            defaultValue: {
                code: 'USD',
                display: 'symbol',
                digitsInfo: undefined,
                locale: undefined
            }
        },
        decimalConfig: {
            description:
                `The decimalConfig input allows you to customize the formatting and display of decimal values within the component.`,
            control: { type: 'object', disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'DecimalConfig'
                },
                defaultValue: {
                    summary: `{}`
                }
            },
            defaultValue: {
                digitsInfo: '2.4-5',
                locale: undefined
            }
        },
        dateConfig: {
            description:
                `The dateConfig input allows you to configure date formatting and localization for a component.`,
            control: { type: 'object', disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'DateConfig'
                },
                defaultValue: {
                    summary: `{ format: 'medium', tooltipFormat: 'medium' }`
                }
            },
            defaultValue: {
                format: 'medium',
                tooltipFormat: 'medium',
                locale: undefined
            }
        },
        rows: {
            description: 'Provides rows for DataTable component',
            control: { disable: false },
            table: {
                category: 'Component data',
                type: {
                    summary: 'array'
                }
            }
        }
    }
} as Meta;

const formatCustomTooltip = (row: DataRow): string =>
    row ? 'This is ' + row.getValue('firstname') : null;

const template: Story<DataColumnComponent> = (args: DataColumnComponent & { rows: DataRow[] }) => ({
    props: args,
    template: `
        <adf-datatable [rows]="rows">
            <data-columns>
                <data-column
                    [key]="key"
                    [type]="type"
                    [title]="title"
                    [editable]="editable"
                    [sortable]="sortable"
                    [draggable]="draggable"
                    [copyContent]="copyContent"
                    [format]="format"
                    [isHidden]="isHidden"
                    [class]="cssClass"
                    [sr-title]="srTitle"
                    [currencyConfig]="currencyConfig"
                    [decimalConfig]="decimalConfig"
                    [dateConfig]="dateConfig"
                    [formatTooltip]="formatTooltip">
                </data-column>
            </data-columns>
        </adf-datatable>
    `
});

// Text Column
export const textColumn: Story = template.bind({});
textColumn.args = {
    rows: mockData.textColumnRows,
    key: 'firstname',
    type: 'text',
    title: 'Text Column'
};

// Text Column With Custom Tooltip
export const textColumnWithCustomTooltip: Story = template.bind({});
textColumnWithCustomTooltip.argTypes = {
    formatTooltip: { control: { disable: false } }
};
textColumnWithCustomTooltip.args = {
    rows: mockData.textColumnRows,
    key: 'firstname',
    type: 'text',
    title: 'Custom Tooltip Column',
    formatTooltip: formatCustomTooltip
};

// Icon Column
export const iconColumn: Story = template.bind({});
iconColumn.argTypes = {
    copyContent: { control: { disable: true } }
};
iconColumn.args = {
    rows: mockData.iconColumnRows,
    key: 'icon',
    type: 'icon',
    title: 'Icon Column'
};

// Image Column
export const imageColumn: Story = template.bind({});
imageColumn.argTypes = {
    copyContent: { control: { disable: true } }
};
imageColumn.args = {
    rows: mockData.imageColumnRows,
    key: 'image',
    type: 'image',
    title: 'Image Column'
};

// Date Column
export const dateColumn: Story = template.bind({});
dateColumn.argTypes = {
    copyContent: { control: { disable: true } },
    dateConfig: { control: { disable: false } }
};
dateColumn.args = {
    rows: mockData.dateColumnRows,
    key: 'createdOn',
    type: 'date',
    title: 'Date Column'
};

// Date Column Time Ago
export const dateColumnTimeAgo: Story = template.bind({});
dateColumnTimeAgo.argTypes = {
    copyContent: { control: { disable: true } },
    dateConfig: { control: { disable: false } }
};
dateColumnTimeAgo.args = {
    rows: mockData.dateColumnTimeAgoRows,
    key: 'modifiedOn',
    type: 'date',
    title: 'Date Column Time Ago',
    dateConfig: { format: 'timeAgo' }
};

// File Size Column
export const fileSizeColumn: Story = template.bind({});
fileSizeColumn.argTypes = {
    copyContent: { control: { disable: true } }
};
fileSizeColumn.args = {
    rows: mockData.fileSizeColumnRows,
    key: 'size',
    type: 'fileSize',
    title: 'File Size Column'
};

// Location Column
export const locationColumn: Story = template.bind({});
locationColumn.argTypes = {
    copyContent: { control: { disable: true } },
    format: { control: { disable: false }},
    sortable: { control: { disable: true }}
};
locationColumn.args = {
    rows: mockData.locationColumnRows,
    format: '/files',
    key: 'path',
    type: 'location',
    title: 'Location Column'
};

// Boolean Column
export const booleanColumn: Story = template.bind({});
booleanColumn.argTypes = {
    copyContent: { control: { disable: true } }
};
booleanColumn.args = {
    rows: mockData.booleanColumnRows,
    key: 'bool',
    type: 'boolean',
    title: 'Boolean Column'
};

// Json Column
export const jsonColumn: Story = template.bind({});
jsonColumn.argTypes = {
    editable: { control: { disable: false } },
    copyContent: { control: { disable: true } }
};
jsonColumn.args = {
    rows: mockData.jsonColumnRows,
    key: 'rowInfo',
    type: 'json',
    title: 'JSON Column'
};

// Amount Column
export const amountColumn: Story = template.bind({});
amountColumn.argTypes = {
    copyContent: { control: { disable: true } },
    currencyConfig: { control: { disable: false } }
};
amountColumn.args = {
    rows: mockData.amountColumnRows,
    key: 'price',
    type: 'amount',
    title: 'Amount Column'
};

// Number Column
export const numberColumn: Story = template.bind({});
numberColumn.argTypes = {
    decimalConfig: { control: { disable: false } },
    copyContent: { control: { disable: true } }
};
numberColumn.args = {
    rows: mockData.amountColumnRows,
    key: 'price',
    type: 'number',
    title: 'Number Column'
};

