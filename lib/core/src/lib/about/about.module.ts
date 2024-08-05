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

import { NgModule } from '@angular/core';
import { AboutServerSettingsComponent } from './about-server-settings/about-server-settings.component';
import { AboutExtensionListComponent } from './about-extension-list/about-extension-list.component';
import { AboutLicenseListComponent } from './about-license-list/about-license-list.component';
import { PackageListComponent } from './about-package/package-list.component';
import { AboutStatusListComponent } from './about-status-list/about-status-list.component';
import { ModuleListComponent } from './about-module-list/module-list.component';
import { AboutComponent } from './about.component';
import { AboutPanelDirective } from './about-panel.directive';
import { AboutRepositoryInfoComponent } from './about-repository-info/about-repository-info.component';

export const ABOUT_DIRECTIVES = [
    AboutExtensionListComponent,
    AboutLicenseListComponent,
    ModuleListComponent,
    AboutRepositoryInfoComponent,
    PackageListComponent,
    AboutStatusListComponent,
    AboutServerSettingsComponent,
    AboutPanelDirective,
    AboutComponent
] as const;

/** @deprecated import `ABOUT_DIRECTIVES` or standalone components instead */
@NgModule({
    imports: [...ABOUT_DIRECTIVES],
    exports: [...ABOUT_DIRECTIVES]
})
export class AboutModule { /* empty */ }
