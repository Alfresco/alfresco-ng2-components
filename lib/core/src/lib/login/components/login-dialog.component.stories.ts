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

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CoreStoryModule } from '../../testing/core.story.module';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginModule } from './../login.module';
import { LoginDialogStorybookComponent } from './login-dialog.stories.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { AuthenticationMock } from '../../auth/mock/authentication.service.mock';

export default {
    component: LoginDialogStorybookComponent,
    title: 'Core/Login/Login Dialog',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, LoginModule, RouterTestingModule, MatButtonModule],
            providers: [
                { provide: AuthenticationService, useClass: AuthenticationMock }
            ]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Allows a user to perform a login via a dialog.`
            }
        }
    },
    argTypes: {
        correct: {
            control: 'none',
            name: 'To test correct functionality:',
            description: 'Use `fake-username` and `fake-password`.',
            table: { category: 'Storybook Info' }
        },
        corsError: {
            control: 'none',
            name: 'To test CORS error:',
            description: 'Use `fake-username-CORS-error` and `fake-password`.',
            table: { category: 'Storybook Info' }
        },
        csrfError: {
            control: 'none',
            name: 'To test CSRF error:',
            description: 'Use `fake-username-CSRF-error` and `fake-password`.',
            table: { category: 'Storybook Info' }
        },
        ecmAccessError: {
            control: 'none',
            name: 'To test ECM access error:',
            description: 'Use `fake-username-ECM-access-error` and `fake-password`.',
            table: { category: 'Storybook Info' }
        },
        closed: {
            action: 'closed',
            description: 'Emitted when the dialog is closed.',
            table: {
                type: { summary: 'EventEmitter <any>' },
                category: 'Actions'
            }
        },
        error: {
            action: 'error',
            description: 'Emitted when the login fails.',
            table: {
                type: { summary: 'EventEmitter <any>' },
                category: 'Actions'
            }
        },
        executeSubmit: {
            action: 'executeSubmit',
            description: 'Emitted when the login form is submitted.',
            table: {
                type: { summary: 'EventEmitter <any>' },
                category: 'Actions'
            }
        }
    }
} as Meta;

const template: Story<LoginDialogStorybookComponent> = (args: LoginDialogStorybookComponent) => ({
    props: args
});

export const loginDialog = template.bind({});
loginDialog.parameters = { layout: 'centered' };
