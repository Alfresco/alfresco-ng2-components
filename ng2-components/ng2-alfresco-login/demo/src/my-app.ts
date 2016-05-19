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
import {MyLoginComponent} from './components/my-login.component';
import {ALFRESCO_AUTHENTICATION} from 'ng2-alfresco-login/ng2-alfresco-login';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {provide} from 'angular2/core';
import {Http} from 'angular2/http';
import {HTTP_PROVIDERS}    from 'angular2/http';
import {TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {ALFRESCO_CORE_PROVIDERS} from 'ng2-alfresco-core/services';

bootstrap(MyLoginComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'node_modules/ng2-alfresco-login/i18n', '.json'),
        deps: [Http]
    }),
    // use TranslateService here, and not TRANSLATE_PROVIDERS (which will define a default TranslateStaticLoader)
    TranslateService,
    ALFRESCO_AUTHENTICATION,
    ALFRESCO_CORE_PROVIDERS
]);
