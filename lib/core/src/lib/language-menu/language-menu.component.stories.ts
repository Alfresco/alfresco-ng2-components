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

import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { CoreStoryModule } from '../testing/core.story.module';

import { LanguageMenuModule } from './language-menu.module';
import { LanguageMenuComponent } from './language-menu.component';

import { LanguageService } from '../services/language.service';
import { LanguageServiceMock } from '../mock/language.service.mock';

export default {
    component: LanguageMenuComponent,
    title: 'Core/Components/Language Menu/Language Menu',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, LanguageMenuModule],
            providers: [
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        })
    ]
} as Meta;

const languageMenuComponentTemplate: Story<LanguageMenuComponent> = (args: LanguageMenuComponent) => ({
    props: {
        ...args,
        changedLanguage: action('changedLanguage')
    }
});

export const asMainMenu = languageMenuComponentTemplate.bind({});
asMainMenu.decorators = [
    componentWrapperDecorator(story => `
      <button mat-icon-button [matMenuTriggerFor]="langMenu">
        <mat-icon>
          language
        </mat-icon>
      </button>
      <mat-menu #langMenu="matMenu">
        ${story}
      </mat-menu>
    `)
];

export const asNestedMenu = languageMenuComponentTemplate.bind({});
asNestedMenu.decorators = [
    componentWrapperDecorator(story => `
      <button mat-icon-button [matMenuTriggerFor]="profileMenu">
        <mat-icon>
          more_vert
        </mat-icon>
      </button>
      <mat-menu #profileMenu="matMenu">
        <button mat-menu-item [matMenuTriggerFor]="langMenu">
          <mat-icon>
            language
          </mat-icon>
          Language
        </button>
      </mat-menu>
      <mat-menu #langMenu="matMenu">
        ${story}
      </mat-menu>
    `)
];
