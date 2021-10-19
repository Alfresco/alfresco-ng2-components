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
import { CoreModule, IdentityGroupService, mockIdentityGroups, TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { GroupCloudModule } from '../group-cloud.module';
import { GroupCloudComponent } from './group-cloud.component';
import { TranslateModule } from '@ngx-translate/core';
import { IdentityGroupServiceMock } from '../mock/identity-group.service.mock';

export default {
    component: GroupCloudComponent,
    title: 'Process Services Cloud/Components/Group',
    decorators: [
        moduleMetadata({
            declarations: [],
            imports: [GroupCloudModule, BrowserAnimationsModule, TranslateModule.forRoot(), CoreModule.forRoot()],
            providers: [
                {
                    provide: TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: 'adf-process-services-cloud',
                        source: 'assets/adf-process-services-cloud'
                    }
                },
                { provide: IdentityGroupService, useClass: IdentityGroupServiceMock }
            ]
        })
    ],
    argTypes: {
        appName: { table: { disable: true } },
        mode: {
            options: ['single', 'multiple'],
            control: { type: 'radio' }
        },
        roles: {
            options: ['empty', 'user', 'admin'],
            control: { type: 'radio' },
            mapping: {
                empty: [],
                user: ['MOCK-USER-ROLE'],
                admin: ['MOCK-ADMIN-ROLE']
            },
            defaultValue: []
        }
    }
} as Meta;

const template: Story<GroupCloudComponent> = (args) => ({
    props: {
        ...args
    }
});

export const primary = template.bind({});
primary.args = {
    appName: 'app',
    mode: 'single',
    preSelectGroups: [],
    readOnly: false,
    roles: [],
    title: 'Groups',
    validate: false
};

export const validPreselectedGroups = template.bind({});
validPreselectedGroups.args = {
    ...primary.args,
    validate: true,
    mode: 'multiple',
    preSelectGroups: mockIdentityGroups
};

export const mandatoryPreselectedGroups = template.bind({});
mandatoryPreselectedGroups.args = {
    ...primary.args,
    validate: true,
    mode: 'multiple',
    preSelectGroups: [{ id: 'mock-group-id-1', name: 'Mock Group 1', path: '/mock', subGroups: [], readonly: true },
                      { id: 'mock-group-id-2', name: 'Mock Group 2', path: '', subGroups: [] },
                      { id: 'mock-group-id-3', name: 'Mock Group 3', path: '', subGroups: [], readonly: true }]
};

export const invalidPreselectedGroups = template.bind({});
invalidPreselectedGroups.args = {
    ...primary.args,
    validate: true,
    mode: 'multiple',
    preSelectGroups: [{ id: 'invalid-group', name: 'invalid group' }]
};

export const adminRoleGroups = template.bind({});
adminRoleGroups.args = {
    ...primary.args,
    roles: 'admin'
};

export const invalidOrEmptyAppName = template.bind({});
invalidOrEmptyAppName.args = {
    ...primary.args,
    appName: null
};
