/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { AboutComponent } from './about.component';
import { ABOUT_DIRECTIVES } from './about.module';
import { AuthenticationService } from '../auth/services/authentication.service';
import { AuthenticationMock } from '../auth/mock/authentication.service.mock';
import { AppExtensionService, ExtensionRef, ViewerExtensionRef } from '@alfresco/adf-extensions';
import { AppConfigService } from '../app-config/app-config.service';
import { AppConfigServiceMock } from '../common/mock/app-config.service.mock';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppExtensionServiceMock {
    references$: Observable<ExtensionRef[]>;
    private _references = new BehaviorSubject<ExtensionRef[]>([]);

    constructor() {
        this.references$ = this._references.asObservable();
    }

    getViewerExtensions(): ViewerExtensionRef[] {
        return [];
    }
}

export default {
    component: AboutComponent,
    title: 'Core/About/About',
    decorators: [
        moduleMetadata({
            imports: [...ABOUT_DIRECTIVES],
            providers: [
                { provide: AuthenticationService, useClass: AuthenticationMock },
                { provide: AppExtensionService, useClass: AppExtensionServiceMock },
                { provide: AppConfigService, useClass: AppConfigServiceMock }
            ]
        })
    ],
    argTypes: {
        dev: {
            control: 'boolean',
            description: 'If active show more information about the app and the platform useful in debug.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        pkg: {
            control: 'object',
            description: 'pkg json.',
            table: {
                type: { summary: 'object' }
            }
        },
        regexp: {
            control: 'text',
            description: 'Regular expression for filtering dependencies packages.',
            defaultValue: '^(@alfresco)',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '^(@alfresco)' }
            }
        }
    }
} as Meta<AboutComponent>;

const template: StoryFn<AboutComponent> = (args) => ({
    props: args
});

export const About = template.bind({ /* empty */ });
About.args = {
    pkg: {
        name: 'My Storybook App',
        commit: 'my-commit-value',
        version: '1.0.0',
        dependencies: {
            '@alfresco/adf-content-services': '4.7.0',
            '@alfresco/adf-core': '4.7.0',
            '@alfresco/adf-extensions': '4.7.0',
            '@alfresco/adf-process-services': '4.7.0',
            '@alfresco/adf-process-services-cloud': '4.7.0',
            '@alfresco/js-api': '4.7.0-3976'
        }
    }
};
