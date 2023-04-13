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
import { HeaderLayoutComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';

export default {
    component: HeaderLayoutComponent,
    title: 'Core/Layout/Header',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, SidenavLayoutModule, RouterTestingModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `This component displays a customizable header for Alfresco applications that can be reused.
                 Use the input properties to configure the left side (title, button) and the primary color of the header.
                 The right part of the header can contain other components which are transcluded in the header component.`
            }
        }
    },
    argTypes: {
        color: {
            control: 'radio',
            options: ['primary', 'accent', 'warn', undefined],
            defaultValue: undefined,
            description: `Background color for the header.
                It can be any hex color code or one of the Material theme colors: 'primary', 'accent' or 'warn'`,
            table: {
                type: { summary: 'ThemePalette' },
                defaultValue: { summary: 'undefined' }
            }
        },
        expandedSidenav: {
            control: 'boolean',
            description: 'Toggles the expanded state of the component',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        showSidenavToggle: {
            control: 'boolean',
            description: 'Toggles whether the sidenav button will be displayed in the header or not',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        logo: {
            control: 'text',
            description: 'Path to an image file for the application logo',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        title: {
            control: 'text',
            description: 'Title of the application',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        tooltip: {
            control: 'text',
            description: 'The tooltip text for the application logo',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        position: {
            control: 'radio',
            options: ['start', 'end'],
            description: `The side of the page that the drawer is attached to (can be 'start' or 'end')`,
            defaultValue: 'start',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'start' }
            }
        },
        redirectUrl: {
            control: 'text',
            description: 'The router link for the application logo, when clicked',
            defaultValue: '/',
            table: {
                type: { summary: 'string | any[]' },
                defaultValue: { summary: '/' }
            }
        },
        clicked: {
            action: 'clicked',
            description: 'Emitted when the sidenav button is clicked',
            table: {
                type: { summary: 'EventEmitter <boolean>' },
                category: 'Actions'
            }
        }
    }
} as Meta;

const template: Story<SidenavLayoutModule> = (args: HeaderLayoutComponent) => ({
    props: args
});

export const header = template.bind({});
header.args = {
    title: 'Hello from Header!',
    tooltip: 'Default Tooltip text'
};
