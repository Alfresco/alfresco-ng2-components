/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { applicationConfig, Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ContextMenuDirective } from './context-menu.directive';
import { ContextMenuItem } from './interfaces';
import { provideStoryCore } from '../stories/core-story.providers';

interface ContextMenuStoryArgs {
    enabled: boolean;
    menuItemClicked: (menuItem: ContextMenuItem) => void;
}

const createMenuItems = (menuItemClicked: (menuItem: ContextMenuItem) => void): ContextMenuItem[] => [
    {
        model: {
            title: 'Open',
            visible: true,
            disabled: false,
            icon: 'folder_open',
            tooltip: 'Open item'
        },
        subject: {
            next: (menuItem) => menuItemClicked(menuItem)
        }
    },
    {
        model: {
            title: 'Rename',
            visible: true,
            disabled: true,
            icon: 'edit',
            tooltip: 'Unavailable for read-only items'
        },
        subject: {
            next: (menuItem) => menuItemClicked(menuItem)
        }
    },
    {
        model: {
            title: 'Delete',
            visible: true,
            disabled: false,
            icon: 'delete',
            tooltip: 'Delete item'
        },
        subject: {
            next: (menuItem) => menuItemClicked(menuItem)
        }
    },
    {
        model: {
            title: 'Hidden action',
            visible: false,
            disabled: false,
            icon: 'more_horiz'
        },
        subject: {
            next: (menuItem) => menuItemClicked(menuItem)
        }
    }
];

const meta: Meta<ContextMenuStoryArgs> = {
    title: 'Core/Context Menu/Context Menu',
    decorators: [
        moduleMetadata({
            imports: [ContextMenuDirective]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    argTypes: {
        enabled: {
            description: 'Enables or disables the context menu interaction.',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        menuItemClicked: {
            action: 'menuItemClicked',
            description: 'Emitted when a menu item is selected.',
            table: {
                category: 'Actions',
                type: { summary: '(menuItem: ContextMenuItem) => void' }
            }
        }
    },
    args: {
        enabled: true
    },
    parameters: {
        docs: {
            description: {
                component: 'Right-click the target area to open the context menu.'
            }
        }
    }
};

export default meta;
type Story = StoryObj<ContextMenuStoryArgs>;

const getContextMenuTemplate = (): string => `
    <div style="max-width: 520px; margin: 32px auto; font-family: var(--mat-sys-body-medium-font, sans-serif);">
        <p style="margin: 0 0 12px; color: #5b6169;">Right-click inside the area below to open the menu.</p>
        <div
            [adf-context-menu]="links"
            [adf-context-menu-enabled]="enabled"
            style="min-height: 160px; border: 1px dashed #6f7d8c; border-radius: 8px; background: #f8fafc; display: grid; place-items: center; color: #1f2933; user-select: none;"
        >
            Context Menu Target
        </div>
    </div>
`;

export const Default: Story = {
    render: (args) => ({
        props: {
            ...args,
            links: createMenuItems(args.menuItemClicked)
        },
        template: getContextMenuTemplate()
    })
};

export const LinksAsFunction: Story = {
    render: (args) => ({
        props: {
            ...args,
            links: () => createMenuItems(args.menuItemClicked)
        },
        template: getContextMenuTemplate()
    })
};
