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

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '../core.module';
import { DatePipe } from '@angular/common';
import { directionalityConfigFactory } from '../common/services/directionality-config-factory';
import { DirectionalityConfigService } from '../common/services/directionality-config.service';
import { NoopTranslateModule } from './noop-translate.module';
import { NoopAuthModule } from './noop-auth.module';

@NgModule({
    imports: [NoopAnimationsModule, CoreModule.forRoot(), NoopTranslateModule, NoopAuthModule],
    providers: [
        DatePipe,
        {
            provide: APP_INITIALIZER,
            useFactory: directionalityConfigFactory,
            deps: [DirectionalityConfigService],
            multi: true
        }
    ],
    exports: [CoreModule]
})
export class CoreTestingModule {}
