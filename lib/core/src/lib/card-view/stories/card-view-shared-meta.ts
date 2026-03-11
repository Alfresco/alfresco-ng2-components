/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { applicationConfig, moduleMetadata, Decorator, type ArgTypes } from '@storybook/angular';
import { CARD_VIEW_DIRECTIVES } from '../public-api';
import { provideStoryCore } from '../../stories/core-story.providers';

/**
 * Common decorators used across all Card View component stories.
 * Includes module metadata with Card View directives and application config with core providers.
 */
export const cardViewDecorators: Decorator[] = [
    moduleMetadata({
        imports: [...CARD_VIEW_DIRECTIVES]
    }),
    applicationConfig({
        providers: [...provideStoryCore()]
    })
];

/**
 * Common argTypes definitions shared across Card View component stories.
 * These can be spread into component-specific meta configurations.
 */
export const cardViewArgTypes: ArgTypes = {
    editable: {
        control: 'boolean',
        description: 'Defines if CardView item is editable',
        table: {
            type: { summary: 'boolean' },
            defaultValue: { summary: 'false' }
        }
    },
    displayEmpty: {
        control: 'boolean',
        description: 'Defines if it should display CardView item when data is empty',
        table: {
            type: { summary: 'boolean' },
            defaultValue: { summary: 'true' }
        }
    },
    displayNoneOption: {
        control: 'boolean',
        description: 'Shows None option inside select element',
        table: {
            type: { summary: 'boolean' },
            defaultValue: { summary: 'true' }
        }
    },
    displayClearAction: {
        control: 'boolean',
        description: 'Defines if it should display clear input action (only with SingleValued components)',
        table: {
            type: { summary: 'boolean' },
            defaultValue: { summary: 'true' }
        }
    },
    copyToClipboardAction: {
        control: 'boolean',
        description: 'Copy to clipboard action - default template in editable mode',
        table: {
            type: { summary: 'boolean' },
            defaultValue: { summary: 'true' }
        }
    },
    useChipsForMultiValueProperty: {
        control: 'boolean',
        description: 'Split text for chips using defined separator',
        table: {
            type: { summary: 'boolean' },
            defaultValue: { summary: 'true' }
        }
    },
    multiValueSeparator: {
        control: 'text',
        description: 'Separator used for text splitting',
        table: {
            type: { summary: 'string' },
            defaultValue: { summary: ', ' }
        }
    }
};

/**
 * Common default args shared across Card View component stories.
 */
export const cardViewDefaultArgs: Record<string, unknown> = {
    editable: true,
    displayEmpty: true,
    displayNoneOption: true,
    displayClearAction: true,
    copyToClipboardAction: true,
    useChipsForMultiValueProperty: true,
    multiValueSeparator: ', '
};

/**
 * Shared metadata object that can be spread into component-specific meta configurations.
 * Contains decorators, argTypes, and args commonly used across Card View stories.
 */
export const cardViewSharedMeta: {
    decorators: Decorator[];
    argTypes: ArgTypes;
    args: Record<string, unknown>;
} = {
    decorators: cardViewDecorators,
    argTypes: cardViewArgTypes,
    args: cardViewDefaultArgs
};
