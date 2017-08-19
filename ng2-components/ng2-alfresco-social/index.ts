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
import { CoreModule } from 'ng2-alfresco-core';

import { LikeComponent } from './src/components/like.component';
import { RatingComponent } from './src/components/rating.component';
import { MaterialModule } from './src/material.module';
import { RatingService } from './src/services/rating.service';

export * from './src/components/rating.component';
export * from './src/components/like.component';
export * from './src/services/rating.service';

export const RATING_DIRECTIVES: any[] = [
    RatingComponent,
    LikeComponent
];

export const RATING_PROVIDERS: any[] = [
    RatingService
];

@NgModule({
    imports: [
        CoreModule,
        MaterialModule
    ],
    declarations: [
        ...RATING_DIRECTIVES
    ],
    providers: [
        ...RATING_PROVIDERS
    ],
    exports: [
        ...RATING_DIRECTIVES
    ]
})
export class SocialModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SocialModule,
            providers: [
                ...RATING_DIRECTIVES
            ]
        };
    }
}
