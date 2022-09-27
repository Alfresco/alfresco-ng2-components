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
import { CoreStoryModule } from '../../testing/core.story.module';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginModule } from './../login.module';
import { LoginDialogPanelComponent } from './login-dialog-panel.component';
import { CoreTestingModule } from './../../testing/core.testing.module';

export default {
    component: LoginDialogPanelComponent,
    title: 'Core/Login/Login Dialog Panel',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, LoginModule, RouterTestingModule, CoreTestingModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Shows and manages a login dialog.`
            }
        }
    },
    argTypes: {
        success: {
            action: 'success',
            description: 'Emitted when the login is successful.',
            table: {
                type: { summary: 'EventEmitter <LoginSuccessEvent>' },
                category: 'Actions'
            }
        }
    }
} as Meta;

const template: Story<LoginDialogPanelComponent> = (args: LoginDialogPanelComponent) => ({
    props: args,
    template: `
    <adf-login-dialog-panel (success)="success($event)">
    </adf-login-dialog-panel>
    `
});

export const loginDialogPanel = template.bind({});
