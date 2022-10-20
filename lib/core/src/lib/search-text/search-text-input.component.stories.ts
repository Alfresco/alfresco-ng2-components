/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { CoreStoryModule } from '../testing/core.story.module';

import { SearchTextInputComponent } from './search-text-input.component';
import { SearchTextModule } from './search-text-input.module';

export default {
    component: SearchTextInputComponent,
    title: 'Core/Search Text Input/Search Text Input',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, SearchTextModule]
        })
    ],
    argTypes: {
        autocomplete: {
            control: 'boolean',
            description: 'Toggles auto-completion of the search input field.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        expandable: {
            control: 'boolean',
            description: 'Toggles whether to use an expanding search control. If false, a regular input is used.',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        inputType: {
            control: 'radio',
            options: ['date', 'month', 'number', 'search', 'text', 'time'],
            description: 'Type of the input field to render, e.g. "search" or "text" (default).',
            defaultValue: 'text',
            table: {
                category: 'HTML input attributes',
                type: { summary: 'string' },
                defaultValue: { summary: 'text' }
            }
        },
        liveSearchEnabled: {
            control: 'boolean',
            description: 'Toggles "find-as-you-type" suggestions for possible matches.',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        searchAutocomplete: {
            control: 'boolean',
            description: 'Trigger autocomplete results on input change.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        searchTerm: {
            control: 'text',
            description: 'Search term preselected.',
            defaultValue: '',
            table: {
                category: 'HTML input attributes',
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        debounceTime: {
            control: 'number',
            description: 'Debounce time in milliseconds.',
            defaultValue: 0,
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '0' }
            }
        },
        focusListener: {
            control: 'object',
            description: 'Listener for results-list events (focus, blur and focusout).',
            table: {
                type: { summary: 'Observable<FocusEvent>' }
            }
        },
        collapseOnSubmit: {
            control: 'boolean',
            description: 'Collapse search bar on submit.',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        defaultState: {
            control: 'inline-radio',
            options: ['collapsed', 'expanded'],
            description: 'Default state.',
            defaultValue: 'collapsed',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'collapsed' }
            }
        },
        collapseOnBlur: {
            control: 'boolean',
            description: 'Collapse search bar on blur.',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        showClearButton: {
            control: 'boolean',
            description: 'Toggles whether to show a clear button that closes the search.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text to show in the input field.',
            defaultValue: '',
            table: {
                category: 'HTML input attributes',
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        hintLabel: {
            control: 'text',
            description: 'Hint label.',
            defaultValue: '',
            table: {
                category: 'HTML input attributes',
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        searchChange: {
            action: 'searchChange',
            description: 'Emitted when the search term is changed. The search term is provided in the "value" property of the returned object. If the term is less than three characters in length then it is truncated to an empty string.',
            table: { category: 'Actions' }
        },
        submit: {
            action: 'submit',
            description: 'Emitted when the search is submitted by pressing the ENTER key.',
            table: { category: 'Actions' }
        },
        selectResult: {
            action: 'selectResult',
            description: 'Emitted when the result list is selected.',
            table: { category: 'Actions' }
        },
        reset: {
            action: 'reset',
            description: 'Emitted when the result list is reset.',
            table: { category: 'Actions' }
        },
        searchVisibility: {
            action: 'searchVisibility',
            description: 'Emitted when the search visibility changes. True when the search is active, false when it is inactive.',
            table: { category: 'Actions' }
        }
    }
} as Meta;

const template: Story<SearchTextInputComponent> = (args: SearchTextInputComponent) => ({
    props: args
});

export const searchTextInput = template.bind({});
searchTextInput.parameters = { layout: 'centered' };
