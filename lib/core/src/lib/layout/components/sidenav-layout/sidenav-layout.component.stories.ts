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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis non massa dictum porttitor. Nam ac elit nulla. Morbi posuere odio at
                        ornare venenatis. Etiam rhoncus suscipit purus, eu tincidunt ante vulputate at. Cras quis neque felis. Maecenas augue turpis, suscipit non
                        aliquet sit amet, aliquet at turpis. Etiam feugiat mattis nisi imperdiet aliquet. Donec ornare ex non turpis ullamcorper, non lacinia elit
                        volutpat. Integer congue nunc lacus, vel sagittis ipsum sagittis sit amet. Integer eu arcu rutrum, semper urna non, efficitur libero.
                        Aliquam fringilla quis felis sit amet convallis. Aliquam non egestas urna. Proin consectetur lacinia tincidunt. Vestibulum et leo lacus.
                        Nam efficitur nte mollis lobortis pharetra. Nullam elit ligula, ullamcorper sed orci id, pharetra commodo est.
                        Vestibulum ac accumsan urna, sit amet pellentesque nunc. Sed non metus quis elit pretium varius et in eros.
                        <br/>
                        Maecenas pellentesque felis eu dolor facilisis, ut pellentesque quam condimentum. Morbi fermentum, tortor et feugiat tempus, nunc elit
                        malesuada ligula, pretium dictum erat felis vitae odio. Donec eros ante, blandit a augue sed, aliquet imperdiet velit. Duis nibh justo,
                        dignissim in sodales id, faucibus fermentum ante. Cras semper mauris ac velit iaculis, ac scelerisque ipsum mattis. Nunc vitae arcu gravida,
                        mollis dui a, tempor dolor. Cras malesuada eleifend elementum. Fusce nisl velit, ultricies quis justo id, imperdiet venenatis magna. Cras
                        hendrerit massa at mi varius finibus. Cras vitae nibh et nisl fermentum posuere nec ut libero. Nunc erat quam, tristique a mauris eget, dictum
                        volutpat nisl.
                    </div>
                </ng-template>
            </adf-sidenav-layout-content>
        </div>
    </adf-sidenav-layout>`
});

export const SidenavLayout = template.bind({});
SidenavLayout.args = {
    sidenavMin: 85,
    sidenavMax: 250,
    stepOver: 600,
    position: 'start',
    title: 'Hello from Sidenav Layout!'
};
