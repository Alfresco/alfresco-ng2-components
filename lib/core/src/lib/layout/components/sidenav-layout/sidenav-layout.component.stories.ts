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

import { applicationConfig, Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { LAYOUT_DIRECTIVES } from '../../layout.module';
import { SidenavLayoutComponent } from './sidenav-layout.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { provideStoryCore } from '../../../stories/core-story.providers';

type SidenavLayoutStoryArgs = SidenavLayoutComponent & {
    title?: string;
    color?: 'primary' | 'accent' | 'warn';
    clicked?: any;
};

const meta: Meta<SidenavLayoutStoryArgs> = {
    component: SidenavLayoutComponent,
    title: 'Core/Layout/Sidenav Layout',
    decorators: [
        moduleMetadata({
            imports: [...LAYOUT_DIRECTIVES, RouterTestingModule, MatIconModule, MatListModule]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
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
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 'undefined' },
                category: 'Navigation'
            }
        },
        sidenavMin: {
            control: 'number',
            description: 'Minimum size of the navigation region',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 'undefined' },
                category: 'Navigation'
            }
        },
        stepOver: {
            control: 'number',
            description: 'Screen size at which display switches from small screen to large screen configuration',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 'undefined' }
            }
        },
        title: {
            control: 'text',
            description: 'Title of the application',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' },
                category: 'Header'
            }
        },
        color: {
            control: 'radio',
            options: ['primary', 'accent', 'warn', undefined],
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
    },
    args: {
        expandedSidenav: true,
        hideSidenav: false,
        position: 'start'
    }
};

export default meta;
type Story = StoryObj<SidenavLayoutStoryArgs>;

export const SidenavLayout: Story = {
    render: (args) => ({
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
                            <mat-icon matListItemIcon>home</mat-icon>
                            <span matLine>Home</span>
                        </mat-list-item>

                        <mat-list-item class="app-sidenav-link">
                            <mat-icon matListItemIcon>device_hub</mat-icon>
                            <span matLine>Content Processes</span>
                        </mat-list-item>

                        <mat-list-item class="app-sidenav-link">
                            <mat-icon matListItemIcon>folder_open</mat-icon>
                            <span matLine>Files</span>
                        </mat-list-item>

                        <mat-list-item class="app-sidenav-link">
                            <mat-icon matListItemIcon>rowing</mat-icon>
                            <span matLine>Quick Search</span>
                        </mat-list-item>

                        <mat-list-item class="app-sidenav-link">
                            <mat-icon matListItemIcon>cloud</mat-icon>
                            <span matLine>Cloud</span>
                        </mat-list-item>

                        <mat-list-item class="app-sidenav-link">
                            <mat-icon matListItemIcon>settings</mat-icon>
                            <span matLine>Settings</span>
                        </mat-list-item>

                        <mat-list-item adf-logout class="app-sidenav-link" data-automation-id="Logout">
                            <mat-icon matListItemIcon>exit_to_app</mat-icon>
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        <br/><br/>
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
                        Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
                        Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident,
                        similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
                        Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus,
                        omnis voluptas assumenda est, omnis dolor repellendus.
                        Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
                        Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
                    </div>
                </ng-template>
            </adf-sidenav-layout-content>
        </div>
    </adf-sidenav-layout>`
    }),
    args: {
        sidenavMin: 85,
        sidenavMax: 250,
        stepOver: 600,
        position: 'start',
        title: 'Hello from Sidenav Layout!'
    }
};
