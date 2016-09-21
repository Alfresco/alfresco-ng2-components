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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SearchModule } from 'ng2-alfresco-search';

import { AppComponent } from './app.component';
import { routing } from './app.routes';

import { SearchBarComponent } from './components/index';
import { MDL, ALFRESCO_CORE_PROVIDERS, CONTEXT_MENU_DIRECTIVES, AlfrescoPipeTranslate } from 'ng2-alfresco-core';
import { ALFRESCO_LOGIN_DIRECTIVES } from 'ng2-alfresco-login';
import { ALFRESCO_DATATABLE_DIRECTIVES, PaginationComponent } from 'ng2-alfresco-datatable';
import { ALFRESCO_TASKLIST_DIRECTIVES } from 'ng2-activiti-tasklist';
import { ACTIVITI_PROCESSLIST_DIRECTIVES } from 'ng2-activiti-processlist';
import { ActivitiForm, ATIVITI_FORM_PROVIDERS } from 'ng2-activiti-form';
import { DOCUMENT_LIST_DIRECTIVES, DOCUMENT_LIST_PROVIDERS } from 'ng2-alfresco-documentlist';
import { ALFRESCO_ULPOAD_COMPONENTS, UploadService } from 'ng2-alfresco-upload';
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer';
import { ALFRESCO_SEARCH_DIRECTIVES, ALFRESCO_SEARCH_PROVIDERS } from 'ng2-alfresco-search';
import { TAGCOMPONENT, TAGSERVICES } from 'ng2-alfresco-tag';
import { WEBSCRIPTCOMPONENT } from 'ng2-alfresco-webscript';

@NgModule({
    imports: [
        BrowserModule,
        routing,
        SearchModule.forRoot()
    ],
    declarations: [
        AppComponent,
        SearchBarComponent,
        MDL,
        ...ALFRESCO_LOGIN_DIRECTIVES,
        ...ALFRESCO_DATATABLE_DIRECTIVES, PaginationComponent,
        ...ALFRESCO_TASKLIST_DIRECTIVES,
        ...ACTIVITI_PROCESSLIST_DIRECTIVES,
        ActivitiForm,
        ...DOCUMENT_LIST_DIRECTIVES,
        ...CONTEXT_MENU_DIRECTIVES,
        ...ALFRESCO_ULPOAD_COMPONENTS,
        ...VIEWERCOMPONENT,
        ...ALFRESCO_SEARCH_DIRECTIVES,
        ...TAGCOMPONENT,
        ...WEBSCRIPTCOMPONENT,
        AlfrescoPipeTranslate
    ],
    providers: [
        ...ALFRESCO_CORE_PROVIDERS,
        ...DOCUMENT_LIST_PROVIDERS,
        ...ATIVITI_FORM_PROVIDERS,
        ...ALFRESCO_SEARCH_PROVIDERS,
        ...TAGSERVICES,
        UploadService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }

