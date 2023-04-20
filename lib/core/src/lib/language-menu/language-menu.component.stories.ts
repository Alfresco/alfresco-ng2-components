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

import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { CoreStoryModule } from '../testing/core.story.module';

import { LanguageMenuModule } from './language-menu.module';
import { LanguageMenuComponent } from './language-menu.component';

import { LanguageService } from './service/language.service';
import { LanguageServiceMock } from '../mock/language.service.mock';

export default {
    component: LanguageMenuComponent,
    title: 'Core/Language Menu/Language Menu',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, LanguageMenuModule],
            providers: [
                { provide: LanguageService, useClass: LanguageServiceMock }
            ]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Displays all the languages that are present in "app.config.json" and the default (EN).`
            }
        }
    },
    argTypes: {
        changedLanguage: {
            action: 'changedLanguage',
            description: 'Emitted when the user clicks on one of the language buttons.',
            table: {
                category: 'Actions',
                type: { summary: 'EventEmitter <LanguageItem>' }
            }
        }
    }
} as Meta;

const languageMenuComponentTemplate: Story<LanguageMenuComponent> = (args: LanguageMenuComponent) => ({
    props: args
});
languageMenuComponentTemplate.parameters = { layout: 'centered' };

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
asMainMenu.parameters = { layout: 'centered' };

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
asNestedMenu.parameters = { layout: 'centered' };
