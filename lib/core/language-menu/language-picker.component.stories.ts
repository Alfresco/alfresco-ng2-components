import { LanguagePickerComponent } from './language-picker.component';
import { LanguageMenuComponent } from './language-menu.component';
import { LanguageMenuModule } from './language-menu.module';
import { MatMenuModule } from '@angular/material/menu';
import { CoreStoryModule } from './../testing/core.story.module';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export default {
    component: LanguagePickerComponent,
    title: 'Core/Components/Language Menu/Language Picker',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, LanguageMenuModule, MatMenuModule, MatIconModule, TranslateModule]
        })
    ]
} as Meta;

const Template: Story<LanguageMenuComponent> = (args) => ({
    props: args
});

export const Default = Template.bind({});
Default.decorators = [
    componentWrapperDecorator(story =>`
      <style>
        table {font-family: arial, sans-serif;border-collapse: collapse;margin-top:10px;}
        td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}
      </style>
      ${story}
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
      <button mat-icon-button class="dw-profile-menu" [matMenuTriggerFor]="menu">
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
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
