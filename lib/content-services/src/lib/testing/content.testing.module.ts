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

import { NgModule, APP_INITIALIZER, Injectable } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule, NoopTranslateModule, NoopAuthModule } from '@alfresco/adf-core';
import { ContentModule } from '../content.module';
import { versionCompatibilityFactory } from '../version-compatibility/version-compatibility-factory';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { VersionCompatibilityService } from '../version-compatibility/version-compatibility.service';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { AlfrescoApiServiceMock } from '../mock';
import { AdfHttpClient } from '@alfresco/adf-core/api';

@Injectable()
export class MockAdfHttpClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post(_url: string, _body: any): Promise<any> {
        return Promise.resolve({ success: true, mockData: 'default response' });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    get(_url: string): Promise<unknown> {
        return Promise.resolve({ success: true, mockData: 'default get response' });
    }

    // Add other methods (put, delete, etc.) as needed with default mock behavior
}

@NgModule({
    imports: [NoopAnimationsModule, CoreModule, NoopAuthModule, NoopTranslateModule, ContentModule, MatIconTestingModule],
    providers: [
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        {
            provide: APP_INITIALIZER,
            useFactory: versionCompatibilityFactory,
            deps: [VersionCompatibilityService],
            multi: true
        },
        { provide: AdfHttpClient, useClass: MockAdfHttpClient }
    ],
    exports: [NoopAnimationsModule, CoreModule, ContentModule]
})
export class ContentTestingModule {}
