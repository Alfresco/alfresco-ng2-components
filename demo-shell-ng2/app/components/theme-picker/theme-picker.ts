import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, NgModule} from '@angular/core';
import {
    MdButtonModule, MdGridListModule, MdIconModule, MdMenuModule,
    MdTooltipModule
} from '@angular/material';
import {StyleManager} from './style-manager/style-manager';
import {DocsSiteTheme, ThemeStorage} from './theme-storage/theme-storage';

@Component({
    selector: 'theme-picker',
    templateUrl: 'theme-picker.html',
    styleUrls: ['theme-picker.css'],
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
            name: 'Pink Bluegrey Dark',
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
                private _themeStorage: ThemeStorage) {

    }

    installTheme(theme: DocsSiteTheme) {
        if (theme.isDefault === true) {
            this.styleManager.setStyle('theme', ``);
        } else {
            this.currentTheme = this._getCurrentThemeFromHref(theme.href);

            this.styleManager.setStyle('theme', `prebuilt-themes/${theme.href}`);

            if (this.currentTheme) {
                this._themeStorage.storeTheme(this.currentTheme);
            }
        }
    }

    private _getCurrentThemeFromHref(href: string): DocsSiteTheme {
        return this.themes.find(theme => theme.href === href);
    }
}

@NgModule({
    imports: [
        MdButtonModule,
        MdIconModule,
        MdMenuModule,
        MdGridListModule,
        MdTooltipModule,
        CommonModule
    ],
    exports: [ThemePickerComponent],
    declarations: [ThemePickerComponent],
    providers: [StyleManager, ThemeStorage]
})
export class ThemePickerModule {
}
