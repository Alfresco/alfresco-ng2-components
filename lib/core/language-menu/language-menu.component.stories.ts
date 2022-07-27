import { LanguageMenuModule } from './language-menu.module';
import { CoreStoryModule } from './../testing/core.story.module';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { LanguageMenuComponent } from './language-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

export default {
    component: LanguageMenuComponent,
    title: 'Core/Components/Language Menu/Language Menu',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, LanguageMenuModule, MatMenuModule, MatIconModule]
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
};
LanguageMenuAsNestedMenu.decorators = [
    componentWrapperDecorator(story => `<button mat-icon-button [matMenuTriggerFor]="profileMenu">
        <mat-icon>
          more_vert
        </mat-icon>
      </button>
      <mat-menu #profileMenu="matMenu">
        <button mat-menu-item>
          profile-settings
        </button>
        <button mat-menu-item [matMenuTriggerFor]="langMenu">
          Languages
        </button>
        <button mat-menu-item>
         sign-out
        </button>
      </mat-menu>
      <mat-menu #langMenu="matMenu">
        ${story}
      </mat-menu>`)
];
