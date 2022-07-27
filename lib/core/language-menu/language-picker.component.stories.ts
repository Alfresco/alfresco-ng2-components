import { LanguagePickerComponent } from './language-picker.component';
import { LanguageMenuComponent } from './language-menu.component';
import { LanguageMenuModule } from './language-menu.module';
import { MatMenuModule } from '@angular/material/menu';
import { CoreStoryModule } from './../testing/core.story.module';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { MatIconModule } from '@angular/material/icon';

export default {
    component: LanguagePickerComponent,
    title: 'Core/Components/Language Menu/Language Picker',
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

export const Default = Template.bind({});
Default.args = {
  };

export const InsideNestedMenu = Template.bind({});
InsideNestedMenu.args = {
  ...Default.args
};
InsideNestedMenu.decorators = [
    componentWrapperDecorator(story =>
        `<button mat-icon-button class="dw-profile-menu" [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
         </button>
         <mat-menu #menu="matMenu">
            ${story}
         </mat-menu>`
        )
];
