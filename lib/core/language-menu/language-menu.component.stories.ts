import { LanguageMenuModule } from './language-menu.module';
import { CoreStoryModule } from './../testing/core.story.module';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { LanguageMenuComponent } from './language-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export default {
    component: LanguageMenuComponent,
    title: 'Core/Components/Language Menu/Language Menu',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, LanguageMenuModule, MatMenuModule, MatIconModule, TranslateModule]
        })
    ],
    argTypes: {
    }
} as Meta;

const Template: Story<LanguageMenuComponent> = (args) => ({
    props: args
});

export const LanguageMenuAsMainMenu = Template.bind({});
LanguageMenuAsMainMenu.args = {
    key1 : 'CORE.HOST_SETTINGS.TITLE',
    key2 : 'ADF.LANGUAGE',
    key3 : 'CORE.METADATA.ACTIONS.SAVE'
};
LanguageMenuAsMainMenu.decorators = [
    componentWrapperDecorator(story => `<button mat-icon-button [matMenuTriggerFor]="langMenu">
        <mat-icon>
          language
        </mat-icon>
      </button>
      <mat-menu #langMenu="matMenu">
        ${story}
    </mat-menu>`)
];

export const LanguageMenuAsNestedMenu = Template.bind({});
LanguageMenuAsNestedMenu.args = {
    ...LanguageMenuAsMainMenu.args
};
LanguageMenuAsNestedMenu.decorators = [
    componentWrapperDecorator(story => `<button mat-icon-button [matMenuTriggerFor]="profileMenu">
        <mat-icon>
          more_vert
        </mat-icon>
      </button>
      <mat-menu #profileMenu="matMenu">
        <button mat-menu-item>
        {{ '${LanguageMenuAsNestedMenu.args.key1}' | translate }}
        </button>
        <button mat-menu-item [matMenuTriggerFor]="langMenu">
        {{ 'ADF.LANGUAGE' | translate }}
        </button>
        <button mat-menu-item>
        {{ 'CORE.METADATA.ACTIONS.SAVE' | translate }}
        </button>
      </mat-menu>
      <mat-menu #langMenu="matMenu">
        ${story}
      </mat-menu>`)
];
