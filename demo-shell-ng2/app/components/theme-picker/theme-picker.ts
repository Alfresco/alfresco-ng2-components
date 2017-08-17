import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, NgModule, ViewEncapsulation} from '@angular/core';
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
            primary: '#c2185b',
            accent: '#b0bec5',
            href: 'adf-pink-bluegrey.css',
            isDark: false
        },
        {
            primary: '#3f51b5',
            accent: '#ff4081',
            href: 'adf-indigo-pink.css',
            isDark: false
        },
        {
            primary: '#ff9800',
            accent: '#536dfe',
            href: 'adf-orange-purple.css',
            isDark: false
        },
        {
            primary: '#7b1fa2',
            accent: '#69f0ae',
            href: 'adf-purple-green.css',
            isDark: false
        }
    ];

    constructor(public styleManager: StyleManager,
                private _themeStorage: ThemeStorage) {
        const currentTheme = this._themeStorage.getStoredTheme();
        if (currentTheme) {
            this.installTheme(currentTheme);
        }
    }

    installTheme(theme: DocsSiteTheme) {
        this.currentTheme = this._getCurrentThemeFromHref(theme.href);

        this.styleManager.setStyle('theme', `prebuilt-themes/${theme.href}`);

        if (this.currentTheme) {
            this._themeStorage.storeTheme(this.currentTheme);
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
