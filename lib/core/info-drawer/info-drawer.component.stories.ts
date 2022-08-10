/*!
* @license
* Copyright 2022 Alfresco Software, Ltd.
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
import { action } from '@storybook/addon-actions';
import { CoreStoryModule } from '../testing/core.story.module';
import { InfoDrawerComponent } from './info-drawer.component';
import { InfoDrawerModule } from './info-drawer.module';

export default {
    component: InfoDrawerComponent,
    title: 'Core/Info Drawer/Info Drawer',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, InfoDrawerModule]
        })
    ],
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
            }
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
                defaultValue: { summary: 'undefined' }
            }
        },
        label2: {
            control: 'text',
            description: 'Label of the second tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        label3: {
            control: 'text',
            description: 'Label of the third tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        icon1: {
            control: 'text',
            description: 'Icon of the first tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        icon2: {
            control: 'text',
            description: 'Icon of the second tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        icon3: {
            control: 'text',
            description: 'Icon of the third tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        tab1Text: {
            control: 'text',
            description: 'Text content of the first tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        tab2Text: {
            control: 'text',
            description: 'Text content of the second tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        tab3Text: {
            control: 'text',
            description: 'Text content of the third tab (Tab Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        cardText: {
            control: 'text',
            description: 'The content of the single card (Single Layout only)',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        }
    }
} as Meta;

const tabLayoutTemplate: Story<InfoDrawerModule> = (args: InfoDrawerComponent) => ({
    props: {
        ...args,
        currentTab: action('currentTab')
    },
    template:
        `<adf-info-drawer title="Activities" [showHeader]="showHeader" (currentTab)="currentTab($event)">
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
        `<adf-info-drawer title="Single Activities" [showHeader]="showHeader">
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
    showSecondTab: true,
    showThirdTab: true,
    label1: 'Activity',
    label2: 'Details',
    label3: 'More Info',
    tab1Text: `This is a variant of the Info Drawer Layout component that displays information in tabs. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam urna odio, sagittis vel nulla vel, condimentum egestas dolor.
    Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris eu hendrerit lectus. Aliquam et ex imperdiet, sodales tellus finibus, malesuada eros. Vestibulum aliquet eros sed diam euismod tincidunt.
    Pellentesque euismod, augue at blandit dapibus, ex nunc viverra nisl, non laoreet nibh odio in libero. Quisque facilisis, dui luctus fringilla lacinia, dui enim accumsan diam, a vehicula mi nulla quis dolor.
    Maecenas non neque sed nulla tincidunt vehicula.`,

    tab2Text: `Suspendisse euismod egestas nisi, non ullamcorper orci scelerisque id. Vestibulum mollis ex imperdiet nisl viverra egestas. Nunc commodo, mi elementum auctor bibendum, neque tortor tincidunt justo, eget gravida eros.
    Vestibulum nec dui ac ipsum posuere ullamcorper. Nullam ultrices eget tellus ut gravida. Aliquam ullamcorper tellus ac dui vehicula venenatis. Maecenas ante ipsum, vestibulum sit amet fringilla a, fringilla quis leo.
    Sed nisl nisi, lacinia ac ullamcorper non, tincidunt at massa. Sed at metus fermentum augue eleifend porta. Sed nec dui ut quam facilisis cursus at et eros.
    Nulla quis diam vitae odio faucibus faucibus ac ac erat. Sed vehicula est eu congue pretium.
    Donec quis nisi ligula. Donec pellentesque nibh nec scelerisque placerat. Nulla facilisi. Sed egestas nisi at risus iaculis faucibus. Nulla facilisi. Aliquam ac tincidunt justo, sit amet aliquet libero.`,

    tab3Text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus saepe labore laboriosam nam! Natus nulla harum, accusamus voluptas rem, autem vitae, aliquam incidunt ad quibusdam iste sunt dignissimos enim.
    Commodi deleniti sint reprehenderit ipsa quisquam explicabo mollitia itaque tenetur, quo labore. At aliquid sunt quam! Necessitatibus nemo cumque, excepturi earum sed ipsam rem nostrum dignissimos veritatis recusandae eaque?
    Assumenda nostrum perferendis vero officiis aliquid possimus molestias quisquam quasi ea eveniet, a, distinctio at cupiditate aliquam dolore?
    Nesciunt similique iure nihil, inventore perferendis reiciendis minima architecto, qui vel amet autem rem sequi exercitationem? Praesentium error odit provident rerum voluptatibus?`
};

export const tabLayoutWithIconLabels = tabLayoutTemplate.bind({});
tabLayoutWithIconLabels.args = {
    title: 'Activities',
    showSecondTab: true,
    showThirdTab: true,
    icon1: 'people',
    icon2: 'android',
    icon3: 'comment',
    tab1Text: `This is a variant of the Info Drawer Layout component that displays information in tabs. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam urna odio, sagittis vel nulla vel, condimentum egestas dolor.
    Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris eu hendrerit lectus. Aliquam et ex imperdiet, sodales tellus finibus, malesuada eros. Vestibulum aliquet eros sed diam euismod tincidunt.
    Pellentesque euismod, augue at blandit dapibus, ex nunc viverra nisl, non laoreet nibh odio in libero. Quisque facilisis, dui luctus fringilla lacinia, dui enim accumsan diam, a vehicula mi nulla quis dolor.
    Maecenas non neque sed nulla tincidunt vehicula.`,

    tab2Text: `Suspendisse euismod egestas nisi, non ullamcorper orci scelerisque id. Vestibulum mollis ex imperdiet nisl viverra egestas. Nunc commodo, mi elementum auctor bibendum, neque tortor tincidunt justo, eget gravida eros.
    Vestibulum nec dui ac ipsum posuere ullamcorper. Nullam ultrices eget tellus ut gravida. Aliquam ullamcorper tellus ac dui vehicula venenatis. Maecenas ante ipsum, vestibulum sit amet fringilla a, fringilla quis leo.
    Sed nisl nisi, lacinia ac ullamcorper non, tincidunt at massa. Sed at metus fermentum augue eleifend porta. Sed nec dui ut quam facilisis cursus at et eros.
    Nulla quis diam vitae odio faucibus faucibus ac ac erat. Sed vehicula est eu congue pretium.
    Donec quis nisi ligula. Donec pellentesque nibh nec scelerisque placerat. Nulla facilisi. Sed egestas nisi at risus iaculis faucibus. Nulla facilisi. Aliquam ac tincidunt justo, sit amet aliquet libero.`,

    tab3Text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus saepe labore laboriosam nam! Natus nulla harum, accusamus voluptas rem, autem vitae, aliquam incidunt ad quibusdam iste sunt dignissimos enim.
    Commodi deleniti sint reprehenderit ipsa quisquam explicabo mollitia itaque tenetur, quo labore. At aliquid sunt quam! Necessitatibus nemo cumque, excepturi earum sed ipsam rem nostrum dignissimos veritatis recusandae eaque?
    Assumenda nostrum perferendis vero officiis aliquid possimus molestias quisquam quasi ea eveniet, a, distinctio at cupiditate aliquam dolore?
    Nesciunt similique iure nihil, inventore perferendis reiciendis minima architecto, qui vel amet autem rem sequi exercitationem? Praesentium error odit provident rerum voluptatibus?`
};

export const singleLayout = singleLayoutTemplate.bind({});
singleLayout.args = {
    title: 'Single Activities',
    cardText: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus saepe labore laboriosam nam! Natus nulla harum, accusamus voluptas rem, autem vitae, aliquam incidunt ad quibusdam iste sunt dignissimos enim.
    Commodi deleniti sint reprehenderit ipsa quisquam explicabo mollitia itaque tenetur, quo labore. At aliquid sunt quam! Necessitatibus nemo cumque, excepturi earum sed ipsam rem nostrum dignissimos veritatis recusandae eaque?
    Assumenda nostrum perferendis vero officiis aliquid possimus molestias quisquam quasi ea eveniet, a, distinctio at cupiditate aliquam dolore?
    Nesciunt similique iure nihil, inventore perferendis reiciendis minima architecto, qui vel amet autem rem sequi exercitationem? Praesentium error odit provident rerum voluptatibus?`
};

singleLayout.parameters = {
    controls: { include: ['cardText', 'showHeader', 'title'] }
};
