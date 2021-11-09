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

export default {
    component: AboutComponent,
    title: 'About Component',
    decorators: [
        moduleMetadata({
            imports: [AboutModule]
            // providers: [
            //     { provide: TaskCloudService, useClass: TaskCloudServiceMock }
            // ]
        })
    ]
} as Meta;

const template: Story<AboutComponent> = (args: AboutComponent) => ({
    props: args
});

export const devAbout = template.bind({});
devAbout.args = {
    dev: true,
};

export const prodAbout = template.bind({});
prodAbout.args = {
    dev:false
};
