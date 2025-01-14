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

import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { BreadcrumbItemComponent } from '../components/breadcrumb-item/breadcrumb-item.component';
import { DemoBreadcrumbComponent } from './demo-breadcrumb.component';
import { importProvidersFrom } from '@angular/core';
import { CoreStoryModule } from '../../..';

// https://stackoverflow.com/a/58210459/8820824
type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends () => any ? never : K }[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
type StoryWithoutFunction<T> = NonFunctionProperties<StoryFn<T>>;

/**
 * Copy storybook story
 *
 * @param story story
 * @param annotations annotations
 * @returns a copy of the story
 */
function storybookCopyStory<T>(story: StoryFn<T>, annotations?: StoryWithoutFunction<T>): StoryFn<T> {
    const cloned = story.bind({});
    return Object.assign(cloned, annotations);
}

const meta: Meta = {
    title: 'Core/Breadcrumb',
    component: DemoBreadcrumbComponent,
    decorators: [
        moduleMetadata({
            imports: [BreadcrumbComponent, BreadcrumbItemComponent, MatButtonModule, MatMenuModule, MatIconModule]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
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

export const Breadcrumb: StoryFn = (args) => ({
    props: args
});

export const Compact = storybookCopyStory(Breadcrumb);
Compact.args = {
    compact: true
};

export const WithMenu = storybookCopyStory(Breadcrumb);
WithMenu.args = {
    showBreadcrumbItemWithMenu: true
};
