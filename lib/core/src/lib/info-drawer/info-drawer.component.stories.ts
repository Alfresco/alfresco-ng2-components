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
import { InfoDrawerComponent } from './info-drawer.component';
import { InfoDrawerModule } from './info-drawer.module';
import { mockTabText, mockCardText } from './mock/info-drawer.mock';

export default {
    component: InfoDrawerComponent,
    title: 'Core/Info Drawer/Info Drawer',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, InfoDrawerModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Displays a sidebar-style information panel in single layout or using tabs.`
            }
        }
    },
    argTypes: {
        selectedIndex: {
            control: 'select',
            options: [0, 1, 2],
            defaultValue: 0,
            description: 'The selected index tab (Tab Layout only)',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '0' }
            }
        },
        title: {
            control: 'text',
            description: 'The title of the info drawer',
            defaultValue: null,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'null' }
            },
            if: { arg: 'showHeader', truthy: true }
        },
        showHeader: {
            control: 'boolean',
            description: 'Visibility of the header',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        showSecondTab: {
            control: 'boolean',
            description: 'Visibility of the second tab (Tab Layout only)',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        showThirdTab: {
            control: 'boolean',
            description: 'Visibility of the third tab (Tab Layout only)',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        label1: {
            control: 'text',
            description: 'Label of the first tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
                category: 'Labels'
            }
        },
        label2: {
            control: 'text',
            description: 'Label of the second tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
                category: 'Labels'
            },
            if: { arg: 'showSecondTab', truthy: true }
        },
        label3: {
            control: 'text',
            description: 'Label of the third tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
                category: 'Labels'
            },
            if: { arg: 'showThirdTab', truthy: true }
        },
        icon1: {
            control: 'text',
            description: 'Icon of the first tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
                category: 'Icons'
            }
        },
        icon2: {
            control: 'text',
            description: 'Icon of the second tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
                category: 'Icons'
            },
            if: { arg: 'showSecondTab', truthy: true }
        },
        icon3: {
            control: 'text',
            description: 'Icon of the third tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
                category: 'Icons'
            },
            if: { arg: 'showThirdTab', truthy: true }
        },
        tab1Text: {
            control: 'text',
            description: 'Text content of the first tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
                category: 'Tab Content'
            }
        },
        tab2Text: {
            control: 'text',
            description: 'Text content of the second tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
                category: 'Tab Content'
            },
            if: { arg: 'showSecondTab', truthy: true }
        },
        tab3Text: {
            control: 'text',
            description: 'Text content of the third tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
                category: 'Tab Content'
            },
            if: { arg: 'showThirdTab', truthy: true }
        },
        cardText: {
            control: 'text',
            description: 'The content of the single card (Single Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        currentTab: {
            action: 'currentTab',
            description: 'Emitted when the currently active tab changes',
            table: {
                type: { summary: 'EventEmitter <number>' },
                category: 'Actions'
            }
        }
    }
} as Meta;

const tabLayoutTemplate: Story<InfoDrawerModule> = (args: InfoDrawerComponent) => ({
    props: args,
    template:
        `<adf-info-drawer title="{{ title }}" [showHeader]="showHeader" (currentTab)="currentTab($event)" selectedIndex="{{ selectedIndex }}">
            <div info-drawer-buttons>
                <mat-icon>clear</mat-icon>
            </div>

            <adf-info-drawer-tab [label]="label1" [icon]="[icon1]">
                <div class="info-drawer-tab-text">{{ tab1Text }}</div>
            </adf-info-drawer-tab>

            <adf-info-drawer-tab [label]="label2" [icon]="[icon2]" *ngIf="showSecondTab">
                <div class="info-drawer-tab-text">{{ tab2Text }}</div>
            </adf-info-drawer-tab>

            <adf-info-drawer-tab [label]="label3" [icon]="[icon3]" *ngIf="showThirdTab">
                <div class="info-drawer-tab-text">{{ tab3Text }}</div>
            </adf-info-drawer-tab>

        </adf-info-drawer>`
});

const singleLayoutTemplate: Story<InfoDrawerModule> = (args: InfoDrawerComponent) => ({
    props: args,
    template:
        `<adf-info-drawer title="{{ title }}" [showHeader]="showHeader">
            <div info-drawer-title>File info</div>

            <div info-drawer-buttons>
                <mat-icon>clear</mat-icon>
            </div>

            <div info-drawer-content>
                <mat-card>
                    {{ cardText }}
                </mat-card>
            </div>
        </adf-info-drawer>`
});

export const tabLayoutWithTextLabels = tabLayoutTemplate.bind({});
tabLayoutWithTextLabels.args = {
    title: 'Activities',
    label1: 'Activity',
    label2: 'Details',
    label3: 'More Info',
    tab1Text: `This is a variant of the Info Drawer Layout component that displays information in tabs. ${mockTabText}`,
    tab2Text: mockTabText,
    tab3Text: mockTabText
};

tabLayoutWithTextLabels.parameters = {
    controls: { exclude: ['cardText'] }
};

export const tabLayoutWithIconLabels = tabLayoutTemplate.bind({});
tabLayoutWithIconLabels.args = {
    title: 'Activities',
    icon1: 'people',
    icon2: 'android',
    icon3: 'comment',
    tab1Text: `This is a variant of the Info Drawer Layout component that displays information in tabs. ${mockTabText}`,
    tab2Text: mockTabText,
    tab3Text: mockTabText
};

tabLayoutWithIconLabels.parameters = {
    controls: { exclude: ['cardText'] }
};

export const singleLayout = singleLayoutTemplate.bind({});
singleLayout.args = {
    title: 'Single Activities',
    cardText: mockCardText,
    showHeader: true,
    showSecondTab: false,
    showThirdTab: false
};
