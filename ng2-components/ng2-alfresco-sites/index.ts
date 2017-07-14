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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { MdSelectModule } from '@angular/material';
import { CoreModule } from 'ng2-alfresco-core';
import { DropdownSitesComponent } from './src/components/sites-dropdown.component';
import { SitesService } from './src/services/sites.service';

export * from './src/services/sites.service';
export * from './src/models/site.model';

export const SITES_DIRECTIVES: any[] = [
    DropdownSitesComponent
];
export const SITES_PROVIDERS: any[] = [
    SitesService
];

@NgModule({
    imports: [
        CoreModule,
        MdSelectModule
    ],
    declarations: [
        ...SITES_DIRECTIVES
    ],
    providers: [
        ...SITES_PROVIDERS
    ],
    exports: [
        ...SITES_DIRECTIVES
    ]
})
export class SitesModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SitesModule,
            providers: [
                ...SITES_PROVIDERS
            ]
        };
    }
}
