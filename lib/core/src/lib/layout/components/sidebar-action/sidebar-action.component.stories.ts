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
import { SidenavLayoutModule } from '../../layout.module';
import { SidebarActionMenuComponent } from './sidebar-action-menu.component';

export default {
    component: SidebarActionMenuComponent,
    title: 'Core/Layout/Sidebar Action Menu',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, SidenavLayoutModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Displays a sidebar-action menu information panel.`
            }
        }
    },
    argTypes: {
        expanded: {
            control: 'boolean',
            description: 'Toggle the sidebar action menu on expand',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        title: {
            control: 'text',
            description: 'The title of the sidebar action',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        width: {
            control: 'number',
            description: 'Width in pixels for sidebar action menu options',
            defaultValue: 272,
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '272' }
            }
        }
    }
} as Meta;

const template: Story<SidenavLayoutModule> = (args: SidebarActionMenuComponent) => ({
    props: args
});

export const sidebarActionMenu = template.bind({});
sidebarActionMenu.args = {
    title: 'Hello from Sidebar Action Menu!'
};
