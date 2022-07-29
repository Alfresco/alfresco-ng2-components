/*!
 * @license
 * Copyright 2022 Alfresco Software, Ltd.
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

import { LanguagePickerComponent } from './language-picker.component';
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

const languagePickerComponentTemplate: Story<LanguagePickerComponent> = () => ({});

export const primary = languagePickerComponentTemplate.bind({});

export const asNestedMenu = languagePickerComponentTemplate.bind({});
asNestedMenu.decorators = [
    componentWrapperDecorator(story => `
      <button mat-icon-button class="dw-profile-menu" [matMenuTriggerFor]="menu">
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        ${story}
      </mat-menu>
      `)
];
