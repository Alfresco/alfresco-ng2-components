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
import { CoreStoryModule } from '../testing/core.story.module';
import { ToolbarComponent } from './toolbar.component';
import { TOOLBAR_DIRECTIVES } from './toolbar.module';
import { importProvidersFrom } from '@angular/core';

export default {
    component: ToolbarComponent,
    title: 'Core/Toolbar/Toolbar',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, ...TOOLBAR_DIRECTIVES]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
        })
    ],
    argTypes: {
        color: {
            control: 'radio',
            options: ['primary', 'accent', 'warn', undefined],
            description: 'Toolbar color.',
            table: {
                type: { summary: 'ThemePalette' },
                defaultValue: { summary: 'undefined' }
            }
        },
        title: {
            control: 'text',
            description: 'Toolbar title.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        toolbarTitle: {
            name: 'with adf-toolbar-title component',
            control: 'boolean',
            description: 'Showcase content projection with <span style="color:red">adf-toolbar-title</span> component',
            table: {
                category: 'Content Projection',
                type: {
                    summary: 'code',
                    detail: '<adf-toolbar-title>Projected Title</adf-toolbar-title>'
                },
                defaultValue: { summary: 'false' }
            }
        },
        toolbarDivider: {
            name: 'with adf-toolbar-divider component',
            control: 'boolean',
            description: 'Showcase content projection with <span style="color:red">adf-toolbar-divider</span> component',
            table: {
                category: 'Content Projection',
                type: {
                    summary: 'code',
                    detail: 'left<adf-toolbar-divider></adf-toolbar-divider>right'
                },
                defaultValue: { summary: 'false' }
            }
        },
        anyContentProjection: {
            name: 'with any component / selector',
            control: 'boolean',
            description: 'Showcase content projection with any component / selector',
            table: {
                category: 'Content Projection',
                type: {
                    summary: 'code',
                    detail: '<span style="color:red">projected content</span>'
                },
                defaultValue: { summary: 'false' }
            }
        }
    },
    args: {
        title: '',
        toolbarTitle: false,
        toolbarDivider: false,
        anyContentProjection: false
    }
} as Meta<ToolbarComponent>;

const template: StoryFn<ToolbarComponent> = (
    args: ToolbarComponent & { anyContentProjection: boolean } & { toolbarDivider: boolean } & { toolbarTitle: boolean }
) => ({
    props: args,
    template: `
    <adf-toolbar color="${args.color}" title="${args.title}">
        <ng-container *ngIf="${args.toolbarTitle}"><adf-toolbar-title>Projected Title</adf-toolbar-title></ng-container>
        <ng-container *ngIf="${args.anyContentProjection}">
            <span style="color:red">projected content</span>
        </ng-container>
        <ng-container *ngIf="${args.toolbarDivider}">left<adf-toolbar-divider></adf-toolbar-divider>right</ng-container>
    </adf-toolbar>`
});

export const Toolbar = template.bind({});
