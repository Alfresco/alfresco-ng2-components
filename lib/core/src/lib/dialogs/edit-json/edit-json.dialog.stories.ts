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
import { CoreStoryModule } from '../../testing/core.story.module';
import { DialogModule } from '../dialog.module';
import { EditJsonDialogComponent } from './edit-json.dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

const jsonData = {
    maxValue: 50,
    minValue: 10,
    values: [10, 15, 14, 27, 35, 23, 49, 38],
    measurementId: 'm_10001',
    researcherId: 's_10002'
};

export default {
    component: EditJsonDialogComponent,
    title: 'Core/Dialog/Edit JSON Dialog',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, DialogModule]
        })
    ],
    argTypes: {
        value: {
            description: 'Displayed text',
            control: {
                type: 'object'
            },
            defaultValue: jsonData,
            table: {
                category: 'Provider settings',
                type: {
                    summary: 'string'
                },
                defaultValue: {
                    summary: ''
                }
            }
        },
        editable: {
            description: 'Defines if component is editable',
            control: {
                type: 'boolean'
            },
            defaultValue: false,
            table: {
                category: 'Provider settings',
                type: {
                    summary: 'boolean'
                },
                defaultValue: {
                    summary: false
                }
            }
        },
        title: {
            control: {
                type: 'text'
            },
            defaultValue: 'JSON Dialog Title',
            table: {
                category: 'Provider settings',
                type: {
                    summary: 'string'
                },
                defaultValue: {
                    summary: 'JSON'
                }
            }
        }
    }
} as Meta;

const obj = {
    editable: false,
    value: JSON.stringify(jsonData, null, '  '),
    title: 'JSON Dialog Title'
};

const template: Story = (args) => {
    obj.editable = args.editable;
    obj.value = JSON.stringify(args.value, null, '  ');
    obj.title = args.title;

    const templateStory = {
        props: args
    };
    return templateStory;
};

export const editJSONStory = template.bind({});
editJSONStory.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: MAT_DIALOG_DATA,
                useValue: obj
            }
        ]
    })
];
