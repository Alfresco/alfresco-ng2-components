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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService, DebugAppConfigService, CoreModule, AuthModule, provideTranslations } from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { ContentModule } from '@alfresco/adf-content-services';
import { ProcessModule } from '@alfresco/adf-process-services';
import { environment } from '../environments/environment';
import { ProcessServicesCloudModule } from '@alfresco/adf-process-services-cloud';
import { RouterModule } from '@angular/router';
import { CoreAutomationService } from '../testing/automation.service';

@NgModule({
    imports: [
        BrowserModule,
        environment.e2e ? NoopAnimationsModule : BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, { useHash: true }),
        AuthModule.forRoot({ useHash: true }),
        HttpClientModule,
        TranslateModule.forRoot(),
        CoreModule.forRoot(),
        ContentModule.forRoot(),
        ProcessModule.forRoot(),
        ProcessServicesCloudModule.forRoot(),
        ExtensionsModule.forRoot()
    ],
    declarations: [AppComponent],
    providers: [
        { provide: AppConfigService, useClass: DebugAppConfigService }, // not use this service in production
        provideTranslations('app', 'resources'),
        provideTranslations('adf-insights', 'assets/adf-insights')
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(automationService: CoreAutomationService) {
        automationService.setup();
    }
}
