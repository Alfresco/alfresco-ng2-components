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

import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { CoreStoryModule } from '../testing/core.story.module';
import { SortingPickerComponent } from './sorting-picker.component';
import { importProvidersFrom } from '@angular/core';

const initialSortingTypes: Array<{ key: string; label: string }> = [
    { key: 'sortByFirstName', label: 'First Name' },
    { key: 'sortByLastName', label: 'Last Name' },
    { key: 'sortByBirthDate', label: 'Birth Date' }
];

const initialOptionKeys = [...initialSortingTypes.map((type) => type.key.toString())];

export default {
    component: SortingPickerComponent,
    title: 'Core/Sorting Picker/Sorting Picker',
    decorators: [
        moduleMetadata({
            imports: [SortingPickerComponent]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `The picker shows the user a menu of sorting options (which could be data columns to sort on alphabetical vs numerical search, etc)
                    and the choice of ascending vs descending sort order.
                    Note that picker only implements the menu, so you are responsible for implementing the sorting options yourself.`
            }
        }
    },
    argTypes: {
        selected: {
            control: 'select',
            options: initialOptionKeys,
            description: 'Currently selected option key',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        ascending: {
            control: 'boolean',
            description: 'Current sorting direction',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        options: {
            description: 'Available sorting options',
            table: {
                type: { summary: 'Array<{key: string; label: string}>' },
                defaultValue: { summary: '[]' }
            }
        },
        valueChange: {
            action: 'valueChange',
            description: 'Raised each time sorting key gets changed',
            table: {
                type: { summary: 'EventEmitter <string>' },
                category: 'Actions'
            }
        },
        sortingChange: {
            action: 'sortingChange',
            description: 'Raised each time direction gets changed',
            table: {
                type: { summary: 'EventEmitter <boolean>' },
                category: 'Actions'
            }
        }
    },
    args: {
        ascending: true,
        options: []
    }
} as Meta<SortingPickerComponent>;

const template: StoryFn<SortingPickerComponent> = (args) => ({
    props: args
});

export const SortingPicker = template.bind({ /* empty */ });
SortingPicker.args = {
    options: initialSortingTypes
};
SortingPicker.parameters = { layout: 'centered' };
