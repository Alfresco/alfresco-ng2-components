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

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { TranslateLoaderService, TRANSLATION_PROVIDER, IdentityUserService } from '@alfresco/adf-core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PeopleCloudComponent } from './people-cloud.component';
import { PeopleCloudModule } from '../people-cloud.module';
import { IdentityUserServiceMock } from '../mock/identity-user.service.mock';
import { mockUsers } from '../mock/user-cloud.mock';

export default {
    component: PeopleCloudComponent,
    title: 'Process Services Cloud/Components/People',
    decorators: [
        moduleMetadata({
            imports: [PeopleCloudModule, BrowserAnimationsModule, TranslateModule.forRoot()],
            providers: [
                { provide: TranslateLoader, useClass: TranslateLoaderService },
                {
                    provide: TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: 'adf-process-services-cloud',
                        source: 'assets/adf-process-services-cloud'
                    }
                },
                { provide: IdentityUserService, useClass: IdentityUserServiceMock }
            ]
        })
    ],
    argTypes: {
        appName: { table: { disable: true} },
        mode: {
            options: ['single', 'multiple'],
            control: { type: 'radio' }
        }
    }
} as Meta;

const template: Story<PeopleCloudComponent> = (args: PeopleCloudComponent) => ({
    props: args
});

export const primary = template.bind({});
primary.args = {
    appName: 'app',
    mode: 'multiple'
    // mode: 'single',
    // preSelectUsers: [],
    // readOnly: false,
    // roles: [],
    // searchUserCtrl: undefined,
    // title: 'title',
    // userChipsCtrl: undefined,
    // validate: false
};

export const excludedUsers = template.bind({});
excludedUsers.args = {
    ...primary.args,
    excludedUsers: [
        { id: 'fake-id-2' },
        { id: 'fake-id-3' }
    ]
};

export const noUsers = template.bind({});
noUsers.args = {
    ...primary.args,
    excludedUsers: mockUsers
};

export const invalidOrEmptyAppName = template.bind({});
invalidOrEmptyAppName.args = {
    ...primary.args,
    appName: null
};
