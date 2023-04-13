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

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StyleManager } from './style-manager/style-manager';
import { DocsSiteTheme, ThemeStorage } from './theme-storage/theme-storage';

@Component({
    selector: 'app-theme-picker',
    templateUrl: './theme-picker.html',
    styleUrls: ['./theme-picker.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'aria-hidden': 'true'}
})
export class ThemePickerComponent {
    currentTheme;

    themes = [
        {
            primary: '#ff9800',
            accent: '#3f51b5',
            name: 'Developer Theme',
            href: '',
            isDefault: true
        },
        {
            primary: '#00bcd4',
            accent: '#ff9800',
            name: 'ECM Cyan Orange',
            href: 'adf-cyan-orange.css',
            isDark: false
        },
        {
            primary: '#00bcd4',
            accent: '#3f51b5',
            name: 'ECM Cyan Purple',
            href: 'adf-cyan-purple.css',
            isDark: false
        },
        {
            primary: '#8bc34a',
            accent: '#ff9800',
            name: 'BPM Green Orange',
            href: 'adf-green-orange.css',
            isDark: false
        },
        {
            primary: '#8bc34a',
            accent: '#3f51b5',
            name: 'BPM Green Purple',
            href: 'adf-green-purple.css',
            isDark: false
        },
        {
            primary: '#3f51b5',
            accent: '#ff4081',
            name: 'Indigo Pink',
            href: 'adf-indigo-pink.css',
            isDark: false
        },
        {
            primary: '#c2185b',
            accent: '#b0bec5',
            /* cspell:disable-next-line */
            name: 'Pink Bluegrey Dark',
            /* cspell:disable-next-line */
            href: 'adf-pink-bluegrey.css',
            isDark: false
        },
        {
            primary: '#7b1fa2',
            accent: '#69f0ae',
            name: 'Purple Green Dark',
            href: 'adf-purple-green.css',
            isDark: false
        },
        {
            primary: '#2196f3',
            accent: '#ff9800',
            name: 'ECM Blue Orange',
            href: 'adf-blue-orange.css',
            isDark: false
        },
        {
            primary: '#2196f3',
            accent: '#3f51b5',
            name: 'ECM Blue Purple',
            href: 'adf-blue-purple.css',
            isDark: false
        }
    ];

    constructor(public styleManager: StyleManager,
                private themeStorage: ThemeStorage) {

    }

    installTheme(theme: DocsSiteTheme) {
        if (theme.isDefault === true) {
            this.styleManager.setStyle('theme', ``);
        } else {
            this.currentTheme = this.getCurrentThemeFromHref(theme.href);

            this.styleManager.setStyle('theme', theme.href);

            if (this.currentTheme) {
                this.themeStorage.storeTheme(this.currentTheme);
            }
        }
    }

    private getCurrentThemeFromHref(href: string): DocsSiteTheme {
        return this.themes.find((theme) => theme.href === href);
    }
}

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatGridListModule,
        MatTooltipModule,
        MatListModule,
        CommonModule
    ],
    exports: [ThemePickerComponent],
    declarations: [ThemePickerComponent]
})
export class ThemePickerModule {
}
