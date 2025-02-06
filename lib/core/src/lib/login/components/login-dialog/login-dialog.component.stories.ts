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

import { RouterTestingModule } from '@angular/router/testing';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { AuthenticationService } from '../../../auth';
import { AuthenticationMock } from '../../../auth/mock/authentication.service.mock';
import { LoginDialogStorybookComponent } from './login-dialog.stories.component';
import { LoginDialogComponent } from './login-dialog.component';
import { importProvidersFrom } from '@angular/core';
import { CoreStoryModule } from '../../../../..';

export default {
    component: LoginDialogStorybookComponent,
    title: 'Core/Login/Login Dialog',
    decorators: [
        moduleMetadata({
            imports: [LoginDialogComponent, RouterTestingModule]
        }),
        applicationConfig({
            providers: [
                { provide: AuthenticationService, useClass: AuthenticationMock },
                importProvidersFrom(CoreStoryModule)
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
            name: 'To test correct functionality:',
            description: 'Use `fake-username` and `fake-password`.',
            table: { category: 'Storybook Info' }
        },
        corsError: {
            name: 'To test CORS error:',
            description: 'Use `fake-username-CORS-error` and `fake-password`.',
            table: { category: 'Storybook Info' }
        },
        csrfError: {
            name: 'To test CSRF error:',
            description: 'Use `fake-username-CSRF-error` and `fake-password`.',
            table: { category: 'Storybook Info' }
        },
        ecmAccessError: {
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
} as Meta<LoginDialogStorybookComponent>;

const template: StoryFn<LoginDialogStorybookComponent> = (args) => ({
    props: args
});

export const LoginDialog = template.bind({});
LoginDialog.parameters = { layout: 'centered' };
