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

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { AboutComponent } from './about.component';
import { AboutModule } from './about.module';
import { AuthenticationService, DiscoveryApiService } from '../services';
import { AppConfigServiceMock, AuthenticationMock } from '../mock';
import { DiscoveryApiServiceMock } from '../mock/discovery-api.service.mock';
import { AppExtensionService, AppExtensionServiceMock } from '@alfresco/adf-extensions';
import { AppConfigService } from '../app-config/app-config.service';
import { CoreStoryModule } from '../testing/core.story.module';

export default {
    component: AboutComponent,
    title: 'Core/Components/About',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, AboutModule],
            providers: [
                { provide: AuthenticationService, useClass: AuthenticationMock },
                { provide: DiscoveryApiService, useClass: DiscoveryApiServiceMock },
                { provide: AppExtensionService, useClass: AppExtensionServiceMock },
                { provide: AppConfigService, useClass: AppConfigServiceMock }
            ]
        })
    ]
} as Meta;

const template: Story<AboutComponent> = (args: AboutComponent) => ({
    props: args
});

export const devAbout = template.bind({});

devAbout.args = {
    dev: true,
    pkg: {
        name: 'My Storybook App', commit: 'my-commit-value', version: '1.0.0', dependencies: {
            '@alfresco/adf-content-services': '4.7.0',
            '@alfresco/adf-core': '4.7.0',
            '@alfresco/adf-extensions': '4.7.0',
            '@alfresco/adf-process-services': '4.7.0',
            '@alfresco/adf-process-services-cloud': '4.7.0',
            '@alfresco/js-api': '4.7.0-3976'
        }
    }
};

export const prodAbout = template.bind({});
prodAbout.args = {
    dev: false
};
