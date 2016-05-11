/**
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

import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS}    from 'angular2/http';
import {TranslateLoader, TranslateService} from 'ng2-translate/ng2-translate';
import {ALFRESCO_AUTHENTICATION} from 'ng2-alfresco-login/ng2-alfresco-login';
import {ALFRESCO_CORE_PROVIDERS} from 'ng2-alfresco-core/services';
import {AlfrescoTranslationLoader} from 'ng2-alfresco-core/services';
import {provide} from 'angular2/core';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(TranslateLoader, {useClass: AlfrescoTranslationLoader}),
    TranslateService,
    ALFRESCO_AUTHENTICATION,
    ALFRESCO_CORE_PROVIDERS
]);
