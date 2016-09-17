/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { bootstrap } from '@angular/platform-browser-dynamic';
import { PLATFORM_PIPES } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ALFRESCO_SEARCH_PROVIDERS } from 'ng2-alfresco-search';
import { ALFRESCO_CORE_PROVIDERS, AlfrescoPipeTranslate } from 'ng2-alfresco-core';
import { ATIVITI_FORM_PROVIDERS } from 'ng2-activiti-form';
import { UploadService } from 'ng2-alfresco-upload';
import { AppComponent } from './app.component';
import { appRouterProviders } from './app.routes';

bootstrap(AppComponent, [
    appRouterProviders,
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS,
    { provide: PLATFORM_PIPES, useValue: AlfrescoPipeTranslate, multi: true },
    ALFRESCO_SEARCH_PROVIDERS,
    UploadService,
    ATIVITI_FORM_PROVIDERS
]).catch(err => console.error(err));
