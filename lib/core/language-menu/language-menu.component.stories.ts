import { LanguageService } from '../services/language.service';
import { LanguageMenuModule } from './language-menu.module';
import { CoreStoryModule } from '../testing/core.story.module';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { LanguageMenuComponent } from './language-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { action } from '@storybook/addon-actions';
import { LanguageServiceMock } from '../mock/language.service.mock';

export default {
    component: LanguageMenuComponent,
    title: 'Core/Components/Language Menu/Language Menu',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, LanguageMenuModule, MatMenuModule, MatIconModule, TranslateModule],
            providers: [
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        })
    ]
} as Meta;

const Template: Story<LanguageMenuComponent> = (args) => ({
    props: {
        ...args,
        changedLanguage: action('changedLanguage')
    }
});

export const AsMainMenu = Template.bind({});
AsMainMenu.decorators = [
    componentWrapperDecorator(story => `
      <style>
        table {font-family: arial, sans-serif;border-collapse: collapse;margin-top:10px;}
        td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}
      </style>
      <button mat-icon-button [matMenuTriggerFor]="langMenu">
        <mat-icon>
          language
        </mat-icon>
      </button>
      <mat-menu #langMenu="matMenu">
        ${story}
      </mat-menu>
        <table>
          <tr><th>Example key</th><th>Value</th></tr>
          <tr><td>CORE.HOST_SETTINGS.TITLE</td><td>{{ 'CORE.HOST_SETTINGS.TITLE' | translate }}</td></tr>
          <tr><td>CORE.METADATA.ACTIONS.SAVE</td><td>{{ 'CORE.METADATA.ACTIONS.SAVE' | translate }}</td></tr>
          <tr><td>ADF.LANGUAGE</td><td>{{ 'ADF.LANGUAGE' | translate }}</td></tr>
        </table>
    `)
];

export const AsNestedMenu = Template.bind({});
AsNestedMenu.decorators = [
    componentWrapperDecorator(story => `
      <style>
        table {font-family: arial, sans-serif;border-collapse: collapse;margin-top:10px;}
        td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}
      </style>
      <button mat-icon-button [matMenuTriggerFor]="profileMenu">
        <mat-icon>
          more_vert
        </mat-icon>
      </button>
      <mat-menu #profileMenu="matMenu">
        <button mat-menu-item [matMenuTriggerFor]="langMenu">
        {{ 'ADF.LANGUAGE' | translate }}
        </button>
      </mat-menu>
      <mat-menu #langMenu="matMenu">
        ${story}
      </mat-menu>
      <table>
        <tr><th>Example key</th><th>Value</th></tr>
        <tr><td>CORE.HOST_SETTINGS.TITLE</td><td>{{ 'CORE.HOST_SETTINGS.TITLE' | translate }}</td></tr>
        <tr><td>CORE.METADATA.ACTIONS.SAVE</td><td>{{ 'CORE.METADATA.ACTIONS.SAVE' | translate }}</td></tr>
        <tr><td>ADF.LANGUAGE</td><td>{{ 'ADF.LANGUAGE' | translate }}</td></tr>
      </table>
      `)
];
