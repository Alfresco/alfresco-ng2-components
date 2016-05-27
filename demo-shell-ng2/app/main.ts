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

import { bootstrap }    from 'angular2/platform/browser';
import { AppComponent } from './app.component';
import { ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS }    from 'angular2/http';
import { ALFRESCO_CORE_PROVIDERS } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { UploadService } from 'ng2-alfresco-upload/dist/ng2-alfresco-upload';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    ALFRESCO_CORE_PROVIDERS,
    UploadService
]);
