/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { applicationConfig, componentWrapperDecorator, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { CoreStoryModule } from '../testing/core.story.module';
import { LANGUAGE_MENU_DIRECTIVES } from './language-menu.module';
import { LanguagePickerComponent } from './language-picker.component';
import { LanguageService } from './service/language.service';
import { LanguageServiceMock } from '../mock/language.service.mock';
import { importProvidersFrom } from '@angular/core';

export default {
    component: LanguagePickerComponent,
    title: 'Core/Language Menu/Language Picker',
    decorators: [
        moduleMetadata({
            imports: [...LANGUAGE_MENU_DIRECTIVES],
            providers: [{ provide: LanguageService, useClass: LanguageServiceMock }]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
        })
    ],
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
} as Meta<LanguagePickerComponent>;

const languagePickerComponentTemplate: StoryFn<LanguagePickerComponent> = (args) => ({
    props: args
});

export const Primary = languagePickerComponentTemplate.bind({});
Primary.parameters = { layout: 'centered' };

export const AsNestedMenu = languagePickerComponentTemplate.bind({});
AsNestedMenu.decorators = [
    componentWrapperDecorator(
        (story) => `
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        ${story}
      </mat-menu>
    `
    )
];
AsNestedMenu.parameters = { layout: 'centered' };
