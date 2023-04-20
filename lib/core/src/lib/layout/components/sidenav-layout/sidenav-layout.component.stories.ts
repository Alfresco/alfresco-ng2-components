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
import { SidenavLayoutComponent } from './sidenav-layout.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

export default {
    component: SidenavLayoutComponent,
    title: 'Core/Layout/Sidenav Layout',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, SidenavLayoutModule, RouterTestingModule, MatIconModule, MatListModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Displays the standard three-region ADF application layout.`
            }
        }
    },
    argTypes: {
        expandedSidenav: {
            control: 'boolean',
            description: 'Toggles the expand of navigation region',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' },
                category: 'Navigation'
            }
        },
        hideSidenav: {
            control: 'boolean',
            description: 'Toggles showing/hiding the navigation region',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
                category: 'Navigation'
            }
        },
        position: {
            control: 'radio',
            options: ['start', 'end'],
            description: `The side of the page that the drawer is attached to (can be 'start' or 'end')`,
            defaultValue: 'start',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'start' },
                category: 'Navigation'
            }
        },
        sidenavMax: {
            control: 'number',
            description: 'Maximum size of the navigation region',
            defaultValue: undefined,
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 'undefined' },
                category: 'Navigation'
            }
        },
        sidenavMin: {
            control: 'number',
            description: 'Minimum size of the navigation region',
            defaultValue: undefined,
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 'undefined' },
                category: 'Navigation'
            }
        },
        stepOver: {
            control: 'number',
            description: 'Screen size at which display switches from small screen to large screen configuration',
            defaultValue: undefined,
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 'undefined' }
            }
        },
        title: {
            control: 'text',
            description: 'Title of the application',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
                category: 'Header'
            }
        },
        color: {
            control: 'radio',
            options: ['primary', 'accent', 'warn', undefined],
            defaultValue: undefined,
            description: `Background color for the header.
                It can be any hex color code or one of the Material theme colors: 'primary', 'accent' or 'warn'`,
            table: {
                type: { summary: 'ThemePalette' },
                defaultValue: { summary: 'undefined' },
                category: 'Header'
            }
        },
        clicked: {
            action: 'expanded',
            description: 'Emitted when the menu toggle and the collapsed/expanded state of the sideNav changes',
            table: {
                type: { summary: 'EventEmitter <boolean>' },
                category: 'Actions'
            }
        }
    }
} as Meta;

const template: Story<SidenavLayoutModule> = (args: SidenavLayoutComponent) => ({
    props: args,
    template: `
    <adf-sidenav-layout
        [sidenavMin]="sidenavMin"
        [sidenavMax]="sidenavMax"
        [stepOver]="stepOver"
        [position]="position"
        [hideSidenav]="hideSidenav"
        [expandedSidenav]="expandedSidenav"
        >
        <div class="adf-sidenav-layout-full-space">
            <adf-sidenav-layout-header>
                <ng-template>
                    <adf-layout-header [title]="title" [color]="color"></adf-layout-header>
                </ng-template>
            </adf-sidenav-layout-header>

            <adf-sidenav-layout-navigation>
                <ng-template>
                    <mat-nav-list class="app-sidenav-linklist">
                        <mat-list-item class="app-sidenav-link">
                            <mat-icon matListIcon>home</mat-icon>
                            <span matLine>Home</span>
                        </mat-list-item>

                        <mat-list-item class="app-sidenav-link">
                            <mat-icon matListIcon>device_hub</mat-icon>
                            <span matLine>Content Processes</span>
                        </mat-list-item>

                        <mat-list-item class="app-sidenav-link">
                            <mat-icon matListIcon>folder_open</mat-icon>
                            <span matLine>Files</span>
                        </mat-list-item>

                        <mat-list-item class="app-sidenav-link">
                            <mat-icon matListIcon>rowing</mat-icon>
                            <span matLine>Quick Search</span>
                        </mat-list-item>

                        <mat-list-item class="app-sidenav-link">
                            <mat-icon matListIcon>cloud</mat-icon>
                            <span matLine>Cloud</span>
                        </mat-list-item>

                        <mat-list-item class="app-sidenav-link">
                            <mat-icon matListIcon>settings</mat-icon>
                            <span matLine>Settings</span>
                        </mat-list-item>

                        <mat-list-item adf-logout class="app-sidenav-link" data-automation-id="Logout">
                            <mat-icon matListIcon>exit_to_app</mat-icon>
                            <span matLine>Logout</span>
                        </mat-list-item>
                    </mat-nav-list>
                </ng-template>
            </adf-sidenav-layout-navigation>

            <adf-sidenav-layout-content>
                <ng-template>
                    <div class="fake-router-outlet">
                        Thanks to transclusion you can put anything you want inside header, sidenav and this (content) sections.
                        <a href="https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/core/components/header.component.md"
                        target="_blank">ADF Layout Header component</a> is located in header section. In navigation, there is
                        <a href="https://material.angular.io/components/list/overview#navigation-lists"
                        target="_blank">Angular Material Navigation list</a> where items can contain routes to ADF components which then they will be rendered here, in content section.
                        <br/><br/>
                        Bob Ross Lorem ipsum.. I'm gonna start with a little Alizarin crimson and a touch of Prussian blue No pressure. Just relax and watch it happen. In life you need colors.
                        This is your world, whatever makes you happy you can put in it. Go crazy. Have fun with it.
                        Just relax and let it flow. That easy. We might as well make some Almighty mountains today as well, what the heck. Each highlight must have it's own private shadow.
                        It's so important to do something every day that will make you happy.
                        Use your imagination, let it go. The very fact that you're aware of suffering is enough reason to be overjoyed that you're alive and can experience it.
                        <br/><br/>
                        Brown is such a nice color. Let your imagination be your guide. You need the dark in order to show the light.
                        Don't be afraid to make these big decisions. Once you start, they sort of just make themselves.
                        Don't kill all your dark areas - you need them to show the light. We artists are a different breed of people. We're a happy bunch.
                        You can create the world you want to see and be a part of. You have that power. We'll have a super time. If these lines aren't straight, your water's going to run right out of your painting and get your floor wet.
                        Nature is so fantastic, enjoy it. Let it make you happy. Didn't you know you had that much power?
                        You can move mountains. You can do anything. If you do too much it's going to lose its effectiveness. Everything's not great in life, but we can still find beauty in it.
                        And maybe, maybe, maybe... I like to beat the brush. And maybe a little bush lives there. Every single thing in the world has its own personality - and it is up to you to make friends with the little rascals.
                    </div>
                </ng-template>
            </adf-sidenav-layout-content>
        </div>
    </adf-sidenav-layout>`
});

export const sidenavLayout = template.bind({});
sidenavLayout.args = {
    sidenavMin: 85,
    sidenavMax: 250,
    stepOver: 600,
    position: 'start',
    title: 'Hello from Sidenav Layout!'
};
