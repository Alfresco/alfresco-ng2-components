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
import { DataColumnComponent } from './data-column.component';
import { DATATABLE_DIRECTIVES } from '../datatable.module';
import { CoreStoryModule } from '../../testing/core.story.module';
import * as mockData from '../../mock/data-column.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { DataRow } from '../index';
import { importProvidersFrom } from '@angular/core';

export default {
    component: DataColumnComponent,
    title: 'Core/Data Column/Data Column',
    decorators: [
        moduleMetadata({
            imports: [...DATATABLE_DIRECTIVES, RouterTestingModule]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
        })
    ],
    argTypes: {
        copyContent: {
            description: 'Enables/disables a Clipboard directive to allow copying of cell contents.',
            control: { type: 'boolean' },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'boolean'
                }
            }
        },
        cssClass: {
            description: 'Additional CSS class to be applied to column (header and cells).',
            control: { type: 'text' },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                }
            }
        },
        customData: {
            description: 'You can specify any custom data which can be used by any specific feature',
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
        resizable: {
            description: 'Toggles resize for column.',
            control: { type: 'boolean' },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'boolean'
                },
                defaultValue: {
                    summary: 'true'
                }
            }
        },
        editable: {
            description: 'Toggles the editing support of the column data.',
            control: { type: 'boolean', disable: true },
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
        focus: {
            description: 'Enable or disable cell focus',
            control: { disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'boolean'
                },
                defaultValue: {
                    summary: 'true'
                }
            }
        },
        format: {
            description: 'Used for location type. Setups root path for router navigation.',
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
            description: 'Data source key. Can be either a column/property key like title or a property path like `createdBy.name`.',
            control: { type: 'text', disable: false },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                }
            }
        },
        sortable: {
            description: 'Toggles ability to sort by this column, for example by clicking the column header.',
            control: { type: 'boolean' },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'boolean'
                },
                defaultValue: {
                    summary: 'true'
                }
            }
        },
        sortingKey: {
            description: 'When using server side sorting the column used by the api call where the sorting will be performed',
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
        title: {
            description:
                'Display title of the column, typically used for column headers. You can use the i18n resource key to get it translated automatically.',
            control: { type: 'text' },
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
            options: ['text', 'icon', 'image', 'date', 'fileSize', 'location', 'boolean', 'amount', 'number', 'json'],
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'DataColumnType'
                },
                defaultValue: {
                    summary: 'text'
                }
            }
        },
        currencyConfig: {
            description: `The currencyConfig input allows you to customize the formatting and display of currency values within the component.`,
            control: { type: 'object', disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'CurrencyConfig'
                },
                defaultValue: {
                    summary: `{ code: 'USD', display: 'symbol' }`
                }
            }
        },
        decimalConfig: {
            description: `The decimalConfig input allows you to customize the formatting and display of decimal values within the component.`,
            control: { type: 'object', disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'DecimalConfig'
                },
                defaultValue: {
                    summary: `{ /* empty */ }`
                }
            }
        },
        dateConfig: {
            description: `The dateConfig input allows you to configure date formatting and localization for a component.`,
            control: { type: 'object', disable: true },
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'DateConfig'
                },
                defaultValue: {
                    summary: `{ format: 'medium', tooltipFormat: 'medium' }`
                }
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
    },
    args: {
        copyContent: false,
        cssClass: '',
        customData: { /* empty */ },
        draggable: false,
        editable: false,
        focus: true,
        format: '',
        formatTooltip: null,
        id: '',
        isHidden: false,
        key: '',
        sortable: true,
        sortingKey: '',
        srTitle: '',
        title: '',
        type: 'text',
        currencyConfig: {
            code: 'USD',
            display: 'symbol',
            digitsInfo: undefined,
            locale: undefined
        },
        decimalConfig: {
            digitsInfo: '2.4-5',
            locale: undefined
        },
        dateConfig: {
            format: 'medium',
            tooltipFormat: 'medium',
            locale: undefined
        }
    }
} as Meta<DataColumnComponent>;

const formatCustomTooltip = (row: DataRow): string => (row ? 'This is ' + row.getValue('firstname') : null);

const template: StoryFn<DataColumnComponent> = (args: DataColumnComponent & { rows: DataRow[] }) => ({
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
export const TextColumn: StoryFn = template.bind({ /* empty */ });
TextColumn.args = {
    rows: mockData.textColumnRows,
    key: 'firstname',
    type: 'text',
    title: 'Text Column'
};

// Text Column With Custom Tooltip
export const TextColumnWithCustomTooltip: StoryFn = template.bind({ /* empty */ });
TextColumnWithCustomTooltip.argTypes = {
    formatTooltip: { control: { disable: false } }
};
TextColumnWithCustomTooltip.args = {
    rows: mockData.textColumnRows,
    key: 'firstname',
    type: 'text',
    title: 'Custom Tooltip Column',
    formatTooltip: formatCustomTooltip
};

// Icon Column
export const IconColumn: StoryFn = template.bind({ /* empty */ });
IconColumn.argTypes = {
    copyContent: { control: { disable: true } }
};
IconColumn.args = {
    rows: mockData.iconColumnRows,
    key: 'icon',
    type: 'icon',
    title: 'Icon Column'
};

// Image Column
export const ImageColumn: StoryFn = template.bind({ /* empty */ });
ImageColumn.argTypes = {
    copyContent: { control: { disable: true } }
};
ImageColumn.args = {
    rows: mockData.imageColumnRows,
    key: 'image',
    type: 'image',
    title: 'Image Column'
};

// Date Column
export const DateColumn: StoryFn = template.bind({ /* empty */ });
DateColumn.argTypes = {
    copyContent: { control: { disable: true } },
    dateConfig: { control: { disable: false } }
};
DateColumn.args = {
    rows: mockData.dateColumnRows,
    key: 'createdOn',
    type: 'date',
    title: 'Date Column'
};

// Date Column Time Ago
export const DateColumnTimeAgo: StoryFn = template.bind({ /* empty */ });
DateColumnTimeAgo.argTypes = {
    copyContent: { control: { disable: true } },
    dateConfig: { control: { disable: false } }
};
DateColumnTimeAgo.args = {
    rows: mockData.dateColumnTimeAgoRows,
    key: 'modifiedOn',
    type: 'date',
    title: 'Date Column Time Ago',
    dateConfig: { format: 'timeAgo' }
};

// File Size Column
export const FileSizeColumn: StoryFn = template.bind({ /* empty */ });
FileSizeColumn.argTypes = {
    copyContent: { control: { disable: true } }
};
FileSizeColumn.args = {
    rows: mockData.fileSizeColumnRows,
    key: 'size',
    type: 'fileSize',
    title: 'File Size Column'
};

// Location Column
export const LocationColumn: StoryFn = template.bind({ /* empty */ });
LocationColumn.argTypes = {
    copyContent: { control: { disable: true } },
    format: { control: { disable: false } },
    sortable: { control: { disable: true } }
};
LocationColumn.args = {
    rows: mockData.locationColumnRows,
    format: '/files',
    key: 'path',
    type: 'location',
    title: 'Location Column'
};

// Boolean Column
export const BooleanColumn: StoryFn = template.bind({ /* empty */ });
BooleanColumn.argTypes = {
    copyContent: { control: { disable: true } }
};
BooleanColumn.args = {
    rows: mockData.booleanColumnRows,
    key: 'bool',
    type: 'boolean',
    title: 'Boolean Column'
};

// Json Column
export const JsonColumn: StoryFn = template.bind({ /* empty */ });
JsonColumn.argTypes = {
    editable: { control: { disable: false } },
    copyContent: { control: { disable: true } }
};
JsonColumn.args = {
    rows: mockData.jsonColumnRows,
    key: 'rowInfo',
    type: 'json',
    title: 'JSON Column'
};

// Amount Column
export const AmountColumn: StoryFn = template.bind({ /* empty */ });
AmountColumn.argTypes = {
    copyContent: { control: { disable: true } },
    currencyConfig: { control: { disable: false } }
};
AmountColumn.args = {
    rows: mockData.amountColumnRows,
    key: 'price',
    type: 'amount',
    title: 'Amount Column'
};

// Number Column
export const NumberColumn: StoryFn = template.bind({ /* empty */ });
NumberColumn.argTypes = {
    decimalConfig: { control: { disable: false } },
    copyContent: { control: { disable: true } }
};
NumberColumn.args = {
    rows: mockData.amountColumnRows,
    key: 'price',
    type: 'number',
    title: 'Number Column'
};
