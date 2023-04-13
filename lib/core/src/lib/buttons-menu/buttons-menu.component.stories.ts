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
import { CoreStoryModule } from '../testing/core.story.module';
import { ButtonsMenuComponent } from './buttons-menu.component';
import { ButtonsMenuModule } from './buttons-menu.module';

export default {
    component: ButtonsMenuComponent,
    title: 'Core/Buttons Menu/Buttons Menu',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, ButtonsMenuModule]
        })
    ],
    argTypes: {
        mobile: {
            type: { name: 'boolean' },
            name: 'isMobile',
            description:
                'Determines whether it is displayed on a mobile device',
            defaultValue: true,
            control: {
                disable: false
            },
            table: {
                category: 'Component methods',
                type: {
                    summary: '() => boolean'
                }
            }
        },
        isMenuEmpty: {
            description: 'Determines whether it has anything to display',
            table: {
                category: 'Component properties',
                type: {
                    summary: 'boolean'
                }
            }
        }
    }
} as Meta;

export const sixButtons: Story = args => ({
    props: {
        ...args,
        isMenuEmpty: false,
        isMobile() {
            return args.mobile;
        }
    },
    template: `
    <adf-buttons-action-menu>
        <button mat-menu-item>
            <mat-icon>settings</mat-icon><span> Settings </span>
        </button>
        <button mat-menu-item>
            <mat-icon>home</mat-icon><span> Home </span>
        </button>
        <button mat-menu-item>
            <mat-icon>search</mat-icon><span> Search </span>
        </button>
        <button mat-menu-item>
            <mat-icon>done</mat-icon><span> Done </span>
        </button>
        <button mat-menu-item>
            <mat-icon>delete</mat-icon><span> Delete </span>
        </button>
        <button mat-menu-item>
            <mat-icon>block</mat-icon><span> Block </span>
        </button>
    </adf-buttons-action-menu>
`
});

export const oneButton: Story = args => ({
    props: {
        ...args,
        isMenuEmpty: false,
        isMobile() {
            return args.mobile;
        }
    },
    template: `
    <adf-buttons-action-menu>
        <button mat-menu-item>
            <mat-icon>settings</mat-icon><span> Settings </span>
        </button>
    </adf-buttons-action-menu>
`
});

export const noButtons: Story = args => ({
    props: {
        ...args,
        isMenuEmpty: true,
        isMobile() {
            return args.mobile;
        }
    },
    template: `
    <adf-buttons-action-menu></adf-buttons-action-menu>`
});
