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
import { ButtonsMenuComponent } from './buttons-menu.component';
import { ButtonsMenuModule } from './buttons-menu.module';
import { MatIconModule } from '@angular/material/icon';

export default {
    component: ButtonsMenuComponent,
    title: 'Core/Components/ButtonsMenu',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, ButtonsMenuModule, MatIconModule]
        })
    ]
} as Meta;

export const sixButtons: Story = args => ({
    props: { ...args, isMenuEmpty: false },
    template: `
    <adf-buttons-action-menu>
        <button mat-menu-item>
            <mat-icon>settings</mat-icon><span> Button </span>
        </button>
        <button mat-menu-item>
            <mat-icon>settings</mat-icon><span> Button </span>
        </button>
        <button mat-menu-item>
            <mat-icon>settings</mat-icon><span> Button </span>
        </button>
        <button mat-menu-item>
            <mat-icon>settings</mat-icon><span> Button </span>
        </button>
        <button mat-menu-item>
            <mat-icon>settings</mat-icon><span> Button </span>
        </button>
        <button mat-menu-item>
            <mat-icon>settings</mat-icon><span> Button </span>
        </button>
    </adf-buttons-action-menu>
`
});

export const oneButton: Story = args => ({
    props: { ...args, isMenuEmpty: false },
    template: `
    <adf-buttons-action-menu>
        <button mat-menu-item>
            <mat-icon>settings</mat-icon><span> Button </span>
        </button>
    </adf-buttons-action-menu>
`
});

export const zeroButtons: Story = args => ({
    props: { ...args, isMenuEmpty: true },
    template: `
    <adf-buttons-action-menu></adf-buttons-action-menu>`
});
