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
import { CoreModule, IdentityGroupService, TRANSLATION_PROVIDER } from '@alfresco/adf-core';
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
                { provide: IdentityGroupService, useClass: IdentityGroupServiceMock}
            ]
        })
    ],
    argTypes: {
        appName: { table: { disable: true } }
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
    title: 'title'
};
