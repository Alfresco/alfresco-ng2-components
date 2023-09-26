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
import { CoreStoryModule } from '../../testing/core.story.module';
import { EditJsonDialogModule } from './edit-json.dialog.module';
import { EditJsonDialogStorybookComponent } from './edit-json.dialog.stories.component';
import { MatButtonModule } from '@angular/material/button';

const jsonData = {
    maxValue: 50,
    minValue: 10,
    values: [10, 15, 14, 27, 35, 23, 49, 38],
    measurementId: 'm_10001',
    researcherId: 's_10002'
};

export default {
    component: EditJsonDialogStorybookComponent,
    title: 'Core/Dialog/Edit JSON Dialog',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, EditJsonDialogModule, MatButtonModule]
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

const template: Story<EditJsonDialogStorybookComponent> = (args: EditJsonDialogStorybookComponent) => ({
    props: args
});

export const editJSONDialog = template.bind({});
editJSONDialog.parameters = { layout: 'centered' };
