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

import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { BreadcrumbItemComponent } from '../components/breadcrumb-item/breadcrumb-item.component';
import { DemoBreadcrumbComponent } from './demo-breadcrumb.component';

const meta: Meta<DemoBreadcrumbComponent> = {
    title: 'Core/Breadcrumb',
    component: DemoBreadcrumbComponent,
    decorators: [
        moduleMetadata({
            imports: [BreadcrumbComponent, BreadcrumbItemComponent, MatButtonModule, MatMenuModule, MatIconModule]
        })
    ],
    args: {
        compact: false,
        showBreadcrumbItemWithMenu: false
    },
    argTypes: {
        compact: { control: 'boolean' },
        showBreadcrumbItemWithMenu: { control: 'boolean' }
    }
};
export default meta;
type Story = StoryObj<DemoBreadcrumbComponent>;

export const Breadcrumb: Story = {
    render: (args) => ({
        props: args
    })
};

export const Compact: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        compact: true
    }
};

export const WithMenu: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        showBreadcrumbItemWithMenu: true
    }
};
