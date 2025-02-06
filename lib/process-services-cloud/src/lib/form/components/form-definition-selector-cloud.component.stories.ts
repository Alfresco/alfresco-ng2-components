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

import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { FormDefinitionSelectorCloudComponent } from './form-definition-selector-cloud.component';
import { ProcessServicesCloudStoryModule } from '../../testing/process-services-cloud-story.module';
import { FormDefinitionSelectorCloudService } from '../services/form-definition-selector-cloud.service';
import { FormDefinitionSelectorCloudServiceMock } from '../mocks/form-definition-selector-cloud.service.mock';
import { importProvidersFrom } from '@angular/core';

export default {
    component: FormDefinitionSelectorCloudComponent,
    title: 'Process Services Cloud/Form Cloud/Form Definition Selector Cloud',
    decorators: [
        moduleMetadata({
            imports: [FormDefinitionSelectorCloudComponent],
            providers: [{ provide: FormDefinitionSelectorCloudService, useClass: FormDefinitionSelectorCloudServiceMock }]
        }),
        applicationConfig({
            providers: [importProvidersFrom(ProcessServicesCloudStoryModule)]
        })
    ],
    argTypes: {
        appName: {
            control: 'text',
            description: 'Name of the application. If specified, this shows the users who have access to the app.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' }
            }
        },
        selectForm: {
            action: 'selectForm',
            description: 'Emitted when a form is selected.',
            table: { category: 'Actions' }
        }
    },
    args: {
        appName: ''
    }
} as Meta<FormDefinitionSelectorCloudComponent>;

const template: StoryFn<FormDefinitionSelectorCloudComponent> = (args) => ({
    props: args
});

export const FormDefinitionSelectorCloud = template.bind({});
