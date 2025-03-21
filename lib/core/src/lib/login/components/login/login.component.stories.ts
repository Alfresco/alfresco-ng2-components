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

import { RouterModule } from '@angular/router';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { AuthenticationService } from '../../../auth';
import { AuthenticationMock } from '../../../auth/mock/authentication.service.mock';
import { LoginComponent } from './login.component';
import { importProvidersFrom } from '@angular/core';
import { CoreStoryModule } from '../../../../..';

export default {
    component: LoginComponent,
    title: 'Core/Login/Login',
    decorators: [
        moduleMetadata({
            imports: [LoginComponent],
            providers: [{ provide: AuthenticationService, useClass: AuthenticationMock }]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule), importProvidersFrom(RouterModule.forRoot([], { useHash: true }))]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Authenticates to Alfresco Content Services and Alfresco Process Services.`
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
        showRememberMe: {
            control: 'boolean',
            description:
                'Should the `Remember me` checkbox be shown? When selected, this option will remember the logged-in user after the browser is closed to avoid logging in repeatedly.',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        showLoginActions: {
            control: 'boolean',
            description: 'Should the extra actions (`Need Help`, `Register`, etc) be shown?',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        needHelpLink: {
            control: 'text',
            description: 'Sets the URL of the NEED HELP link in the footer.',
            defaultValue: '/?path=/story/core-login-login--login',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '/?path=/story/core-login-login--login' }
            }
        },
        registerLink: {
            control: 'text',
            description: 'Sets the URL of the REGISTER link in the footer.',
            defaultValue: '/?path=/story/core-login-login--login',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '/?path=/story/core-login-login--login' }
            }
        },
        logoImageUrl: {
            control: 'text',
            description: 'Path to a custom logo image.',
            defaultValue: './assets/images/alfresco-logo.svg',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: './assets/images/alfresco-logo.svg' }
            }
        },
        backgroundImageUrl: {
            control: 'text',
            description: 'Path to a custom background image.',
            defaultValue: './assets/images/background.svg',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: './assets/images/background.svg' }
            }
        },
        copyrightText: {
            control: 'text',
            description: 'The copyright text below the login box.',
            defaultValue: '\u00A9 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '\u00A9 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.' }
            }
        },
        fieldsValidation: {
            control: 'object',
            description: 'Custom validation rules for the login form.',
            table: {
                type: { summary: 'any' },
                defaultValue: { summary: 'undefined' }
            }
        },
        successRoute: {
            control: 'text',
            description: 'Route to redirect to on successful login.',
            defaultValue: '.',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '.' }
            }
        },
        success: {
            action: 'success',
            description: 'Emitted when the login is successful.',
            table: {
                type: { summary: 'EventEmitter <LoginSuccessEvent>' },
                category: 'Actions'
            }
        },
        error: {
            action: 'error',
            description: 'Emitted when the login fails.',
            table: {
                type: { summary: 'EventEmitter <LoginErrorEvent>' },
                category: 'Actions'
            }
        },
        executeSubmit: {
            action: 'executeSubmit',
            description: 'Emitted when the login form is submitted.',
            table: {
                type: { summary: 'EventEmitter <LoginSubmitEvent>' },
                category: 'Actions'
            }
        }
    }
} as Meta<LoginComponent>;

const template: StoryFn<LoginComponent> = (args) => ({
    props: args
});

export const Login = template.bind({});
